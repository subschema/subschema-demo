import React, {Component} from 'react';

export default class NavTemplate extends Component {
    render() {
        return (<nav className="navbar navbar-default">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand" href="#">Subschema</a>
                </div>
                <div className="collapse navbar-collapse">
                    <ul className="nav navbar-nav navbar-right">
                        {this.props.children}
                    </ul>
                </div>
            </div>
        </nav>);
    }
}