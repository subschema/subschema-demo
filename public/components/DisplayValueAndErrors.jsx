"use strict";
import React, {Component} from 'react';
import {decorators} from 'Subschema';

const {listen} = decorators;
/**
 * This class is used to display errors and or values.
 */
function stringify(obj) {
    return JSON.stringify(obj, null, 2);
}
export default class DisplayValueAndErrors extends Component {
    @listen("error", null)
    error(errs, old, key) {
        if (errs) {
            var {...errors} = this.state.errors || {};
            errors[key] = errs;
            this.setState({errors});
        } else {
            this.setState({errors: null});
        }
    }

    @listen("value", null)
    update(value) {
        this.setState({value});
    }

    render() {
        return <div className="form-group clearfix">
            <h3>Values:</h3>
 <pre className='value-manager-node-value'>
 {stringify(this.state.value)}
 </pre>
            <h3>Errors:</h3>
 <pre className='value-manager-node-error'>
 {this.state.errors ? stringify(this.state.errors) : 'No Errors.'}
 </pre>

        </div>
    }
}