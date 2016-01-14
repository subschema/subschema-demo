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

    componentWillMount() {
        if (!this.state) this.state = {edit: true};
        this.setup(this.props);
    }

    componentWillUnmount() {
        provide.defaultLoader = this.context.loader;
    }

    componentWillReceiveProps(props) {
        if (!this.managed || props.example !== this.props.example) {
            this.setup(props);
            this.forceUpdate();
        } else {
            if (props.useData !== this.props.useData) {
                this.managed.valueManager.setValue(props.useData ? this.managed.data : {});
            }
            if (props.useError !== this.props.useError) {
                this.managed.valueManager.setErrors(props.useError ? this.managed.errors : null);
            }
        }
    }

    setup(props) {
        var {schema, ...managed} = samples[props.example];
        this.managed = managed;
        var value = {}, errors = null;
        if (props.useData) {
            value = managed.data;
        }
        if (props.useError) {
            errors = managed.errors;
        }
        managed.schema = cloneDeep(schema);


        managed.valueManager = ValueManager(value, errors);

    }

    schema() {
        return JSON.stringify(this.managed.schema, null, 2);
    }

    render() {
        var schema = this.schema();
        return <div>
            <h3>{this.props.example}</h3>
            <p>{this.managed.description}</p>
            {this.renderEdit()}

        </div>
    }


    renderEdit() {
        var {schema, setup, setupTxt, props, data,errors, valueManager} = this.managed;
        var loader = provide.defaultLoader = loaderFactory([DefaultLoader]);
        var valProps = {
                schema: schema,
                value: this.props.useData ? data : {},
                errors: this.props.useError ? errors : null
            },
            context = {
                valueManager,
                loader
            },
            scope = {
                Form,
                React,
                Subschema,
                loader,
                valueManager,
                DisplayValueAndErrors
            };
        //Just in case
//        rest.Form = FormContext;
        props = props || {};
        if (setup) {
            setup(scope, valProps);
        }
        var propStr = [], vars = [];
        Object.keys(valProps).forEach(function (v) {
            if (!valProps[v] || props[v]) {
                return;
            }
            vars.push(stringify(v, valProps[v]));
            propStr.push(`${v}={${v}}`);
        });
        each(props, (val, v)=> {
            if (val == true) val = v;
            else val = JSON.stringify(val);
            propStr.push(`${v}={${val}}`);
        });
        var codeText = [
            `(function () {
"use strict";
//uncomment these if you are using outside of the editor
//import React, {Component} from "react";
//import Subschema,{Form} from "Subschema";
            `,
            vars.join('\n'),
            setupTxt,
            `return <Form ${propStr.join(' ')}><DisplayValueAndErrors/></Form>`,
            '}())'
        ].join('\n');
        console.log('example\n\n', codeText, '\n\n');
        return <div className='sample-example-playground'>
            <Playground key={'form-'+this.props.example}
                        codeText={codeText}
                        theme='monokai'
                        expandTxt="Show Example Code"
                        collapseTxt="Hide Example Code"
                        collapsableCode={true}
                        scope={scope}
                        context={context}

            />
            <div className='btn-group'>
                <DownloadButton type="page" data={this.managed} filename={`Example ${this.props.example}`}/>
                <DownloadButton type="project" data={this.managed} filename={`Example ${this.props.example}`}/>
            </div>
        </div>
    }
}
