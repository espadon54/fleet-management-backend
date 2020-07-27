import {  APIGatewayProxyEvent,  APIGatewayProxyResult, Context, Callback } from "aws-lambda";
const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
const ddb = new AWS.DynamoDB.DocumentClient();
const crypto = require("crypto");
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const httpErrorHandler = require('@middy/http-error-handler');
const validator = require('@middy/validator');
const cors = require('@middy/http-cors');

const createCarHandler = (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
  const carId: string = crypto.randomBytes(16).toString("hex");
  addCar(carId, event.body).then((result: object) => {
    callback( null, {
      statusCode: 201,
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

function addCar(carId: string, car: any) {
    return ddb.put({
      TableName: 'Cars',
      Item: {
        id: carId,
        name: car.name,
        vin: car.vin,
        make: car.make,
        model: car.model,
        year: car.year,
        fuelType: car.fuelType,
        type: car.type,
        Position: car.Position,
        odometer: car.odometer,
        fuel: car.fuel,
        battery: car.battery,
        creationTime: new Date().toISOString(),
      },
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
      properties: {
        name: { type: 'string', minLength: 5, maxLength: 50 },
        vin: { type: 'string', minLength: 5, maxLength: 50 },
        make: { type: 'string', minLength: 1, maxLength: 50 },
        model: { type: 'string', minLength: 1, maxLength: 50 },
        year: { type: 'number', minLength: 4, maxLength: 4 },
        fuelType: { type: 'string', minLength: 5, maxLength: 50 },
        type: { type: 'string', minLength: 1, maxLength: 50 },
        Position: { type: 'object' },
        odometer: { type: 'number', minLength: 5, maxLength: 50 },
        fuel: { type: 'number', minLength: 5, maxLength: 50 },
        battery: { type: 'number', minLength: 5, maxLength: 50 },
      },
      required: ['vin', 'name']
    }
  }
}

const lambdaHandler = middy(createCarHandler)
  .use(jsonBodyParser())
  .use(validator({inputSchema}))
  .use(httpErrorHandler())
  .use(cors())

module.exports = { lambdaHandler };
