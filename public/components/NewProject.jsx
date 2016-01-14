"use strict";
import React, {Component} from 'react';
import {Form, ValueManager, decorators, loader, loaderFactory, PropTypes, NewChildContext} from 'Subschema';
import DownloadButton from './DownloadButton.jsx';
import samples from 'subschema-test-support/samples';
import camelCase from 'lodash/string/camelCase';
import kebabCase from 'lodash/string/kebabCase';
import capitalize from 'lodash/string/capitalize';
import validateNpmPkgName from 'validate-npm-package-name'

const {Basic} = samples;
const {listen} = decorators;

const schema = {
    schema: {
        name: {
            type: 'Text',
            validators: ['required','npm_validate']
        },
        description: {
            type: 'TextArea',
            validators: ['required']
        }
    }
};

const projectLoader = loaderFactory([loader]);
projectLoader.addValidator({
    npm_validate(options) {
        options = options || {};
        if (!options.message) {
            options.message = "Invalid Package Name"
        }
        if (!options.validType) {
            options.validType = 'validForNewPackages'
        }
        return function package_name$validator(value) {
            if (!validateNpmPkgName(value)[options.validType]) {
                return {
                    message: options.message
                }
            }
        }
    }
});

class UpdateValue extends Component {
    @listen("value", "name")
    name(name) {
        name = name || 'sample';
        this.setState({
            jsName: camelCase(name),
            filename: `${name}`,
            name: name, title: capitalize(name.replace('-', ' '))
        });
    }

    @listen("value", "description")
    description(description) {
        this.setState({
            description
        });
    }

    render() {
        const {filename, ...data} = this.state;
        const {schema} = Basic;
        data.schema = schema;
        data.sample = {
            schema,
            description: this.state.description
        };
        return (<div className="btn-group">
            <DownloadButton filename={filename} data={data} type='project' key="project"/>
            <DownloadButton filename={filename} data={data} type='page' key="page" buttonTxtPage="Preview"/>
        </div>);
    }
}

export default class NewProject extends Component {

    constructor(...args) {
        super(...args);
        this.valueManager = ValueManager();

        this.state = {}
    }

    handleSubmit = (e) => {
        e && e.preventDefault();
    };

    render() {
        return (<Form schema={schema} onSubmit={this.handleSubmit} valueManager={this.valueManager} loader={projectLoader}>
            <UpdateValue/>
        </Form>);

    }
}