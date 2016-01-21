# dndbot
This is slackbot for tabletop rpg management in slack, specifically designed for d&d. 
It uses botkit and it modelled after their kit.

It currently features the following functionality:

 * Die rolls


## Running

Get a Bot token from Slack: http://my.slack.com/services/new/bot

Run your bot from the command line:

    team_id=<TEAM ID> port=<PORT> token=<MY TOKEN> node bot.js

MY TOKEN - token for slack bot integration
PORT - the port to bind to for slash command support
TEAM ID - the id of your slack team

## Use in Slack

Find your bot inside Slack to send it a direct message.

Say: "roll 1d6"

The bot will reply with the value of the die

Say: "roll 1d8+2d6+3"

The bot will reply with the value of the die

You can also setup Slack slash commands. Botkit automatically binds to /slack/reveive on the port you specify. 
To support slash command, you will need manually create the slash integration for your slack team, and point them at the correct url on the server hosting this bot.
Currently available slash commands are

  * /roll - rolls some dice publically
  * /sroll - rolls some dice secret to you

Make sure to invite your bot into other channels using /invite @<my bot>!

### Valid roll text

Rolling is resolved using the npm library roll, see its docs for more valid roll strings

## Extending

Botkit is has many features for building cool and useful bots!

Read all about it here: http://howdy.ai/botkit
