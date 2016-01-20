# dndbot
This is slackbot for tabletop rpg management in slack, specifically designed for d&d. 
It uses botkit and it modelled after their kit.

It currently features the following functionality:

 * Die rolls


## Running

Get a Bot token from Slack: http://my.slack.com/services/new/bot

Run your bot from the command line:

    token=<MY TOKEN> node bot.js

## Use in Slack

Find your bot inside Slack to send it a direct message.

Say: "roll 1d6"

The bot will reply with the value of the die

Say: "roll 1d8+2d6+3"

The bot will reply with the value of the die

Rolling is resolved using the npm library roll, see its docs for more valid roll strings

Make sure to invite your bot into other channels using /invite @<my bot>!

## Extending

Botkit is has many features for building cool and useful bots!

Read all about it here: http://howdy.ai/botkit
