'use strict';

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

/**
 * User authorizations routing middleware
 */
exports.user = {
    hasAuthorization: function(req, res, next) {
        if (req.profile.id !== req.user.id) {
            return res.send(401, 'User is not authorized');
        }
        next();
    }
};


/**
 * Admin authorizations routing middleware
 */
exports.admin = {
    hasAuthorizationToImport: function(req, res, next) {
        // TODO: Add proper authentication for students
        if (req.user.type !== 'Professor') {
            return res.send(401, 'User is not authorized');
        }
        next();
    }
};

/**
 * Question authorizations routing middleware
 */
exports.question = {
    hasAuthorizationToUpdateQuestions: function(req, res, next) {
        // TODO: Add proper authentication for students
        if (req.user.type !== 'Professor' && 0) {
            return res.send(401, 'User is not authorized');
        }
        next();
    }
};