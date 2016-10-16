'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = undefined; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';
var SKILL_NAME = 'Legend of Zelda Enemy Guide';
var enemies = require('./enemies');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'NewSession': function () {
        this.attributes['speechOutput'] = 'Welcome to ' + SKILL_NAME + '. You can ask a question like, how do i beat an octorok? ... Now, what can I help you with.';
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = 'For instructions on what you can say, please say help me.';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'RecipeIntent': function () {
        var enemySlot = this.event.request.intent.slots.Enemy;
        var enemyName;
        if (enemySlot && enemySlot.value) {
            enemyName = enemySlot.value.toLowerCase();
        }

        var cardTitle = SKILL_NAME + ' - Beating ' + enemyName;
        var enemy = enemies[enemyName];

        if (enemy) {
            this.attributes['speechOutput'] = enemy;
            this.attributes['repromptSpeech'] = 'Try saying repeat.';
            this.emit(':askWithCard', enemy, this.attributes['repromptSpeech'], cardTitle, enemy);
        } else {
            var speechOutput = 'I\'m sorry, I currently do not know ';
            var repromptSpeech = 'What else can I help with?';
            if (enemyName) {
                speechOutput = 'how to beat ' + enemyName + '. ';
            } else {
                speechOutput = 'what that enemy is ';
            }
            speechOutput += repromptSpeech;

            this.attributes['speechOutput'] = speechOutput;
            this.attributes['repromptSpeech'] = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = 'You can ask questions such as, how do I beat gohma, or, you can say exit... ' +
            'Now, what can I help you with?';
        this.attributes['repromptSpeech'] = 'You can say things like, what\'s the recipe, or you can say exit...' +
            ' Now, what can I help you with?';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', 'Goodbye!');
    }
};
