# fleet-management

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI. It includes the following files and folders.

- fleet-management - Code for the application's Lambda functions.
- events - Invocation events that you can use to invoke the function.
- fleet-management/src-ts/[FUNCTION-NAME]/tests - Unit tests for the application code. 
- template.yaml - A template that defines the application's AWS resources.

The application uses several AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

## Deploy the sample application

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 10](https://nodejs.org/en/), including the NPM package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

To build and deploy your application for the first time, run the following in your shell:

First we need to compile the typescript. This will build the source of your application and create/update the built folder.
```bash
cd fleet-management
npm install
npm run compile
```

Then we can deploy using SAM CLI:

```bash
cd ..
sam deploy --guided
```

## Local testing

Launch the local test API.
```bash
sam local start-lambda 
```

Execute an event.

```bash
sam local invoke --debug FleetManagementFunction1 -e events/getCar.json
```

## Run unit tests

```bash
cd fleet-management
npm run test
```

## ARCHITECTURE
- AWS AMPLIFY
- AWS API GATEWAY
- AWS LAMBDA
- AWS DYNAMODB


## TO DO
- Use middy (or an other middleware) to check client params [DONE]
- Use DELETE instead of POST for delete car
- Update template Policies for DynamoDB
- Use typescript interface for Car
- Use Dynamo DB model for Car if possible
- Use proper headers

## Useful links
* https://levelup.gitconnected.com/how-to-use-typescript-for-aws-lambda-in-3-steps-1996243547eb
* https://aws.amazon.com/getting-started/hands-on/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/
