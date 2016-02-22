import React from 'react';
import { render } from 'react-dom';
import develop from './develop';
import samples from 'subschema-test-support/samples';
import Subschema, {ValueManager, Form, decorators, loaderFactory, DefaultLoader}  from 'Subschema';
import schema from './schema.json';
import Navigate from './components/Navigate.jsx';
import NavTemplate from './components/NavTemplate.jsx';
import ULTemplate from './components/ULTemplate.jsx';
import Link from './components/Link.jsx';
import Main from './components/Main.jsx';
import Example from './components/Example.jsx';
import Index from './Index.jsx';
import sample from './sample.less';
import history from './location';
import NotFound from './components/NotFound.jsx';
var loader = loaderFactory([DefaultLoader]);

loader.addType({
    NotFound,
    Navigate,
    Link,
    Main,
    Index,
    Example
});
loader.addTemplate({
    NavTemplate,
    ULTemplate,
    H3(props){
        return <h3>{props.legend || props.children}</h3>
    }
});

loader.addType(Object.keys(develop).reduce(function (obj, key) {
    obj['develop/' + key] = develop[key];
    return obj;
}, {}));


var valueManager = ValueManager({
    samples: Object.keys(samples),
    develop: Object.keys(develop)
});

var loc;

// Listen for changes to the current location. The
// listener is called once immediately.

let unlisten = history.listen(location => {
    console.log('loc', location);
    const pathname = location.pathname;
    valueManager.update('pathname', pathname);
    valueManager.update('useData', location.query.useData == "true");
    valueManager.update('useError', location.query.useError == "true");

    loc = location;

});
valueManager.addListener('pathname', function(vv){
    console.log('pathname', vv)
});
/*
valueManager.addListener('pathname', function (pathname) {
    var type = pathname.replace(/\#?\//, '')
    if (/develop/.test(pathname)) {
        valueManager.update('main', {component: type});
    } else if (type) {
        valueManager.update('main', {component: 'Example', example: type, conf: samples[type]});
    } else {
        valueManager.update('main', {component: 'Index', conf: null});
    }

});*/
//Handle change of state to showing data or error.
function handleDataError(val, old, path) {
    //make sure the poll cycle exists first;
    setTimeout(()=> {
        if (loc == null || val == null) {
            return;
        }
        if (val) {
            if (loc.query[path] === 'true') return;
            loc.query[path] = 'true';
            var {pathname, query, state } = loc;
            history.push({pathname, query, state});
        } else {
            if (loc.query[path] === 'true') {
                delete loc.query[path];
                var {pathname, query, state } = loc;
                history.push({pathname, query, state});
            }
        }
    }, 20);

}
valueManager.addListener('useData', handleDataError, null, false);
valueManager.addListener('useError', handleDataError, null, false);


render(<Form valueManager={valueManager} schema={schema} loader={loader}
             template="FieldSetTemplate"/>, document.getElementById('content'));