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
    isAdmin: function(req, res, next) {
        if (req.user.type !== 'professor') {
            return res.send(401, 'User is not authorized');
        }
        next();
    }
};

/**
 * Question authorizations routing middleware
 */
exports.question = {
    isOwner: function(req, res, next) {
        if (!req.user._id.equals(req.question.user._id)) {
            return res.send(401, 'User is not owner of question');
        }
        next();
    }
};


/**
 * Answer authorizations routing middleware
 */
exports.answer = {
    isOwner: function(req, res, next) {
        if (!req.user._id.equals(req.answer.user._id)) {
            return res.send(401, 'User is not owner of answer');
        }
        next();
    }
};


/**
 * Nomination authorizations routing middleware
 */
exports.nomination = {
    isNotOwner: function(req, res, next) {
        if (req.user._id.equals(req.question.user._id)) {
            return res.send(401, 'User can not nominate own question');
        }
        next();
    }
};