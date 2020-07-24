import {  APIGatewayProxyEvent,  APIGatewayProxyResult  } from "aws-lambda";
const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
const ddb = new AWS.DynamoDB.DocumentClient();
const crypto = require("crypto");

export const lambdaHandler = (event: APIGatewayProxyEvent, context: any, callback: any) => {
  const requestBody = JSON.parse(event.body);
  const carId: string = crypto.randomBytes(16).toString("hex");

  if(isNotValid(event)) {
    callback(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  addCar(carId, requestBody).then((result: any) => {
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
  const props = ['name', 'vin', 'make', 'model', 'year', 'fuelType', 'type', 'Position', 'odometer', 'fuel', 'battery'];
  let isNotValid = false;
  if(!props.every((x) => { return x in requestBody; })) {
    isNotValid = true;
  }
  return isNotValid;
}
