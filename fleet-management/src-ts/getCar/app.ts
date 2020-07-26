import {  APIGatewayProxyEvent,  APIGatewayProxyResult, Context, Callback } from "aws-lambda";
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
// import core
const middy = require('@middy/core')
// import some middlewares
const jsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const validator = require('@middy/validator')

const getCarHandler = (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
  const carId: string = event.queryStringParameters.id;
	getCar(carId).then((result: object) => {
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
 type: 'object',
 properties: {
   queryStringParameters: {
     type: 'object',
     properties: {
       id: { type: 'string', minLength: 32, maxLength: 32 },
     },
     required: ['id']
   }
 }
}

// Let's "middyfy" our handler, then we will be able to attach middlewares to it
const lambdaHandler = middy(getCarHandler)
  .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
  .use(validator({inputSchema})) // validates the input
  .use(httpErrorHandler()) // handles common http errors and returns proper responses

module.exports = { lambdaHandler };