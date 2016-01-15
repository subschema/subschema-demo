"use strict";
import React, {Component, PropTypes} from 'react';
import Subschema, {ValueManager, Form, loaderFactory, decorators, DefaultLoader} from 'Subschema';
import Editor from 'component-playground/components/Editor.jsx';
import {transform, availablePlugins} from "babel-standalone";
import DisplayValueAndErrors from './DisplayValueAndErrors.jsx'
import transformLegacy from "babel-plugin-transform-decorators-legacy";
import DownloadButton from './DownloadButton.jsx';

availablePlugins['transform-decorators-legacy'] = transformLegacy;

const babelrc = {
    presets: ["react", "es2015", "stage-0"],
    plugins: [
        "transform-decorators-legacy"
    ]
};

function createPrelude(imports) {
    imports = ['Form'].concat(imports);

    return `"use strict";
import React, {Component} from 'react';
import Subschema,{${imports.join(',')}} from 'Subschema';
`;
}
function stringify(obj) {
    if (obj == null) return 'null';
    return JSON.stringify(obj, null, 2);
}
function createForm(props) {
    props = props || {};
    if (!props.schema) {
        props.schema = 'schema';
    }
    var propStr = map(props, function (v, k) {
        if (typeof v !== 'string') {
            v = k;
        }
        return `${k}={${v}}`;
    }).join(' ');
    return `<Form ${propStr}/>`;
}

function map(obj, fn, scope) {
    if (obj == null) return null;
    if (Array.isArray(obj)) {
        return obj.map(fn, scope);
    }
    return Object.keys(obj).map(function (k, idx, arr) {
        return fn(obj[k], k, idx, arr);
    }, scope);

}
export default class SubschemaPlayground extends Component {
    static propTypes = {
        collapsableCode: PropTypes.bool,
        theme: PropTypes.string,
        context: PropTypes.object,
        initiallyExpanded: PropTypes.bool,
        previewComponent: PropTypes.node,
        expandTxt: PropTypes.string,
        collapseTxt: PropTypes.string,
        imports: PropTypes.arrayOf(PropTypes.string),
        schema: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        setupTxt: PropTypes.string.isRequired,
        value: PropTypes.object,
        errors: PropTypes.object,
        formProps: PropTypes.object,
        onChange: PropTypes.func,
        filename: PropTypes.string

    };


    static defaultProps = {
        theme: "monokai",
        noRender: true,
        context: {},
        setupTxt: '',
        expandTxt: "Show Example Code",
        collapseTxt: "Hide Example Code",
        initiallyExpanded: false,
        filename: 'example',
        onChange(){
        }
    };

    constructor(props, ...rest) {
        super(props, ...rest);
        this.state = {
            code: props.setupTxt,
            expandedCode: props.initiallyExpanded,
            external: true
        };
    }

    createEditorCode() {
        var code = '';
        var {data, errors,useData, useError, schema} = this.props;

        if (useData) {
            code += `var value = ${stringify(this.props.data)};\n`;
        }
        if (useError) {
            code += `var errors = ${stringify(this.props.errors)};\n`;
        }
        code += `var schema = ${stringify(schema)};\n`;

        code += this.state.code;

        return code;
    }

    createFunction(editorCode) {
        var code = this.state.code;

        const valueManager = ValueManager(this.props.useData? this.props.value : {});
        const loader = loaderFactory([DefaultLoader]);
        const {decorators, ...SubschemaCopy} = Subschema;
        const {...copyDecorators} = Subschema.decorators;
        const {errors, value} = this.props;
        const {...schema} = this.props.schema;

        decorators.provide.defaultLoader = loader;
        SubschemaCopy.decorators = copyDecorators;
        try {
            var func = new Function(['React', 'Component', 'Subschema', 'loader', 'valueManager', 'errors', 'value', 'schema'], `

${transform(editorCode, babelrc).code}

return {
   loader,
   schema,
   valueManager
};
`);
            var ret = func(React, Component, SubschemaCopy, loader, valueManager, errors, value, schema);
            this._compiled = func;
            this.state.error = null;
            return ret;
        } catch (e) {
            this.handleError(e);
        }

        if (this._compiled) {
            try {
                return this._compiled(React, Component, SubschemaCopy, loader, valueManager, errors, value, schema);
            } catch (e) {
            }
        }
        return {};
    }

    handleError(e) {
        const error = e.message;
        clearTimeout(this._timeout);

        this._timeout = setTimeout(()=> {
            this.setState({error});
        }, 200);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            code: nextProps.setupTxt,
            external: true
        });
    }

    _handleCodeChange = (code) => {
        this.props.onChange(code);
        this.setState({
            code,
            external: false
        });
    };

    _toggleCode = () => {
        this.setState({
            expandedCode: !this.state.expandedCode
        });
    };


    renderToggle() {
        return <span className="playgroundToggleCodeLink" onClick={this._toggleCode}>
             {this.state.expandedCode ? this.props.collapseTxt : this.props.expandTxt}
            </span>
    }

    renderEditor(editorCode) {
        return <div>
            <div className="prelude">
                <Editor
                    className="playgroundStage"
                    readOnly={true}
                    codeText={createPrelude(this.props.imports)}
                    theme={this.props.theme}
                />
            </div>
            <Editor
                onChange={this._handleCodeChange}
                className="playgroundStage"
                codeText={editorCode}
                external={this.state.external}
                theme={this.props.theme}
            />
            <div className="prelude">
                <Editor
                    readOnly={true}
                    className="playgroundStage"
                    codeText={createForm(this.props.formProps)}
                    theme={this.props.theme}
                />
            </div>
        </div>
    }

    render() {
        const { collapsableCode, schema, errors, value, useData,useError, filename } = this.props;
        const editorCode = this.createEditorCode();
        const formProps = this.createFunction(editorCode);
        const _errors = useError ? errors : null;
        const _data = useData ? value : {};

        const sample = {
            setupTxt: this.state.code,
            schema,
            data:_data,
            errors:_errors,
            description: this.props.description
        };
        if (useError){
            setTimeout(()=>{
                formProps.valueManager.setErrors(_errors);
            }, 500)
        }
        return (
            <div>
                <div className={`playground ${collapsableCode ? "collapsableCode" : ""}`}>
                    <div className={`playgroundCode ${this.state.expandedCode ? " expandedCode" : ""}`}>
                        {this.state.expandedCode ? this.renderEditor(editorCode) : null }
                    </div>
                    {this.state.error ?<div className="error">
                        {this.state.error}
                    </div> : null}
                    {this.renderToggle()}
                    <div className="playgroundPreview clearfix">
                        <Form {...formProps}>
                            <div style={{width:'100%', float:'left'}}>
                                <DisplayValueAndErrors/>
                            </div>
                        </Form>
                    </div>
                </div>
                <div className='btn-group'>
                    <DownloadButton type="page" useData={useData} useError={useError} data={sample}
                                    filename={filename}/>
                    <DownloadButton type="project" useData={useData} useError={useError} data={sample}
                                    filename={filename}/>
                </div>
            </div>
        );
    }

}