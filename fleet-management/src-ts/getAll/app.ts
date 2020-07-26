import {  APIGatewayProxyEvent,  APIGatewayProxyResult, Context, Callback  } from "aws-lambda";
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const httpErrorHandler = require('@middy/http-error-handler');
const validator = require('@middy/validator');

export const getAllHandler = (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
	getAll().then((result: object) => {
    callback( null, {
      statusCode: 200,
      body: JSON.stringify({
        result,
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }).catch((err: any) => {
    console.error(err);
    errorResponse(err.message, context.awsRequestId, callback);
 });
}

function getAll() {
  return ddb.scan({
    TableName: 'Cars',
  }).promise();
}

function errorResponse(errorMessage: string, awsRequestId: string, callback: Callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}

const inputSchema = {
}

const lambdaHandler = middy(getAllHandler)
  .use(jsonBodyParser())
  .use(validator({inputSchema}))
  .use(httpErrorHandler())

module.exports = { lambdaHandler };
