import {  APIGatewayProxyEvent,  APIGatewayProxyResult  } from "aws-lambda";
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

export const lambdaHandler = (event: APIGatewayProxyEvent, context: any, callback: any) => {

  if(isNotValid(event)) {
    callback(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const carId = event.queryStringParameters.id;
	getCar(carId).then((result: any) => {
    callback(null, {
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

function getCar(carId: string) {
  return ddb.get({
    TableName: 'Cars',
    Key: {
      id: carId
    }
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

function isNotValid(event: APIGatewayProxyEvent) {
  let isNotValid = false;
  if(!event || !event.queryStringParameters || !event.queryStringParameters.id) {
    isNotValid = true;
  }
  return isNotValid;
}