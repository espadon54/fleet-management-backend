'use strict';

import { expect } from 'chai';
const app = require('../../app');
const event = require('../../../../../events/getAll.json');
let context : any;

describe('Tests get all cars', function () {
  it('verifies successful response', (done) => {
    app.lambdaHandler(event, context, (err: any, result: any) => {
      expect(result).to.be.an('object');
      expect(result.statusCode).to.equal(200);
      expect(result.body).to.be.an('string');
      let response = JSON.parse(result.body);
      expect(response).to.be.an('object');
      expect(response.result.Items).to.be.an('array');
      done();
    })
  });
});
