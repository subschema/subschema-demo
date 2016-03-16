"use strict";
import React, {Component} from 'react';
import {Form, newSubschemaContext, PropTypes, ReactCSSReplaceTransition} from 'Subschema';
import Editor from './Editor.jsx';
import {transform, availablePlugins} from "babel-standalone";
import UninjectedDisplayValueAndErrors from './DisplayValueAndErrors.jsx';
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
        value: PropTypes.any,
        errors: PropTypes.any,
        formProps: PropTypes.object,
        onChange: PropTypes.func,
        filename: PropTypes.string,
        DisplayValueAndErrors: PropTypes.injectClass,
        useData: PropTypes.bool,
        useError: PropTypes.bool,
        rollUp: PropTypes.transition

    };


    static defaultProps = {
        theme: "monokai",
        rollUp: {transition: "rollUp", on: ["appear", "enter", "leave"]},
        noRender: true,
        context: {},
        setupTxt: '',
        expandTxt: "Show Example Code",
        collapseTxt: "Hide Example Code",
        initiallyExpanded: false,
        filename: 'example',
        onChange(){
        },
        DisplayValueAndErrors: UninjectedDisplayValueAndErrors
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
        const Subschema = newSubschemaContext();
        const {ValueManager, loader}  = Subschema;
        const valueManager = ValueManager(this.props.useData ? this.props.value : {});
        const {errors, value} = this.props;
        const {...schema} = this.props.schema;
        try {
            var func = new Function(['React', 'Component', 'Subschema', 'loader', 'valueManager', 'errors', 'value', 'schema'], `

${transform(editorCode, babelrc).code}

return {
   loader,
   schema,
   valueManager
};
`);
            var ret = func(React, Component, Subschema, loader, valueManager, errors, value, schema);
            this._compiled = func;
            this.state.error = null;
            return ret;
        } catch (e) {
            this.handleError(e);
        }

        if (this._compiled) {
            try {
                return this._compiled(React, Component, Subschema, loader, valueManager, errors, value, schema);
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
        return <div key="editor">
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
        const {DisplayValueAndErrors, collapsableCode, schema, errors, value, useData,useError, filename } = this.props;
        const editorCode = this.createEditorCode();
        const formProps = this.createFunction(editorCode);
        const _errors = useError ? errors : null;
        const _data = useData ? value : {};

        const sample = {
            setupTxt: this.state.code,
            schema,
            data: _data,
            errors: _errors,
            description: this.props.description
        };
        if (useError) {
            setTimeout(()=> {
                formProps.valueManager.setErrors(_errors);
            }, 500)
        }

        return (
            <div>
                <div className={`playground ${collapsableCode ? "collapsableCode" : ""}`}>
                    <div className={`playgroundCode ${this.state.expandedCode ? " expandedCode" : ""}`}>
                        <ReactCSSReplaceTransition key="transition" {...this.props.rollUp}>
                            {this.state.expandedCode ? this.renderEditor(editorCode) : <span key="no-show"/> }
                        </ReactCSSReplaceTransition>
                    </div>
                    {this.state.error ? <div className="error">
                        {this.state.error}
                    </div> : null}
                    {this.renderToggle()}
                    <div className="playgroundPreview clearfix">
                        <Form {...formProps}>
                            <div style={{width:'100%', float:'left'}}>
                                <DisplayValueAndErrors value="."/>
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