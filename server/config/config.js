// Process

process.env.PORT = process.env.PORT || 3000;

// Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de datos
let urlDB;


urlDB = 'mongodb://cafe-user:asd1234@ds259070.mlab.com:59070/cafe-ea';


process.env.URLDB = urlDB;