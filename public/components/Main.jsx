import React, {Component} from 'react';
import Subschema, {PropTypes} from 'Subschema';
import Index from '../Index.jsx';
import Example from './Example.jsx';
import samples from 'subschema-test-support/samples';

export default class Main extends Component {

    static contextTypes = {
        loader: PropTypes.loader.isRequired
    };

    static propTypes = {
        useData: PropTypes.listener,
        useError: PropTypes.listener,
        notFound: PropTypes.type,
        value:PropTypes.value
    };

    static defaultProps = {
        useData: "useData",
        useError: "useError",
        notFound: "NotFound",
        value:"pathname"

        };

    render() {
        if (this.props.value == null) {
            return null;
        }
        const pathname = this.props.value;
        console.log('pathname', pathname);
        const type = pathname.replace(/\#?\//, '')

        let value;
        if (/develop/.test(pathname)) {
            value = {component: type};
        } else if (type) {
            value = {component: 'Example', example: type, conf: samples[type]};
        } else {
            value = {component: 'Index', conf: null};
        }

        var {component, ...rest} = value;
        if (component == null) return null;
        var Component = this.context.loader.loadType(component);
        if (Component == null) {
            Component = this.props.notFound;
        }

        return <Component {...this.props} {...rest}/>

    }
}