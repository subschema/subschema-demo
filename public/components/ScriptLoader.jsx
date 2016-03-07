"use strict";

import React, {Component, Children, cloneElement} from 'react';

import scriptjs from 'scriptjs';

export default class ScriptLoader extends Component {

    static defaultProps = {
        scripts: {}
    };
    state = {
        error: false,
        loading: true,
        resolved: {}
    };

    componentDidMount() {
        const {scripts} = this.props;
        Promise.all(Object.keys(scripts).map(function (key) {
            return new Promise((resolve, reject)=> {
                const {...resolved} = this.state.resolved;
                scriptjs(scripts[key], (val)=> {
                    resolved[key] = val || true;
                    this.setState({resolved});
                    resolve();
                });
            });
        })).then(()=>this.setState({loading: false}));
    }

    renderLoading() {
        return <span
            className="loading">{`Loading ${Object.keys(this.state.resolved).length} of ${Object.keys(this.scripts).length}`}</span>
    }

    render() {
        return this.state.loading === true ? this.renderLoading() : Children.map(this.props.children, (child)=>cloneElment(child, this.state.resolved));
    }
}
