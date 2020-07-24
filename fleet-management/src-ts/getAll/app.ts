import {  APIGatewayProxyEvent,  APIGatewayProxyResult  } from "aws-lambda";
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

export const lambdaHandler = (event: APIGatewayProxyEvent, context: any, callback: any) => {
  const requestBody = JSON.parse(event.body);
	getAll().then((result: any) => {
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

function errorResponse(errorMessage: string, awsRequestId: number, callback: any) {
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