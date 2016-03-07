import React, {Component} from 'react';
import Subschema, {PropTypes} from 'Subschema';
import Index from '../Index.jsx';
import samples from '../samples';

export default class Main extends Component {

    static contextTypes = {
        loader: PropTypes.loader.isRequired,
        injector: PropTypes.injector
    };

    static propTypes = {
        useData: PropTypes.listener,
        useError: PropTypes.listener,
        notFound: PropTypes.type,
        value: PropTypes.value
    };

    static defaultProps = {
        useData: "useData",
        useError: "useError",
        notFound: "NotFound",
        value: "pathname"

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

        let {component, ...rest} = value;
        if (component == null) return null;
        let Component = this.context.loader.loadType(component);
        if (Component == null) {
            Component = this.props.notFound;
        }
        let IComponent = this.context.injector.inject(Component);
        return <IComponent {...this.props} {...rest}/>

    }
}