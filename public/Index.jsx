"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'Subschema';

import UninjectedNewProject from './components/NewProject.jsx';

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

                <p>Wherever it shows expand you can click to see the code that geneated the form, and you can edit
                    the code in place,seeing the result immediately.</p>

                <p>You can see how it works by loading errors and data, from the buttons up top</p>

                <p><a className="btn btn-primary btn-lg" href="https://github.com/subschema" role="button">Learn
                    more</a></p>
                <hr/>
                <p>Or you can create a brand new project</p>
                <NewProject/>

            </div>
        );
    };

}