// @flow

import Weather from './weather';

Weather.forecast('What will the weather be like sunday?')
  .then(res => console.log(res.parameters.fields));
