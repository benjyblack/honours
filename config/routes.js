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
    app.post('/admin/import', auth.admin.isAdmin, admin.import);

    //Questions Routes
    var questions = require('../app/controllers/questions');
    app.param('questionId', questions.load);
    app.get('/questions', auth.requiresLogin, questions.all);
    app.post('/questions', auth.requiresLogin, questions.create);
    app.get('/questions/:questionId', auth.requiresLogin, questions.show);
    app.put('/questions/:questionId', auth.requiresLogin, auth.question.isOwner, questions.update);
    app.del('/questions/:questionId', auth.requiresLogin, auth.question.isOwner, questions.destroy);

    // Nominations routes
    var nominations = require('../app/controllers/nominations');
    app.get('/questions/:questionId/nominations', auth.requiresLogin, nominations.all);
    app.post('/questions/:questionId/nominations', auth.requiresLogin, nominations.create);
    app.del('/questions/:questionId/nominations/:userId', auth.requiresLogin, nominations.destroy);

    //Answers routes
    var answers = require('../app/controllers/answers');
    app.param('answerId', answers.load);
    app.get('/questions/:questionId/answers', auth.requiresLogin, answers.all);
    app.post('/questions/:questionId/answers', auth.requiresLogin, answers.create);
    app.get('/questions/:questionId/answers/:answerId', auth.requiresLogin, answers.show);
    app.put('/questions/:questionId/answers/:answerId', auth.requiresLogin, auth.answer.isOwner, answers.update);
    app.del('/questions/:questionId/answers/:answerId', auth.requiresLogin, auth.answer.isOwner, answers.destroy);


    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);

};
