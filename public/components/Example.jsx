"use strict";

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Highlight from './Highlight.jsx';
import Playground from 'component-playground/components/playground.jsx';
import Preview from 'component-playground/components/preview.jsx';
import Subschema, {PropTypes, Form, ValueManager, loaderFactory, DefaultLoader, decorators} from 'Subschema';
import CodeMirror from 'codemirror/mode/javascript/javascript.js';
import cloneDeep from 'lodash/lang/cloneDeep';
import ExampleLess from './Example.less';
import each from 'lodash/collection/each';
import samples from 'subschema-test-support/samples';
import DownloadButton from './DownloadButton.jsx';
import DisplayValueAndErrors from './DisplayValueAndErrors.jsx'
import {availablePlugins} from "babel-standalone";
import transformLegacy from "babel-plugin-transform-decorators-legacy";
import SubschemaPlayground from './SubschemaPlayground.jsx';

availablePlugins['transform-decorators-legacy'] = transformLegacy;

Preview.babelrc.plugins = [
    "transform-decorators-legacy"
];

const {provide} = decorators;

function stringify(name, obj) {

    var str = !obj ? 'null' : typeof obj === 'string' ? obj : JSON.stringify(obj, null, '\t');
    return `var ${name} = ${str};`;
}


export default class Example extends Component {

    static contextTypes = PropTypes.contextTypes;

    static propTypes = {
        example: PropTypes.string
    };

    render() {
        return <div>
            <h3>{this.props.example}</h3>
            <p>{this.props.conf.description}</p>
            {this.renderEdit()}

        </div>
    }


    renderEdit() {
        var {schema, setup, setupTxt, props,description,data,errors} = this.props.conf;
        props = props || {};
        return <div className='sample-example-playground'>
            <SubschemaPlayground key={'form-'+this.props.example}
                                 theme='monokai'
                                 expandTxt="Show Example Code"
                                 collapseTxt="Hide Example Code"
                                 setupTxt={setupTxt}
                                 value={data}
                                 useData={this.props.useData}
                                 useError={this.props.useError}
                                 errors={errors}
                                 formProps={props}
                                 filename={`Example ${this.props.example}`}
                                 imports={Object.keys(props)}
                                 description={description}
                                 schema={schema}
                                 collapsableCode={true}
            />

        </div>
    }
}
