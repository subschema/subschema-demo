"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'Subschema';

import UninjectedNewProject from '../src/components/NewProject.jsx';

export default class Index extends Component {
    static defaultProps = {
        NewProject: UninjectedNewProject
    };
    static propTypes = {
        NewProject: PropTypes.injectClass
    };

    render() {
        const {NewProject} = this.props;
        return (
            <div className="jumbotron">
                <h1>Subschema</h1>

                <p>This is app shows how to use Subschema</p>

                <p>Wherever it shows <b>expand</b> you can click to see the code that geneated the form, and you can edit
                    the code in place,seeing the result immediately.</p>

                <p>You can see how it works by loading <b>Errors</b> and <b>Data</b>, from the buttons up top</p>

                <p>Here are some ideas of things you can do with Subschema.</p>
                <dl class="dl-horizontal">
                    <dt>Github OAuth Integration</dt>
                    <dd>
                        <a href="https://subschema.github.io/subschema-github/">demo</a> | <a href="https://github.com/subschema/subschema-github/">repo</a>
                    </dd>
                    <dt>Image Upload</dt>
                    <dd>
                        <a href="https://subschema.github.io/subschema-image">demo</a> | <a href="https://github.com/subschema/subschema-image">repo</a>
                    </dd>
                    <dt>Google Places Autocomplete</dt>
                    <dd>
                        <a href="https://subschema.github.io/subschema-g-suggest">demo</a> | <a href="https://github.com/subschema/subschema-g-suggest">repo</a>
                    </dd>
                    <dt>Project Generator</dt>
                    <dd>
                        <a href="https://subschema.github.io/subschema-project/">demo</a> | <a href="https://github.com/subschema/subschema-g-suggest">repo</a>
                    </dd>

                </dl>

                <p><a className="btn btn-primary btn-lg" href="https://github.com/subschema" role="button">Learn
                    more</a></p>
                <hr/>
                <p>Or you can create a brand new project</p>
                <NewProject/>

            </div>
        );
    };

}