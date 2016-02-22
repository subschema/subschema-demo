import React, {Component} from 'react';
import Subschema, {PropTypes,Editor} from 'Subschema';

class NavigateItem extends Component {

    static propTypes = {
        href: PropTypes.expression,
        label: PropTypes.expression,
        path: PropTypes.path,
        onClick:PropTypes.valueEvent
    };
    static defaultProps = {
        pathname: ".",
        onClick:'pathname'
    };
    clzName = (name = '')=> {
        return 'list-group-item ' + ('/' + name.replace(/^#+?\//, '') === this.props.pathname ? 'active' : '');
    };
    handleClick = (e)=>{
        this.props.onClick(this.props.href);
    };
    render() {
        const {href, label, ...props} = this.props;
        return <a href={href} onClick={this.handleClick} className={this.clzName(href)}>{label}</a>
    }

}
export default class Navigate extends Component {

    static propTypes = {
        path: PropTypes.path,
        pathname: PropTypes.listener,
        Item: PropTypes.injectClass
    };

    static defaultProps = {
        pathname: "pathname",
        Item: NavigateItem,
        href: '#/{.}',
        label: '{.}'
    };


    renderItems() {
        const {Item, value, path,href, label, pathname} = this.props;

        return value.map((v, i)=><Item key={`nav-item-${i}`} pathname={pathname} href={href} label={label} path={`${path}.${i}`}/>);
    }

    render() {
        return <div className="list-group left-nav">
            {this.renderItems()}
        </div>
    }
}
