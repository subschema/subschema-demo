import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import {ValueManager, Form, decorators, loaderFactory, loader}  from 'Subschema';
import devel from '../src/index';
import Index from './Index.jsx';
import Demo from '../src/Demo.jsx';
import develop from './develop';
import samples from './samples';
import schema from './schema.json';

loader.addLoader(devel);
loader.addType({Index});

loader.loaderType('Sample');
loader.loaderType('Doc');

loader.addSample(samples);
loader.addDoc(develop);

const valueManager = ValueManager({
    samples: loader.listSamples().map(v=>v.name),
    develop: loader.listDocs().map(v=>v.name)
});
render(<Demo valueManager={valueManager} schema={schema} loader={loader} template="FieldSetTemplate"/>, document.getElementById('content'));