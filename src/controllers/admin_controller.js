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

//en teoria esta info iria a los admin para que un admin pueda crear al alien
//los usuarios solamente tienen permitido o elegir uno ya registrado o enviar info que debe ser verificada

//con la anatomia, solo un admin puede crearla, los usuarios solo pueden elegir una ya creada

//esta tambien se basa en la descripccion entregada por los usuarios (ya que se pide numero de extremidades y caracteristicas especiales)

//el admin debera redactar una nueva descripcion para el alien (sin cambiar mucho la original) y crear una anatomia con los datos entregados.

/*
{
  "origen": "zentauri",
  "descripcion": "medio viscoso",
  "anatomia_id": 1,
  "imagen": "ruta a imagen xd 100% real no fake"
}
*/
const crearAlien = async (req, res) => {
    try{
        const data = {
            origen: req.body.origen,
            descripcion: req.body.descripcion,  
            anatomia_id: req.body.anatomia_id,
            imagen: req.body.imagen
        };

        const query = 'INSERT INTO extraterrestres (origen, descripcion, anatomia, imagen) VALUES ($1, $2, $3, $4)';
        const response = await pool.query(query, [data.origen, data.descripcion, data.anatomia_id, data.imagen]);

        res.send({message: 'Alien creado'});
        
    }catch(error){
        console.error(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

/*
    {
      "id": 3
    }
*/
const eliminarAlien = async (req, res) => {
    try{
        const id = req.body.id;
        const query = 'DELETE FROM extraterrestres WHERE id = $1';
        const response = await pool.query(query, [id]);

        res.send({message: 'Alien eliminado'});
    }
    catch(error){
        console.log(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

/*
{
  "numero_extremidades": 69,
  "caracteristicas_especiales": "viscoso"
}
*/
//exactamente lo mismo con anatomia, solo un admin la puede crear.
const crearAnatomia = async (req, res) => {
    try{
        const data = {
            numero_extremidades: req.body.numero_extremidades,
            caracteristicas_especiales: req.body.caracteristicas_especiales
        }

        const query = 'INSERT INTO anatomia (numero_extremidades, cracteristicas_especiales) VALUES ($1, $2)'
        const valores = [data.numero_extremidades, data.caracteristicas_especiales]
        const response = await pool.query(query, valores);

        res.send({message: 'Anatomia creada'});
    }
    catch(error){
        console.log(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

/*
    {
    "id": 2
    }
*/
const eliminarAnatomia = async (req, res) => {
    try{
        const id = req.body.id;
        const query = 'DELETE FROM anatomia WHERE id = $1';
        const response = await pool.query(query, [id]);

        res.send({message: 'Anatomia eliminada'});
    }
    catch(error){
        console.log(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

/*
{
  "nombre": "Venezuela",
  "gentilicio": "Venezolan@"
}
*/
//lo mismo con paises, solo un admin puede crearlos
const crearPais = async (req, res) => {
    try{
        const data = {
            nombre: req.body.nombre,
            gentilicio: req.body.gentilicio
        }

        const query = 'INSERT INTO pais (nombre, gentilicio) VALUES ($1, $2)'
        const valores = [data.nombre, data.gentilicio]
        const response = await pool.query(query, valores);

        res.send({message: 'Pais creado'});

    }
    catch(error){
        console.log(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

/*
{
  "id": 2,
  "nombre": "Puerto Rico"
}
*/
const cambiarNombrePais = async (req, res) => {
    try{
        const data = {
            id: req.body.id,
            nombre: req.body.nombre
        }

        const query = 'UPDATE pais SET nombre = $1 WHERE id = $2';
        const values = [data.nombre, data.id];
        const response = await pool.query(query, values);
        res.send({message: 'Nombre de pais cambiado'});
    }
    catch(error){
        console.log(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

/*
{
  "user_name": "LexxOa"
}
*/

//"baneo" de usuarios, solo un admin puede hacerlo, y solo se puede borrar un usuario a la vez
const eliminarUser = async (req, res) => {
    try {
        //debera haber un form para poder borrarlo (con el nombre del usuario)
        const data = {user: req.body.user_name};

        const query = 'DELETE FROM usuarios WHERE usuarios.user_name = $1';
        const values = [data.user];

        const result = await pool.query(query, values);

        // Verifica cuántas filas fueron afectadas por la operación de eliminación
        //Se asume que solo existe un usuario con ese nombre.
        if (result.rowCount === 1) {
            res.send({message: 'Usuario eliminado'});
        } else {
            res.status(404).send({message: 'Usuario no encontrado'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

/*
{
  "id": 2,
  "descripcion": "alien simpatico, me compro un helado"
}
*/
const cambiarDescripcionExtraterrestre = async (req, res) => {
    try {
        const data = {
            id: req.body.id,
            descripcion: req.body.descripcion
        }

        const query = 'UPDATE extraterrestres SET descripcion = $1 WHERE id = $2';
        const values = [data.descripcion, data.id];
        const response = await pool.query(query, values);
        res.send({message: 'Descripción de extraterrestre cambiada'});
    } catch (error) {
        console.log(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

/*
{
  "id": 2,
  "imagen": "imagen 200%real no fake 1 link mega"
}
*/
const cambiarImagenExtraterrestre = async (req, res) => {
    try {
        const data = {
            id: req.body.id,
            imagen: req.body.imagen
        }

        const query = 'UPDATE extraterrestres SET imagen = $1 WHERE id = $2';
        const values = [data.imagen, data.id];
        const response = await pool.query(query, values);
        res.send({message: 'Imagen de extraterrestre cambiada'});
    } catch (error) {
        console.log(error);
        res.status(500).send({message: 'Error interno del servidor'});
    }
};

/*
    {
        "id": 2,
        "anatomia": 4
    }
*/
//cambiar la anatomia del alien
const editarAnatomia = async (req, res) => {
    try {
        const data = {
            id: req.body.id,
            anatomia: req.body.anatomia
        };

        const query = 'UPDATE extraterrestres SET anatomia = $1 WHERE id = $2';
        const values = [data.anatomia, data.id];
        const response = await pool.query(query, values);
        res.send({ message: 'Anatomía de extraterrestre editada' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
};


const cambiarClasificacion = async (req, res) => {
    try {
        const data = {
            id: req.body.id,
            clasificacion: req.body.clasificacion
        };

        const query = 'UPDATE avistamiento SET clasificacion = $1 WHERE id = $2';
        const values = [data.clasificacion, data.id];
        const response = await pool.query(query, values);
        res.send({ message: 'Clasificacion de avistamiento cambiada' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    crearAlien,
    eliminarAlien,
    cambiarDescripcionExtraterrestre,
    cambiarImagenExtraterrestre,
    crearAnatomia,
    editarAnatomia,
    eliminarAnatomia,
    crearPais,
    cambiarClasificacion,
    eliminarUser,
    cambiarNombrePais
};

