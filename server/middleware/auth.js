// server/middleware/auth.js
// Middleware d'authentification / autorisation basé sur le JWT émis au login.
// Tant que ce middleware n'existait pas, le token n'était jamais vérifié après
// la connexion : n'importe qui pouvait appeler l'API en se faisant passer
// pour n'importe qui (ex: usurper l'expéditeur d'un message).

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_temporaire';

// Rôles "professeur / staff" reconnus dans l'app (deux collections, deux
// nomenclatures legacy : 'prof'/'professeur', + rôles admin/staff).
const STAFF_ROLES = ['prof', 'professeur', 'admin', 'surveillant', 'direction', 'technique'];

/**
 * Vérifie le header "Authorization: Bearer <token>" et attache
 * req.user = { id, role } si le token est valide.
 * Bloque la requête (401) si le token est absent ou invalide.
 */
function protect(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ success: false, message: "Authentification requise." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        return next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Session invalide ou expirée, merci de vous reconnecter." });
    }
}

/**
 * À utiliser après `protect`. Limite l'accès à une liste de rôles.
 * Exemple : router.patch('/:id', protect, restrictTo(...STAFF_ROLES), controller)
 */
function restrictTo(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Accès non autorisé pour ce rôle." });
        }
        next();
    };
}

/**
 * Autorise le staff (prof/admin/...) OU l'utilisateur qui accède à sa propre
 * fiche (req.params.id === req.user.id). Utile pour /students/:id où un élève
 * doit pouvoir soumettre un justificatif d'absence sur SON propre profil,
 * sans pouvoir toucher à la fiche d'un autre élève ni modifier ses notes
 * (cette dernière restriction est appliquée dans le contrôleur).
 */
function restrictToStaffOrSelf(req, res, next) {
    const isStaff = req.user && STAFF_ROLES.includes(req.user.role);
    const isSelf = req.user && req.params.id && req.user.id === req.params.id;

    if (!isStaff && !isSelf) {
        return res.status(403).json({ success: false, message: "Accès non autorisé." });
    }

    // Le contrôleur a besoin de savoir si l'appelant est staff ou juste le titulaire du profil
    req.isStaffRequest = isStaff;
    next();
}

module.exports = { protect, restrictTo, restrictToStaffOrSelf, STAFF_ROLES, JWT_SECRET };
