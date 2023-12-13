const { Pool } = require('pg');

//se crear el bloque como una constante 
const getUsers = (req, res) => {
    res.send('users');
};

//configuracion para conectarse a postgres
const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'dic',
    password: 'root'
};

const pool = new Pool(config);

//funcion para hacer una consulta en prostgres
const hacer_consulta = async () => {
    try{
        //se hace la consulta a la base de datos
        const res = await pool.query('select * from pais');

        //se imprimen unicamente las filas de la consulta (ya que si no se especifica imprime mas datos que no son necesarios).
        console.log(res.rows);
    }catch(error){
        console.log(error);
    }
}

//funcion para insertar datos en postgres
const insertar = async () => {
    try{
        //en esta primera linea se determina cual sera la consulta sql ($1, $2, ..., $n va a tomar en el mismo orden los valores que
        //se encuentran en el arreglo valores).
        const quer = 'insert into pais (id, nombre, gentilicio) values ($1, $2, $3)';

        //aqui esta el arreglo de valores en donde $1 = '3', $2 = 'Colombia' y $3 = 'Colombiano'.
        const valores = [5, 'Alemania', 'Aleman'];

        //la response sera la query donde se le entrega la consulta sql y los valores que se van a insertar.
        const res = await pool.query(quer, valores);

        //se imprime la respuesta de la consulta.
        console.log(res);

    }catch(error){
        console.log(error);
    }
}

//funcion para eliminar datos en postgres
const eliminar = async () => {
    try{
        const quer = 'delete from pais where pais.nombre = $1';

        const valores = ['Alemania'];

        const res = await pool.query(quer, valores);

        console.log(res);

    }catch(error){
        console.log(error);
    }
}   

//funcion para actualizar datos en postgres
const actualizar = async () => {
    try{
        //query a usar
        const quer = 'update pais set nombre = $1 where nombre = $2';

        //valores $1 y $2 respectivamente
        const valores = ['Colombia', 'Peru'];

        //consulta final
        const res = await pool.query(quer, valores);

        console.log(res);

    }catch(error){
        console.log(error);
    }
}

//actualizar();
//hacer_consulta();
//insertar();
//eliminar();

//se exporta la funcion para que pueda ser usada en otro archivo
module.exports = {
    getUsers,
    actualizar,
    hacer_consulta,
    insertar,
    eliminar
};