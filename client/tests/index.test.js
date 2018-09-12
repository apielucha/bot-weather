/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import Weather from '../src/weather';

describe('Test weather chatbot possible questions', () => {
  describe('Include no parameters', () => {
    it('should ask what location', () => Weather
      .forecast('What is the weather like?')
      .then((res) => {
        expect(res.queryText).to.equal('What is the weather like?');
        expect(res.parameters.fields.date.stringValue).to.be.empty;
        expect(res.parameters.fields['geo-city'].stringValue).to.be.empty;
        expect(res.fulfillmentText).to.equal('For what location?');
      })
      .catch((err) => { throw err; })).timeout(5000);

    it('should give an answer', () => Weather
      .forecast('Berlin')
      .then((res) => {
        expect(res.queryText).to.equal('Berlin');
        expect(res.parameters.fields.date.stringValue).to.be.empty;
        expect(res.parameters.fields['geo-city'].stringValue).to.not.be.empty;
        expect(res.fulfillmentText).to.include('Current conditions in ');
      })
      .catch((err) => { throw err; })).timeout(5000);
  });

  describe('Include no city parameter', () => {
    it('should ask what location', () => Weather
      .forecast('What will the weather be like sunday?')
      .then((res) => {
        expect(res.queryText).to.equal('What will the weather be like sunday?');
        expect(res.parameters.fields.date.stringValue).to.not.be.empty;
        expect(res.parameters.fields['geo-city'].stringValue).to.be.empty;
        expect(res.fulfillmentText).to.equal('For what location?');
      })
      .catch((err) => { throw err; })).timeout(5000);

    it('should give an answer', () => Weather
      .forecast('Madrid')
      .then((res) => {
        expect(res.queryText).to.equal('Madrid');
        expect(res.parameters.fields.date.stringValue).to.not.be.empty;
        expect(res.parameters.fields['geo-city'].stringValue).to.not.be.empty;
        expect(res.fulfillmentText).to.include('Current conditions in ');
      })
      .catch((err) => { throw err; })).timeout(5000);
  });

  describe('Include no date parameter', () => {
    it('should give an answer', () => Weather
      .forecast('What is the weather in Paris?')
      .then((res) => {
        expect(res.queryText).to.equal('What is the weather in Paris?');
        expect(res.parameters.fields.date.stringValue).to.be.empty;
        expect(res.parameters.fields['geo-city'].stringValue).to.not.be.empty;
        expect(res.fulfillmentText).to.include('Current conditions in ');
      })
      .catch((err) => { throw err; })).timeout(5000);
  });

  describe('Include all parameters (city + date)', () => {
    it('should give an answer', () => Weather
      .forecast('What will the weather be like in New York tomorrow?')
      .then((res) => {
        expect(res.queryText).to.equal('What will the weather be like in New York tomorrow?');
        expect(res.parameters.fields.date.stringValue).to.not.be.empty;
        expect(res.parameters.fields['geo-city'].stringValue).to.not.be.empty;
        expect(res.fulfillmentText).to.include('Current conditions in ');
      })
      .catch((err) => { throw err; })).timeout(5000);
  });
});
