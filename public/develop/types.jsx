"use strict";
import React, {Component} from 'react';
import Subschema, {PropTypes, loaderFactory, resolvers, DefaultLoader} from 'Subschema';
import map from 'lodash/collection/map';
var loader = loaderFactory([DefaultLoader]);
var {propTypesToNames} = PropTypes;
var allPropTypes = {
    name: 'All Types',
    type: {
        propTypes: resolvers.type.defaultPropTypes
    }
}
export default class DevelopTypes extends Component {
    static contextTypes = {
        loader: PropTypes.loader
    };

    renderPropType(key, i, def) {
        return <tr key={`type-${i}`}>
            <td>{i}</td>
            <td>{key}</td>
            <td>{def ? '' + def : ''}</td>
        </tr>
    }

    renderPropTypes(type) {
        const defaultProps = type.defaultProps || {};
        return <table className="table">
            <thead>
            <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Default</th>
            </tr>
            </thead>
            <tbody>
            {map(propTypesToNames(type.propTypes), (p, n, type)=> this.renderPropType(p, n, defaultProps[p]), this)}
            </tbody>
        </table>
    }

    renderTypeDoc(type, key) {
        return <div className="" key={`type-doc-${key}`}>
            <h4>{type.name}</h4>
            <div>
                <h5>Props</h5>
                {this.renderPropTypes(type.type, this)}
            </div>
        </div>
    }

    render() {

        return <div>
            <h3>Type Documentation</h3>

            {this.renderTypeDoc(allPropTypes, 'All')}
            {loader.listTypes().map(this.renderTypeDoc, this)}
        </div>
    }
}