// Process

process.env.PORT = process.env.PORT || 3000;

// Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vencimineto TOKEN

process.env.CADUCIDAD_TOKEN = 60 * 60 * 60 * 24 * 3;

// SEED firma, semmilla de autenticacion

process.env.SEED = process.env.SEED || 'seed-por-defecto';

// Base de datos
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;