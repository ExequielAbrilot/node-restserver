require('./config/config');

const express = require('express')
const mongoose = require('mongoose');
const path = require('path');

const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// configuracion global de rutas
app.use(require("./routes/index").app);

// habilitar la ruta html
app.use(express.static(path.resolve(__dirname, "../public")));

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) {
        throw new Error(err);
    } else {
        console.log('conexion realizada con exito');
    }
});

app.listen(process.env.PORT, () => console.log(`escuchando en el puerto ${process.env.PORT}`));