/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;


/**
 * Question & Answer Schema
 */
var AnswerSchema = new Schema({
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
});

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
    correctAnswerIndex: Schema.Types.Mixed,
    possibleAnswers: Schema.Types.Mixed,
    answers: [AnswerSchema],
    isAnonymous:  { type: Boolean, default: false },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
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
    this.findOne({
        _id: id
    }).populate('user', 'name username')
    .populate('answers.user', 'name username').exec(cb);
};

mongoose.model('Answer', AnswerSchema);
mongoose.model('Question', QuestionSchema);
