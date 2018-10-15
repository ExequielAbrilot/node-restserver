const express = require('express')
const app = express();

app.use(require("./usuarios").app);
app.use(require("./login").app);
app.use(require("./categoria").app);
app.use(require("./producto").app);
app.use(require("./upload").app);
app.use(require("./imagenes").app);

module.exports = { app };