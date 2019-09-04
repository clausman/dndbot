import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import * as qs from 'querystring';
import * as Roll from 'roll';

import 'source-map-support/register';
import { isValidToken, isSlashCommand, SlashCommand } from './slackHelpers';

/* Endpoint to easily test roll logic */
export const roll: APIGatewayProxyHandler = async (event, _context) => {
  if (!(event.queryStringParameters && event.queryStringParameters.text)) {
    return {
      statusCode: 400,
      body: "Invalid request. Query parameter 'text' is required."
    };
  }
  const rollText = event.queryStringParameters.text;
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: handleRoll(rollText),
      text: rollText,
    }, null, 2),
  };
}

/* Endpoint to handle slack webhook */
export const webhook: APIGatewayProxyHandler = async (event, _context) => {
  const payload = qs.parse(event.body);
  if (!isSlashCommand(payload)) {
    return {
      statusCode: 400,
      body: 'Invalid message format.'
    };
  }

  return handleSlackCommand(payload);  
}

const rollCommandOptionsMap = {
  '/roll': { inChannel: true, token: process.env.SLACK_TOKEN_ROLL_COMMAND },
  '/sroll': { inChannel: false, token: process.env.SLACK_TOKEN_SROLL_COMMAND }
};

export async function handleSlackCommand(payload: SlashCommand) {
  const rollCommandOptions = rollCommandOptionsMap[payload.command];
  if (!rollCommandOptions) {
    return slackMessageResult({
      text: 'Unsupported slash command. Only /roll and /sroll are supported.'
    });
  }

  if (!isValidToken(payload.token, rollCommandOptions.token)) {
    return {statusCode: 401, body: 'Unauthorized.'};
  }

  if (!payload.text) {
    return slackMessageResult({text: 'Roll text required. e.g. /roll 3d4+7'});
  }

  const rollText = payload.text.replace(/^[/]/, '');

  return slackMessageResult({
    text: handleRoll(rollText)
  }, rollCommandOptions.inChannel);
}

function slackMessageResult(message: {text: string}, inChannel: boolean = false): APIGatewayProxyResult {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...message,
      response_type: inChannel ? 'in_channel' : undefined
    })
  };
}

const dice = new Roll();

function handleRoll(rollText: string): string {
  const valid = dice.validate(rollText);
  if (!valid) {
    return `'${rollText}' is not a valid roll!`;
  } else {
    const roll = dice.roll(rollText);
    console.debug(`'${rollText}' resulted in ${roll}.`);
    let response = `${roll.result}`;
    if (typeof(roll.rolled) !== 'number') {
      response += ' - ' + JSON.stringify(roll.rolled);
    }
    return response;
  }
}