//tema de auth usarlo en un middleware y acer la verificacion de contrasenia igualmente

const { Pool } = require('pg');

// Configuración para conectarse a PostgreSQL
const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'dic',
    password: 'root'
};

const pool = new Pool(config);

//se debe pedir que en la descripcion se mencione numero de extremidades y caracteristicas especiales

/*
{
  "origen": "zentauri",
  "descripcion": "planet zentauri",
  "imagen": "ruta a imagen alien zentauro kamikaze",
  "aceptado": false
}
*/
const subirAlien = async (req, res) => {
    try{
            const data = {
                origen: req.body.origen,
                descripcion: req.body.descripcion,
                imagen: req.body.imagen,
                aceptado: false
            };

            const authheader = req.headers.authorization;

            if (!authheader) {
                return res.status(403).send({message: 'No tienes sesion iniciada, inicia sesion para crear un alien'});
                res.setHeader('WWW-Authenticate', 'Basic');
            }else{
                const auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
                const user = auth[0];

                const buscarUserId = 'SELECT id FROM usuarios WHERE user_name = $1';
                const userId = [user];
                const busqueda = await pool.query(buscarUserId, userId);

                const query = 'INSERT INTO publicaciones_aliens_espera (usuario_id, origen, descripcion, imagen, aceptado) VALUES ($1, $2, $3, $4, $5)';
                const response = await pool.query(query, [busqueda.rows[0].id, data.origen, data.descripcion, data.imagen, data.aceptado]);

                res.send({message:'Alien creado, en espera de aceptacion'});
            }
        }
    catch(error){
        console.log(error);
        res.status(500).send({message:'Error interno del servidor'});
    }
};

/*
{
  "user_name": "carlitos69",
  "contrasena": "hola carlita",
  "id_pais": "2",
  "fecha_nacimiento": "2001/09/11",
  "correo": "comoamolastorresgemelas@gmail.boom",
  "telefono": "12341234"
}
*/
const crearUsuario = async (req, res) => {
    try {
        const data = {
            user_name: req.body.user_name,
            contrasena: req.body.contrasena,
            id_pais: req.body.id_pais,
            fecha_nacimiento: req.body.fecha_nacimiento,
            correo: req.body.correo,
            telefono: req.body.telefono
        };

        const authheader = req.headers.authorization;

        if (!authheader) {
            //se busca si el usuario ya existe en la base de datos
            const busqueda = 'SELECT EXISTS (SELECT 1 FROM usuarios WHERE user_name = $1) AS user_exists';
            const userName = [data.user_name];
            const Busqueda = await pool.query(busqueda, userName);
            const userExiste = Busqueda.rows[0].user_exists;

            if(userExiste){
                res.send({message:'El usuario ya existe'});
            }else{
                const query = 'INSERT INTO usuarios (user_name, contrasena, id_pais, fecha_nacimiento, correo, telefono) VALUES ($1, $2, $3, $4, $5, $6)';
                const values = [data.user_name, data.contrasena, data.id_pais, data.fecha_nacimiento, data.correo, data.telefono];

                const result = await pool.query(query, values);

                res.send({message:'Usuario creado'});
            }
        }else{
            return res.status(403).send({message: 'tienes una sesion iniciada, cierrala para crear una cuenta nueva'});
            res.setHeader('WWW-Authenticate', 'Basic');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({message:'Error interno del servidor'});
    }
};

/*
//creo que hay maneras mas optimas de hacer un inicio (y mas seguras KJFHGSD).
const iniciarSesion = async (req, res) => {
    try{
        const data = {
            user: req.body.user_name,
            contrasena: req.body.contrasena
        };

        if(req.cookies.usuario){
            res.send({message:'Ya hay una sesion iniciada, cierrela primero'});
        }else{
        //se busca si el usuario existe en la base de datos
        const busqueda = 'SELECT EXISTS (SELECT 1 FROM usuarios WHERE user_name = $1) AS user_exists';
        const userName = [data.user];
        const Busqueda = await pool.query(busqueda, userName);
        const userExiste = Busqueda.rows[0].user_exists;

        if(userExiste){
            //se busca si la contraseña es correcta
            const contrasena = 'SELECT contrasena FROM usuarios WHERE user_name = $1';
            const Contrasena = await pool.query(contrasena, userName);

            //se compara la contrasena que tiene el usuario con la contrasena enviada del formulario
            if(Contrasena.rows[0].contrasena === data.contrasena){
                const cookie = res.cookie('usuario', `${data.user_name}`);
                res.send({message:'Sesion iniciada'});
            }else{
                //codigo 401 es para cuando la contraseña es incorrecta
                res.status(401).send({message:'Contraseña incorrecta'});
            }
        }else{
            res.status(404).send({message:'Usuario no encontrado'});;
        }
    }
    }catch(error){
        console.error(error);
        res.status(500).send({message:'Error interno del servidor'});
    }
};
*/
/*
const cerrarSesion = async (req, res) => {
    //console.log(req);
    const authheader = req.headers.authorization;

    if (!authheader) {
        return res.status(403).send({message: 'No tienes sesion iniciada'});
    }else{
        res.status(200).send({message: 'Sesion cerrada'});
        res.setHeader('WWW-Authenticate', 'Basic');
    }
};
*/

/*
    {
    "nuevo_user_name": "12341234"
    }
*/
const cambiarNombreUsuario = async (req, res) => {
    try {
        const data = {
            //nombre de usuario actual
            nuevo_user_name: req.body.nuevo_user_name
        };

        //TRABAJAR CON LOS PINCHES REQ
        //console.log(req);

        //se verifican las credenciales del usuario
        const authheader = req.headers.authorization;

        if (!authheader) {
            return res.status(403).send({message: 'No tienes sesion iniciada, inicia sesion para cambiar el nombre de usuario'});
            res.setHeader('WWW-Authenticate', 'Basic');
        }else{

            const auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
            const user = auth[0];

            //console.log(user);

            //se busca si el usuario ya existe en la base de datos
            const busqueda = 'SELECT EXISTS (SELECT 1 FROM usuarios WHERE user_name = $1) AS user_exists';
            const userName = [data.nuevo_user_name];
            const Busqueda = await pool.query(busqueda, userName);
            const usersExiste = Busqueda.rows[0].users_exists;
    
            if(usersExiste){
                res.send({message: 'El usuario nuevo ya existe'});
            }else{
                const query = 'UPDATE usuarios SET user_name = $1 WHERE user_name = $2';
                const values = [data.nuevo_user_name, user];
    
                const result = await pool.query(query, values);
    
                res.send({message: 'Nombre de usuario cambiado'});
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

/*
    {
        "nuevo_correo": "holahola@gmail.com"
    }
*/

const cambiarCorreo = async (req, res) => {
    try {
        const data = {
            nuevo_correo: req.body.nuevo_correo
        };

        const authheader = req.headers.authorization;

        if (!authheader) {
            return res.status(403).send({message: 'No tienes sesion iniciada, inicia sesion para cambiar el nombre de usuario'});
            res.setHeader('WWW-Authenticate', 'Basic');
        }else{
            const auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
            const user = auth[0];

            const query = 'UPDATE usuarios SET correo = $1 WHERE user_name = $2';
            const values = [data.nuevo_correo, user];

            const result = await pool.query(query, values);

            res.send({message: 'Correo cambiado'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

/*
    {
        "nuevo_telefono": "12341234"
    }
*/
const cambiarTelefono = async (req, res) => {
    try {
        const data = {
            nuevo_telefono: req.body.nuevo_telefono
        };
        const authheader = req.headers.authorization;

        if (!authheader) {
            return res.status(403).send({message: 'No tienes sesion iniciada, inicia sesion para cambiar el nombre de usuario'});
            res.setHeader('WWW-Authenticate', 'Basic');
        }else{
            const auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
            const user = auth[0];

            const query = 'UPDATE usuarios SET telefono = $1 WHERE user_name = $2';
            const values = [data.nuevo_telefono, user];

            const result = await pool.query(query, values);

            res.send({message: 'Telefono cambiado'});

        }
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

const usuarioConMasComentarios = async (req, res) => {
    try{
        const query = 'SELECT usuarios.user_name FROM usuarios JOIN (SELECT COUNT(*) AS comentario_count, usuario_id FROM comentarios GROUP BY comentarios.usuario_id) AS t1 ON t1.usuario_id = usuarios.id JOIN (SELECT MAX(t2.comentario_count) AS max_count FROM (SELECT COUNT(*) AS comentario_count, usuario_id FROM comentarios GROUP BY comentarios.usuario_id) AS t2) AS t3 ON t3.max_count = t1.comentario_count GROUP BY usuarios.user_name';
        const result = await pool.query(query);
        res.send(result.rows);
    }
    catch(error){
        console.log(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

/*
    {
        "nueva_contrasena": "colocolo"
    }
*/
const cambiarContrasena = async (req, res) => {
    try {
        const data = {
            nueva_contrasena: req.body.nueva_contrasena
        };
        
        const authheader = req.headers.authorization;

        if (!authheader) {
            return res.status(403).send({message: 'No tienes sesion iniciada, inicia sesion para cambiar el nombre de usuario'});
            res.setHeader('WWW-Authenticate', 'Basic');
        }else{

            const auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
            const user = auth[0];

            const query = 'UPDATE usuarios SET contrasena = $1 WHERE user_name = $2';
            const values = [data.nueva_contrasena, user];
            const response = await pool.query(query, values);
            res.send({ message: 'Contraseña de usuario cambiada' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    crearUsuario,
    //iniciarSesion,
    //cerrarSesion,
    subirAlien,
    cambiarNombreUsuario,
    cambiarCorreo,
    cambiarTelefono,
    usuarioConMasComentarios,
    cambiarContrasena
};
