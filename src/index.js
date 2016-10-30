'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = " amzn1.ask.skill.b0d498f2-42f4-46c7-b933-39957b4e82fd";
var SKILL_NAME = 'Linkletter';
var enemies = require('./enemies');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = 'Welcome to ' + SKILL_NAME + ', the unofficial fan-made Legend of Zelda enemy guide. You can ask a question like, how do i beat an octorok? ... Now, what can I help you with.';
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = 'For instructions on what you can say, please say help me.';
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech)
    },
    'EnemyIntent': function () {
        var enemySlot = this.event.request.intent.slots.Enemy;
        var enemyName;
        if (enemySlot && enemySlot.value) {
            enemyName = enemySlot.value.toLowerCase();
        }

        var cardTitle = SKILL_NAME + ' - Beating ' + enemyName;
        var enemy_instructions = enemies[enemyName];

        if (enemy_instructions) {
            this.attributes.speechOutput = enemy_instructions;
            this.attributes.repromptSpeech = 'Try saying repeat.';
            this.emit(':tellWithCard', this.attributes.speechOutput, cardTitle, enemy_instructions);
        } else {
            var repromptSpeech = 'What else can I help with?';
            this.attributes.repromptSpeech = repromptSpeech;
            if (enemyName) {
                var speechOutput = 'I\'m sorry, I currently do not know how to beat ' + enemyName + '. ';
                this.attributes.speechOutput = speechOutput;
                 this.emit(':tell', speechOutput, repromptSpeech);
            } else {
                var question = 'Which enemy would you like to beat?';
                this.attributes.speechOutput = question;
                this.emit(':ask', question, repromptSpeech);
            }
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = 'You can ask questions such as, how do I beat gohma, or, you can say exit... ' +
            'Now, what can I help you with?';
        this.attributes.repromptSpeech = 'You can say things like, what\'s the recipe, or you can say exit...' +
            ' Now, what can I help you with?';
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {

        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(":tell", "Thank you for using Linkletter");
    }
};
