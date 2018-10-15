const jwt = require('jsonwebtoken');

// Verificar Token

let verificaToken = (req, res, next) => {
    // header son con get
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();

    })

}

// Verificar Admin Role

let verificaAdmin_Role = (req, res, next) => {

    let esAdmin = req.usuario.role === 'ADMIN_ROLE' ? true : false;
    if (!esAdmin) {
        return res.status(401).json({
            ok: false,
            err: { message: "Permiso denegado" }
        });
    }
    next();




}

// Verificar token Img

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();

    });
}

module.exports = { verificaToken, verificaAdmin_Role, verificaTokenImg }