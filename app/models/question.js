
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash');


/**
 * Question Schema
 */

var QuestionSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    type: String,
    correctAnswerIndex: Number,
    possibleAnswers: Schema.Types.Mixed,
    answers: [{
        created: {
            type: Date,
            default: Date.now
        },
        content: {
            type: String,
            default: '',
            trim: true
        },
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    }],
    nominatedBy: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    isAnonymous:  { type: Boolean, default: false },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});


/**
 * Methods
 */

QuestionSchema.methods = {

    /**
    * Add answer
    *
    * @param {User} user
    * @param {Object} answer
    * @param {Function} cb
    * @api private
    */

    addAnswer: function (user, answer, cb) {
        this.answers.push({
            content: answer.content,
            user: user._id
        });

        this.save(cb);
    },

    /**
    * Remove answer
    *
    * @param {answerId} String
    * @param {Function} cb
    * @api private
    */

    removeAnswer: function (answerId, cb) {
        var index = _.indexOf(this.answers, { _id: answerId });
        if (~index) this.answers.splice(index, 1);
        else return cb('not found');
        this.save(cb);
    },

    /**
    * Update answer
    *
    * @param {answerId} String
    * @param {newAnswer} Answer
    * @param {Function} cb
    * @api private
    */

    updateAnswer: function (newAnswer, cb) {
        var answerId = newAnswer._id;
        var self = this;

        this.answers.forEach(function(answer) {
            if (answer._id.toString() === answerId) {
                answer.content = newAnswer.content;
                self.markModified('answers');
                self.save(cb);
            }
        });
    }
};

/**
 * Virtuals
 */
QuestionSchema.virtual('creatorType').get(function(password) {
    return this.user.type;
});

/**
 * Validations
 */
QuestionSchema.path('content').validate(function(content) {
    return content.length;
}, 'Content cannot be blank');

/**
 * Statics
 */
QuestionSchema.statics.load = function(id, cb) {
    this
        .findOne({
            _id: id
        })
        .populate('user', 'name firstName lastName email')
        .exec(cb);
};

mongoose.model('Question', QuestionSchema);
