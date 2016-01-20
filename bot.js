/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ______     ______     ______   __  __     __     ______
 /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
 \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
 \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
 \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


 This is slackbot for tabletop rpg management in slack, specifically designed for d&d
 It uses botkit and it modelled after their kit.

 It currently features the following functionality:

 * Die rolls

 # RUN THE BOT:

 Get a Bot token from Slack:

 -> http://my.slack.com/services/new/bot

 Run your bot from the command line:

 token=<MY TOKEN> node bot.js

 # USE THE BOT:

 Find your bot inside Slack to send it a direct message.

 Say: "roll 1d6"

 The bot will reply with the value of the die

 Say: "roll 1d8+2d6+3"

 The bot will reply with the value of the die

 Rolling is resolved using the npm library roll, see its docs for more valid roll strings

 Make sure to invite your bot into other channels using /invite @<my bot>!

 # EXTEND THE BOT:

 Botkit is has many features for building cool and useful bots!

 Read all about it here:

 -> http://howdy.ai/botkit

 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var Botkit = require('botkit');
var os = require('os');
var Roll = require('roll'),
  dice = new Roll();
var util = require('util');

var controller = Botkit.slackbot({
  debug: true,
});

var bot = controller.spawn({
  token: process.env.token
}).startRTM();

controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'], 'direct_message,direct_mention,mention', function (bot, message) {

  var hostname = os.hostname();
  var uptime = formatUptime(process.uptime());

  bot.reply(message, ':robot_face: I am a bot named <@' + bot.identity.name + '>. I have been running for ' + uptime + ' on ' + hostname + '.');

});

controller.hears(['roll'], 'direct_message,direct_mention,mention', function(bot, message) {
  var rollText = message.text.replace('roll ', '');
  console.log(rollText);
  var valid = dice.validate(rollText);
  if (!valid) {
    bot.reply(message, util.format('"%s" is not a valid roll!', rollText));
  } else {
    var roll = dice.roll(rollText);
    console.log('%s resulted in %s', rollText, util.inspect(roll, false, null));
    bot.reply(message, ''+roll.result);
  }
});

function formatUptime(uptime) {
  var unit = 'second';
  if (uptime > 60) {
    uptime = uptime / 60;
    unit = 'minute';
  }
  if (uptime > 60) {
    uptime = uptime / 60;
    unit = 'hour';
  }
  if (uptime != 1) {
    unit = unit + 's';
  }

  uptime = uptime + ' ' + unit;
  return uptime;
}
