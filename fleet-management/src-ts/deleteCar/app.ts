import {  APIGatewayProxyEvent,  APIGatewayProxyResult, Context, Callback } from "aws-lambda";
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const httpErrorHandler = require('@middy/http-error-handler');
const validator = require('@middy/validator');
const cors = require('@middy/http-cors');
const httpHeaderNormalizer = require('@middy/http-header-normalizer');

const deleteCarHandler = (event: any, context: Context, callback: Callback) => {
  const carId = event.body.id;
	deleteCar(carId).then((result: object) => {
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
    body: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' },
      },
    }
  },
}

const lambdaHandler = middy(deleteCarHandler)
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())
  .use(validator({inputSchema}))
  .use(httpErrorHandler())
  .use(cors())

module.exports = { lambdaHandler };
