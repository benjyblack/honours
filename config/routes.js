module.exports = function(app, passport, auth) {
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);

    //Setting up the users api
    app.post('/users', users.create);

    // TODO: remove this
    app.get('/createProfessor', users.createProfessor);

    //Setting the local strategy route
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);

    //Finish with setting up the userId param
    app.param('userId', users.user);

    //Questions Routes
    var questions = require('../app/controllers/questions');
    app.get('/questions', auth.requiresLogin, questions.all);
    app.post('/questions', auth.requiresLogin, questions.create);
    app.get('/questions/:questionId', auth.requiresLogin, questions.show);
    app.put('/questions/:questionId', auth.requiresLogin, auth.question.hasAuthorizationToEdit, questions.update);
    app.del('/questions/:questionId', auth.requiresLogin, auth.question.hasAuthorizationToDelete, questions.destroy);

    //Finish with setting up the questionId param
    app.param('questionId', questions.question);

    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);

};
