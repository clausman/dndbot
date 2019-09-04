import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { handleSlackCommand, roll } from './handler';
import * as slackHelpers from './slackHelpers';
import { APIGatewayProxyEvent } from 'aws-lambda';

const expect = chai.expect;

describe("handler", () => {
  describe("roll", () => {
    it("handles simple roll", async () => {
      const fakeEvent = {
        queryStringParameters: { text: '1d1+10' },
      } as unknown as APIGatewayProxyEvent;
      roll(fakeEvent, null, (error, response) => {
        expect(error).to.be.undefined;
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.be('11 - [1]');
      });
    });
  });

  describe("slash command", () => {
    let isValidTokenStub: sinon.SinonStub<[string, string], boolean> = undefined;

    const testSlashCommand: slackHelpers.SlashCommand = {
      token: 'token',
      user_id: 'tester_id',
      user_name: 'tester',
      response_url: 'response_url',
      trigger_id: 'trigger_id',
      command: '/unsupported'
    }

    before(() => {
      isValidTokenStub = sinon.stub(slackHelpers, 'isValidToken');
    });

    after(() => {
      isValidTokenStub.restore();
    });

    describe("/roll", () => {
      const validRollCommand: slackHelpers.SlashCommand = {
        ...testSlashCommand,
        command: '/roll',
        text: '1d1+2'
      }
      
      it("should not accept empty text", async () => {
        isValidTokenStub.returns(true);
        const result = await handleSlackCommand({
          ...validRollCommand,
          text: ''
        });
        expect(result.statusCode).to.eq(200);
        const responseMessage = JSON.parse(result.body);
        expect(responseMessage.text).to.contain('Roll text required');
      });

      it("should respond for a valid roll", async () => {
        isValidTokenStub.returns(true);
        const result = await handleSlackCommand(validRollCommand);
        expect(result.statusCode).to.eq(200);
        const responseMessage = JSON.parse(result.body);
        expect(responseMessage.text).to.eq('3 - [1]');
        expect(responseMessage.response_type).to.eq('in_channel');
      });

      it('should return unauthorized on bad access tokens', async () => {
        isValidTokenStub.returns(false);
        const result = await handleSlackCommand(validRollCommand);
        expect(result.statusCode).to.eq(401);
      });
    });

    // This is copy-paste from /roll except that in_channel is different.
    describe("/sroll", () => {
      const validSecretRollCommand: slackHelpers.SlashCommand = {
        ...testSlashCommand,
        command: '/sroll',
        text: '1d1+2'
      }
      
      it("should not accept empty text", async () => {
        isValidTokenStub.returns(true);
        const result = await handleSlackCommand({
          ...validSecretRollCommand,
          text: ''
        });
        expect(result.statusCode).to.eq(200);
        const responseMessage = JSON.parse(result.body);
        expect(responseMessage.text).to.contain('Roll text required');
      });

      it("should respond for a valid roll", async () => {
        isValidTokenStub.returns(true);
        const result = await handleSlackCommand(validSecretRollCommand);
        expect(result.statusCode).to.eq(200);
        const responseMessage = JSON.parse(result.body);
        expect(responseMessage.text).to.eq('3 - [1]');
        expect(responseMessage.response_type).to.be.undefined;
      });

      it('should return unauthorized on bad access tokens', async () => {
        isValidTokenStub.returns(false);
        const result = await handleSlackCommand(validSecretRollCommand);
        expect(result.statusCode).to.eq(401);
      });
    });
  })
});