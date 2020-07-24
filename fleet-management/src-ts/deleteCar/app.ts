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

  const requestBody = JSON.parse(event.body);
  const carId = requestBody.id;

	deleteCar(carId).then((result: any) => {
    callback( null, {
      statusCode: 200,
      body: JSON.stringify({
        carId,
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

function deleteCar(carId: string) {
  return ddb.delete({
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
  const requestBody = JSON.parse(event.body);
  let isNotValid = false;
  if(!event || !event.body || !requestBody.id) {
    isNotValid = true;
  }
  return isNotValid;
}