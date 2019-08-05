// ========================
// Puerto
// ========================
process.env.PORT = process.env.PORT || 3000;

// ========================
// Expiracion
// ========================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 60 * 60;
// ========================
// seed
// ========================
process.env.SEED = process.env.SEED || 'este-es-mi-secreto';
// ========================
// Entorno
// ========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// ========================
// Base de Datos
// ========================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    // urlDB = 'mongodb+srv://seiskari:e4HmpYGn8cfrttd@cluster0-nomvr.mongodb.net/cafe';
    urlDB = process.env.MONGO_URI;
}

// ========================
// Google Client Id
// ========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '361612282087-nl8bh1qiulp4lm5q7dnhgulfge6rq1er.apps.googleusercontent.com';

process.env.URLDB = urlDB;