const {Router} = require('express');
const router = Router();

//se importa las distintas funciones de los controladores
const {crearUsuario, subirAlien, cambiarNombreUsuario, cambiarCorreo, cambiarTelefono, usuarioConMasComentarios, cambiarContrasena } = require('../controllers/users_controller');
const {crearComentario, eliminarComentario, editarComentario } = require('../controllers/comentarios_controller');
const {crearAvistamiento, eliminarAvistamiento, cambiarTitulo, cambiarEvidencia, ultimos10avistamientos, avistamientoconmascomentarios } = require('../controllers/avistamientos_controller');
const {crearAlien, eliminarAlien, cambiarDescripcionExtraterrestre,cambiarImagenExtraterrestre, crearAnatomia, editarAnatomia, eliminarAnatomia, eliminarUser, crearPais, cambiarClasificacion, cambiarNombrePais } = require('../controllers/admin_controller');

//controladores de ejemplo
//const { insertar, actualizar, hacer_consulta, eliminar } = require('../controllers/index_controller');
//router.post('/users/login', iniciarSesion); //check
//router.get('/users/logout', cerrarSesion); //stand by



//ruta para conexion de usuarios
router.post('/users/new', crearUsuario); //check
router.post('/users/subir-alien', subirAlien); //check
router.post('/users/cambiar-nombre-usuario', cambiarNombreUsuario); //check
router.post('/users/cambiar-correo', cambiarCorreo); //check
router.post('/users/cambiar-telefono', cambiarTelefono); //check
router.get('/users/usuario-con-mas-comentarios', usuarioConMasComentarios); //check 
router.post('/users/cambiar-contrasena', cambiarContrasena); //check

//ruta de conexion a Avistamientos 
router.post('/avistamientos/crear-avistamiento', crearAvistamiento); //check
router.post('/avistamientos/eliminar-avistamiento', eliminarAvistamiento); //check
router.post('/avistamientos/cambiar-titulo', cambiarTitulo); //check
router.post('/avistamientos/cambiar-evidencia', cambiarEvidencia); //check
router.get('/avistamientos/ultimos-10-avistamientos', ultimos10avistamientos); //check
router.get('/avistamientos/avistamiento-con-mas-comentarios', avistamientoconmascomentarios); //check

//ruta de conexion admin / Alien
router.post('/admin/alien/crear-alien', crearAlien); //check
router.post('/admin/alien/eliminar-alien', eliminarAlien); //check
router.post('/admin/alien/cambiar-descripcion-extraterrestre', cambiarDescripcionExtraterrestre); //check
router.post('/admin/alien/cambiar-imagen-extraterrestre', cambiarImagenExtraterrestre); //check
router.post('/admin/alien/editar-anatomia', editarAnatomia); //check

//ruta de conexion admin / anatomia
router.post('/admin/anatomia/crear-anatomia', crearAnatomia); //check
router.post('/admin/anatomia/eliminar-anatomia', eliminarAnatomia); //check

//ruta de conexion admin / pais
router.post('/admin/pais/crear-pais', crearPais); //check 
router.post('/admin/pais/cambiar-nombre-pais', cambiarNombrePais); //check

//ruta de conexion admin / users
router.post('/admin/users/eliminar-User', eliminarUser); //check

//ruta de conexion admin / avistamiento
router.post('/admin/avistamiento/cambiar-clasificacion', cambiarClasificacion); //check

//ruta de conexion a Comentarios
router.post('/comentarios/crear-comentario', crearComentario); //check
router.post('/comentarios/eliminar-comentario', eliminarComentario); //check
router.post('/comentarios/editar-comentario', editarComentario); //check

module.exports = router;
                                