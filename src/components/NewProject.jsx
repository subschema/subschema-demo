"use strict";
import React, {Component} from 'react';
import {Form, ValueManager, decorators, loader, loaderFactory, PropTypes} from 'Subschema';
import DownloadButton from './DownloadButton.jsx';
import camelCase from 'lodash/string/camelCase';
import kebabCase from 'lodash/string/kebabCase';
import capitalize from 'lodash/string/capitalize';
import validateNpmPkgName from 'validate-npm-package-name'

const schema = {
    schema: {
        name: {
            type: 'Text',
            validators: ['required', 'npm_validate']
        },
        description: {
            type: 'TextArea',
            validators: ['required']
        },
        "buttons": {
            type: "UpdateValue",
            template: false
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
    static propTypes = {
        filename: PropTypes.value,
        description: PropTypes.value,

    };

    static defaultProps = {
        filename: "name",
        description: "description",
        sample: 'Basic'
    };

    name(name) {
        name = name || 'sample';
        this.setState({
            jsName: camelCase(filename),
            filename: `${filename}`,
            name: name, title: capitalize(filename.replace('-', ' '))
        });
    }

    description(description) {
        this.setState({
            description
        });
    }

    render() {
        let {filename, description, sample} = this.props;
        filename = filename || 'simple';

        const {...copy} = this.context.loader.loadSample(sample);
        const data = {
            jsName: camelCase(filename),
            name: filename,
            title: capitalize(filename.replace('-', ' ')),
            schema: copy,
            sample: {
                schema: copy,
                description
            }
        };

        return (<div className="btn-group">
            <DownloadButton filename={filename} data={data} type='project' key="project"/>
            <DownloadButton filename={filename} data={data} type='page' key="page" buttonTxtPage="Preview"/>
        </div>);
    }
}
projectLoader.addType({UpdateValue});


export default class NewProject extends Component {


    handleSubmit = (e) => {
        e && e.preventDefault();
    };

    render() {
        return (
            <Form schema={schema} onSubmit={this.handleSubmit} valueManager={this.valueManager} loader={projectLoader}/>
        );

    }
}