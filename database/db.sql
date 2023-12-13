
create database dic;

/c dic;

create table anatomia(
    id serial not null,
    numero_extremidades int not null,
    cracteristicas_especiales varchar(255) not null,
    primary key(id)
);

create table pais(
    id serial not null,
    nombre varchar(80) not null,
    gentilicio varchar(20) not null,
    primary key(id)
);

create table extraterrestres(
    id serial not null,
    origen varchar(80) not null,
    descripcion varchar(800) not null,
    anatomia int not null,
    imagen varchar(80) not null,
    primary key(id),
    foreign key(anatomia) references anatomia(id)
);


create table usuarios(
    id serial not null,
    user_name varchar(80) not null,
    contrasena varchar(20) not null,
    id_pais int not null,
    fecha_nacimiento date not null,
    correo varchar(80) not null,
    telefono int not null,
    primary key(id),
    foreign key(id_pais) references pais(id)
);

create table publicaciones_aliens_espera(
    id serial not null,
    usuario_id int not null,
    origen varchar(80) not null,
    descripcion varchar(800) not null,
    imagen varchar(200) not null,
    aceptado varchar (20) not null,
    primary key(id),
    foreign key(usuario_id) references usuarios(id)
);

create table avistamiento(
    id serial not null,
    id_extraterrestre int not null,
    id_usuario int not null,
    titulo_historia varchar(80) not null,
    lugar varchar(40) not null,
    fecha timestamp not null,
    testimonio varchar(800) not null,
    clasificacion varchar(20) not null,
    evidencia varchar(255) not null,
    primary key(id),
    foreign key(id_extraterrestre) references extraterrestres(id),
    foreign key(id_usuario) references usuarios(id)
);

create table comentarios (
    id serial not null,
    avistamiento_id int not null,
    usuario_id int not null, 
    comentario varchar(255) not null,
    fecha timestamp not null,
    primary key(id),
    foreign key(avistamiento_id) references avistamiento(id),
    foreign key(usuario_id) references usuarios(id) 
);
