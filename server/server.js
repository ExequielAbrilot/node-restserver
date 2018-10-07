require('./config/config');

const express = require('express')
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/usuario', function(req, res) {
    res.json('Get Usuarios')
})

app.post('/usuario', function(req, res) {
    let body = req.body
    res.json({
        persona: body
    })
})

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    })
})

app.delete('/usuario', function(req, res) {
    res.json('Delete Usuarios')
})

app.listen(process.env.PORT, () => console.log(`escuchando en el puerto ${process.env.PORT}`));