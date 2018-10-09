require('./config/config');

const express = require('express')
const mongoose = require('mongoose');

const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require("./routes/usuarios").app);

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) {
        throw new Error(err);
    } else {
        console.log('conexion realizada con exito');
    }
});

app.listen(process.env.PORT, () => console.log(`escuchando en el puerto ${process.env.PORT}`));