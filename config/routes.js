'use strict';

module.exports = function(app, passport, auth) {
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);

    //Setting the local strategy route
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);

    //Setting up the users api
    app.post('/users', users.create);
    app.get('/users/:userId', users.show);
    app.post('/users/:userId', users.update);

    // TODO: remove this
    app.get('/createProfessor', users.createProfessor);

    //Finish with setting up the userId param
    app.param('userId', users.user);

    //Admin routes
    var admin = require('../app/controllers/admin');
    app.post('/admin/import', auth.admin.hasAuthorizationToImport, admin.import);

    //Questions Routes
    var questions = require('../app/controllers/questions');
    app.get('/questions', auth.requiresLogin, questions.all);
    app.post('/questions', auth.question.hasAuthorizationToUpdateQuestions, questions.create);
    app.get('/questions/:questionId', auth.requiresLogin, questions.show);
    app.put('/questions/:questionId', auth.requiresLogin, auth.question.hasAuthorizationToUpdateQuestions, questions.update);
    app.del('/questions/:questionId', auth.requiresLogin, auth.question.hasAuthorizationToUpdateQuestions, questions.destroy);

    //Finish with setting up the questionId param
    app.param('questionId', questions.question);

    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);

};
