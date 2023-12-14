
const express = require('express');
const fs = require("fs");
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//rutas
app.use(require('./routes/index'));

app.listen(port, () => {
    console.log(`app escuchando: http://localhost:${port}`)
});



