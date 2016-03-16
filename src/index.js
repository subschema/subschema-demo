"use strict";
import React from 'React';
import {loaderFactory} from 'Subschema';
import Navigate from './components/Navigate.jsx';
import NavTemplate from './components/NavTemplate.jsx';
import ULTemplate from './components/ULTemplate.jsx';
import Link from './components/Link.jsx';
import LiLink from './components/LiLink.jsx';
import Main from './components/Main.jsx';
import Example from './components/Example.jsx';
import sample from './sample.lessp';
import NotFound from './components/NotFound.jsx';

const loader = loaderFactory();

loader.addType({
    NotFound,
    Navigate,
    Link,
    Main,
    Example,
    LiLink
});
loader.addTemplate({
    NavTemplate,
    ULTemplate,
    H3(props){
        return <h3>{props.legend || props.children}</h3>
    }
});

export default loader;