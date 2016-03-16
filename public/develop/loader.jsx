"use strict";

import React, {Component} from 'react';
import Highlight from '../../src/components/Highlight';
import {PropTypes} from 'Subschema';

export default class Loader extends Component {
    static contextTypes = {
        loader: PropTypes.loader
    };

    render() {
        const {props} = this;
        const Loader = this.context.loader.loadSample('Loader');

        return (<div>
            <h3>Loader</h3>
            <fieldset>
                <legend></legend>
                <p className="lead">
                    Loaders are the key part to extending subschema. I am going to write something about it here.
                    Until then here is some loader zen.
                </p>

                <div className="panel">
                    <div className="panel-heading">
                        <h3>Writing a loader</h3>
                    </div>
                    <div className="panel-body">

                        <Highlight lang="javascript">
                            {Loader.setupTxt}
                        </Highlight>
                    </div>
                </div>

            </fieldset>
        </div>);
    }

}

