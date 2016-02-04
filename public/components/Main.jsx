import React, {Component} from 'react';
import Subschema, {PropTypes} from 'Subschema';
import Index from '../Index.jsx';
import Example from './Example.jsx';
export default class Main extends Component {

    static contextTypes = {
        loader: PropTypes.loader.isRequired
    };

    static propTypes = {
        useData: PropTypes.listener,
        useError: PropTypes.listener,
        onChange: PropTypes.valueEvent,
        notFound: PropTypes.type
    };

    static defaultProps = {
        useData: "useData",
        useError: "useError",
        notFound: "NotFound"
    };

    render() {
        if (this.props.value == null) {
            return null;
        }

        var {component, ...rest} = this.props.value;
        if (component == null) return null;
        var Component = this.context.loader.loadType(component);
        if (Component == null) {
            Component = this.props.notFound;
        }
        return <Component {...this.props} {...rest}/>

    }
}