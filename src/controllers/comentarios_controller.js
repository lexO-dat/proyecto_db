const { Pool } = require('pg');

// Configuración para conectarse a PostgreSQL
// Se debe hacer un .env para que no se vea la contraseña
const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'dic',
    password: 'root'
};

const pool = new Pool(config);

/*
{
  "id_avistamiento": 7,
  "comentario": "ooooh yo lo vi igual",
  "fecha": "2024-01-04" 
}
*/
const crearComentario = async (req, res) => {
    try {
        const data = {
            id_avistamiento: req.body.id_avistamiento,
            comentario: req.body.comentario,
            fecha: req.body.fecha
        };

        const authheader = req.headers.authorization;

        if (!authheader) {
            return res.status(403).send({message: 'No tienes sesion iniciada, inicia sesion para cambiar el nombre de usuario'});
            res.setHeader('WWW-Authenticate', 'Basic');
        }else{
            const auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
            const user = auth[0];

            const queryUser = 'SELECT id FROM usuarios WHERE user_name = $1';
            const userResult = await pool.query(queryUser, [user]);
            const userId = userResult.rows[0].id;

            const query = 'INSERT INTO comentarios (avistamiento_id, usuario_id, comentario, fecha) VALUES ($1, $2, $3, $4)';
            const values = [data.id_avistamiento, userId, data.comentario, data.fecha];

            const result = await pool.query(query, values);

            res.send({message: 'comentario creado'});

        }
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

/*
    {
    "id": 2
    }
*/
//se debe verificar si el usuario que esta eliminando el comentario es el mismo que lo creo (usando las cookies)
const eliminarComentario = async (req, res) => {
    try {
        const id = req.body.id;
        
        const authheader = req.headers.authorization;

        if (!authheader) {
            return res.status(403).send({message: 'No tienes sesion iniciada, inicia sesion para cambiar el nombre de usuario'});
            res.setHeader('WWW-Authenticate', 'Basic');
        }else{
            const auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
            const user = auth[0];

            // busca el user_name del usuario que publico el comentario
            const queryComent = 'SELECT usuarios.user_name FROM comentarios JOIN usuarios ON comentarios.usuario_id = usuarios.id WHERE comentarios.id = $1';
            const comentariosResult = await pool.query(queryComent, [id]);
            const userNameFromComentario = comentariosResult.rows[0].user_name;

            //verifica si el usuario que quiere eliminar el comentario es el mismo que lo creo
            if (user !== userNameFromComentario) {
                return res.status(403).send({message: 'No tienes permiso para eliminar este comentario, ya que, no lo publicaste'});
            }else{
                const query = 'DELETE FROM comentarios WHERE id = $1';
                const response = await pool.query(query, [id]);
                res.send({message: 'comentario eliminado'});
            }
        }  
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

/*
    {
    "id": 2,
    "comentario": "y la que resuelve"
    }
*/
//hay que hacer la verificacion si el usuario que esta editando el comentario es el que lo creo
const editarComentario = async (req, res) => {
    try {
        const data = {
            id: req.body.id,
            comentario: req.body.comentario
        };

        const authheader = req.headers.authorization;

        if (!authheader) {
            return res.status(403).send({message: 'No tienes sesion iniciada, inicia sesion para cambiar el nombre de usuario'});
            res.setHeader('WWW-Authenticate', 'Basic');
        }else{
            const auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
            const user = auth[0];

            // busca el user_name del usuario que publico el comentario
            const queryComent = 'SELECT usuarios.user_name FROM comentarios JOIN usuarios ON comentarios.usuario_id = usuarios.id WHERE comentarios.id = $1';
            const comentariosResult = await pool.query(queryComent, [data.id]);
            const userNameFromComentario = comentariosResult.rows[0].user_name;

            //verifica si el usuario que quiere eliminar el comentario es el mismo que lo creo
            if (user !== userNameFromComentario) {
                return res.status(403).send({message: 'No tienes permiso para eliminar este comentario, ya que, no lo publicaste'});
            }else{
                //si pasa la verificacion, se procede a editar el comentario
                const query = 'UPDATE comentarios SET comentario = $1 WHERE id = $2';
                const values = [data.comentario, data.id];
                const result = await pool.query(query, values);
                res.send({message: 'comentario editado'});
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

module.exports = {
    crearComentario,
    eliminarComentario,
    editarComentario
};
