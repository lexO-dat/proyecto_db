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

const crearComentario = async (req, res) => {
    try {
        const data = {
            id_avistamiento: req.body.id_avistamiento,
            id_usuario: req.body.id_usuario,
            comentario: req.body.comentario,
            fecha: req.body.fecha
        };

        if(req.cookies.usuario){
                const query = 'INSERT INTO comentarios (id_avistamiento, id_usuario, comentario, fecha) VALUES ($1, $2, $3, $4)';
                const values = [data.id_avistamiento, data.id_usuario, data.comentario, data.fecha];

                const result = await pool.query(query, values);

                res.send({message: 'comentario creado'});
        }else{
            res.send({message: 'sesion no iniciada, por favor inicie sesion o registrese para comentar'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

//se debe verificar si el usuario que esta eliminando el comentario es el mismo que lo creo (usando las cookies)
const eliminarComentario = async (req, res) => {
    try {
        const id = req.body.id;
        const UserCookie = req.cookies.usuario;

        if (!UserCookie) {
            return res.status(403).send({message: 'Debes tener una sesion abierta para eliminar un comentario'});
        }else{
            // busca el id del usuario que publico el comentario
            const queryComent = 'SELECT usuarios.user_name FROM comentarios JOIN usuarios ON comentarios.id_usuario = usuarios.id WHERE comentarios.id = $1';
            const comentariosResult = await pool.query(queryComent, [id]);
            const userNameFromComentario = comentariosResult.rows[0].usuario_id;

            //verifica si el usuario que quiere eliminar el comentario es el mismo que lo creo
            if (userCookie !== userNameFromComentario) {
                return res.status(403).send({message: 'No tienes permiso para eliminar este comentario, ya que, no lo publicaste'});
            }
            const query = 'DELETE FROM comentarios WHERE id = $1';
            const response = await pool.query(query, [id]);
            res.send({message: 'comentario eliminado'});
        }  
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

//hay que hacer la verificacion si el usuario que esta editando el comentario es el que lo creo
const editarComentario = async (req, res) => {
    try {
        const data = {
            id: req.body.id,
            comentario: req.body.comentario
        };

        const UserCookie = req.cookies.usuario;

        if(UserCookie){
            // busca el id del usuario que publico el comentario
            const queryComent = 'SELECT usuarios.user_name FROM comentarios JOIN usuarios ON comentarios.id_usuario = usuarios.id WHERE comentarios.id = $1';
            const comentariosResult = await pool.query(queryComent, [data.id]);
            const userNameFromComentario = comentariosResult.rows[0].usuario_id;

            //verifica si el usuario que quiere eliminar el comentario es el mismo que lo creo
            if (userCookie !== userNameFromComentario) {
                return res.status(403).send({message: 'No tienes permiso para editar este comentario, ya que, no lo publicaste'});
            }

            //si pasa la verificacion, se procede a editar el comentario
            const query = 'UPDATE comentarios SET comentario = $1 WHERE id = $2';
            const values = [data.comentario, data.id];
            const result = await pool.query(query, values);
            res.send({message: 'comentario editado'});
        }else{
            res.send({message: 'sesion no iniciada, por favor inicie sesion o registrese para comentar'});
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