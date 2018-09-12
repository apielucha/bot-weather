// @flow

import { SessionsClient } from 'dialogflow';
import dotenv from 'dotenv';

// Set variables from .env in process.env
dotenv.config();

/**
 * Class Weather
 */
class Weather {
  /**
   * Getter for the language configuration.
   *
   * @return {string}
   */
  static get LANGUAGE(): string {
    return 'en-US';
  }

  /**
   * Static method that tells you the weather forecast from a
   * string query that you give.
   *
   * @param {string} query - question about the weather
   *   Example: "What is the weather like in Paris?"
   * @return {Promise}
   */
  static forecast(query: string): string {
    const projectID: ?string = process.env.GOOGLE_PROJECT_ID;
    const sessionID: string = 'calldesk-session-id';

    const sessionClient: SessionsClient = new SessionsClient();
    const sessionPath: Object = sessionClient.sessionPath(projectID, sessionID);

    const request: Object = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: Weather.LANGUAGE,
        },
      },
    };

    // Returns a Promise with an object res with the following architecture:
    // {
    //   "responseId": string,
    //   "fulfillmentMessages": [],
    //   "outputContexts": [],
    //   "queryText": string,
    //   "speechRecognitionConfidence": number,
    //   "action": string,
    //   "parameters": {},
    //   "allRequiredParamsPresent": boolean,
    //   "fulfillmentText": string,
    //   "webhookSource": string,
    //   "webhookPayload": null,
    //   "intent": {},
    //   "intentDetectionConfidence": number,
    //   "diagnosticInfo": {},
    //   "languageCode": string
    // }
    return sessionClient.detectIntent(request)
      .then(res => ({ responseId: res[0].responseId, ...res[0].queryResult }))
      .catch(err => Error('ERROR:', err));
  }
}

export default Weather;
