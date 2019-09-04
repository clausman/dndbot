# dndbot
This is slackbot for tabletop rpg management in slack, specifically designed for d&d. 

It currently features the following functionality:

 * Die rolls via slash commands


## Running

Create two [new slash commands](https://api.slack.com/slash-commands#creating_commands), /roll and /sroll, in your Slack.

Copy the file [secrets.sample.yml] to `secrets.yml` and update it with the slash command tokens.

Setup [serverless](https://serverless.com/framework/docs/getting-started/) and [configure AWS credentials](https://serverless.com/framework/docs/providers/aws/cli-reference/config-credentials/).

Run `serverless deploy -v` to deploy the bot.

Update the slash commands created above with the ServiceEndpoint for your bot.

## Use in Slack

Currently available slash commands are

  * /roll - rolls some dice publically
  * /sroll - rolls some dice secret to you

Some examples:

/roll 1d6

/sroll 1d8+2d6+3

### Valid roll text

Rolling is resolved using the [node-roll library](https://github.com/troygoode/node-roll), see its docs for more valid roll strings
