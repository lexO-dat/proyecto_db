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
  "id_extraterrestre": 2,
  "titulo": "EL ALIENIGENA SIMPATICO FUE AL EMPORIO DE LA ROSA",
  "lugar": "El Vaticano ",
  "fecha": "2023/09/11",
  "testimonio": "esta weeeno el crack",
  "clasificacion": "sin clasificacion",
  "evidencia": "foto evidencia.jpg"
}
*/

const crearAvistamiento = async (req, res) => {
    try {
        const data = {
            id_extraterrestre: req.body.id_extraterrestre,
            titulo_historia: req.body.titulo,
            lugar: req.body.lugar,
            fecha: req.body.fecha,
            testimonio: req.body.testimonio,
            clasificacion: "sin clasificacion",
            evidencia: req.body.evidencia
        };

        const authheader = req.headers.authorization;

        if (!authheader) {
            return res.status(403).send({message: 'No tienes sesion iniciada, inicia sesion para crear un avistamiento'});
            res.setHeader('WWW-Authenticate', 'Basic');
        }else{
            const auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
            const user = auth[0];

            //se busca si el avistamiento ya existe en la base de datos
            const busqueda = 'SELECT EXISTS (SELECT 1 FROM avistamiento WHERE titulo_historia = $1) AS avistamientoExists';
            const tituloHistoria = [data.titulo_historia];
            const Busqueda = await pool.query(busqueda, tituloHistoria);
            const avistamientoExiste = Busqueda.rows[0].avistamientoExists;

            const queryUser = 'SELECT id FROM usuarios WHERE user_name = $1';
            const usuario = [user];
            
            const userResult = await pool.query(queryUser, usuario);
            const userId = userResult.rows[0].id;

            if(avistamientoExiste){
                res.send({message:'El titulo de la historia ya existe'});
           }else{
                const query = 'INSERT INTO avistamiento (id_extraterrestre, id_usuario, titulo_historia, lugar, fecha, testimonio, clasificacion, evidencia) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
                const values = [data.id_extraterrestre, userId, data.titulo_historia, data.lugar, data.fecha, data.testimonio, data.clasificacion, data.evidencia];

                const result = await pool.query(query, values);

                res.send({message:'avistamiento creado'});
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({message:'Error interno del servidor'});
    }
};

const eliminarAvistamiento = async (req, res) => {
    try {
        //se debe entregar el id del avistamiento por el body
        const avistamientoId = req.body.id;
        
        const authheader = req.headers.authorization;

        if (!authheader) {
            return res.status(403).send({message: 'No tienes sesion iniciada, inicia sesion para eliminar un avistamiento'});
            res.setHeader('WWW-Authenticate', 'Basic');
        }else{
            const auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
            const user = auth[0];
       
            // busaca el id del usuario que publico el avistamiento
            const query = 'SELECT usuarios.user_name FROM avistamiento JOIN usuarios ON avistamiento.id_usuario = usuarios.id WHERE avistamiento.id = $1';
            const avistamientoResult = await pool.query(query, [avistamientoId]);

            // Si no se encuentra el avistamiento, enviar mensaje de error
            if (avistamientoResult.rows.length === 0) {
                return res.send({message:'Avistamiento no encontrado'});
            }else{
                // Si el usuario que quiere eliminar el avistamiento no es el mismo que lo publicó, enviar mensaje de error
                if (user !== avistamientoResult.rows[0].user_name) {
                    res.status(403).send({message:'No tienes permiso para eliminar este avistamiento, ya que, no lo publicaste'});
                }else{
                // Si todas las verificaciones pasan, se procede a eliminar el avistamiento
                const deleteQuery = 'DELETE FROM avistamiento WHERE id = $1';
                await pool.query(deleteQuery, [avistamientoId]);
                res.send({message:'Avistamiento eliminado'});
                }
            }   
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({message:'Error interno del servidor'});
    }
};


const cambiarTitulo = async (req, res) => {
    try {
        const data = {
            id: req.body.id,
            //titulo nuevo a ingresar
            titulo_historia: req.body.titulo
        };
        const userCookie = req.cookies.usuario;

        if (!userCookie) {
            return res.status(403).send({message:'Debes tener una sesion abierta para cambiar el titulo de un avistamiento'});
        }else{
            // busca el id del usuario que publico el avistamiento
            const queryA = 'SELECT usuarios.user_name FROM avistamientos JOIN usuarios ON avistamientos.id_usuario = usuarios.id WHERE avistamientos.id = $1';
            const avistamientoResult = await pool.query(queryA, [avistamientoId]);

            // Si no se encuentra el avistamiento, enviar mensaje de error
            if (avistamientoResult.rows.length === 0) {
                return res.send({message:'Avistamiento no encontrado'});
            }

            // Si el usuario que quiere editar el titulo del avistamiento no es el mismo que lo publicó, enviar mensaje de error
            const userIdFromAvistamiento = avistamientoResult.rows[0].usuario_id;
            if (userCookie !== userIdFromAvistamiento) {
                return res.status(403).send({message:'No tienes permiso para cambiar el titulo de este avistamiento, ya que, no lo publicaste'});
            }

            const query = 'UPDATE avistamientos SET titulo_historia = $1 WHERE id = $2';
            const values = [data.titulo_historia, data.id];
            const response = await pool.query(query, values);
            res.send({message: 'Titulo cambiado'});
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

const cambiarEvidencia = async (req, res) => {
    try {
        const data = {
            id: req.body.id,
            //evidencia nueva a ingresar
            evidencia: req.body.evidencia
        };

        const userCookie = req.cookies.usuario;

        if (!userCookie) {
            return res.status(403).send({message:'Debes tener una sesion abierta para cambiar la evidencia de un avistamiento'});
        }else{
            // busca el id del usuario que publico el avistamiento
            const queryA = 'SELECT usuarios.user_name FROM avistamientos JOIN usuarios ON avistamientos.id_usuario = usuarios.id WHERE avistamientos.id = $1';
            const avistamientoResult = await pool.query(queryA, [avistamientoId]);

            // Si no se encuentra el avistamiento, enviar mensaje de error
            if (avistamientoResult.rows.length === 0) {
                return res.send({message:'Avistamiento no encontrado'});
            }

            // Si el usuario que quiere editar el titulo del avistamiento no es el mismo que lo publicó, enviar mensaje de error
            const userIdFromAvistamiento = avistamientoResult.rows[0].usuario_id;
            if (userCookie !== userIdFromAvistamiento) {
                return res.status(403).send({message:'No tienes permiso para cambiar la evidencia de este avistamiento, ya que, no lo publicaste'});
            }

            const query = 'UPDATE avistamientos SET evidencia = $1 WHERE id = $2';
            const values = [data.evidencia, data.id];
            const response = await pool.query(query, values);
            res.send({message: 'Evidencia cambiada'});
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

const ultimos10avistamientos = async (req, res) => {
    try {
        const query = 'SELECT * FROM avistamientos ORDER BY fecha DESC LIMIT 10';
        const response = await pool.query(query);
        res.send(response.rows);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

const avistamientoconmascomentarios = async (req, res) => {
    try {
        const query = 'select avistamiento.titulo_historia from avistamiento join (select count(comentarios), id from avistamientos group by id) as t1 on t1.id = avistamiento.id join (select max(t2.count) from (select count(comentarios), id from avistamientos group by id) as t2) as t3 on t3.max = t1.count group by avistamiento.titulo_historia';
        const response = await pool.query(query);
        res.send(response.rows);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

module.exports = {
    crearAvistamiento,
    eliminarAvistamiento,
    cambiarTitulo,
    cambiarEvidencia,
    ultimos10avistamientos,
    avistamientoconmascomentarios
};
