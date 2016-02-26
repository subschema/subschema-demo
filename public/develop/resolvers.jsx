"use strict";
import React, {Componet} from "react";
import {resolvers} from 'Subschema';
export default function Resolvers(props) {
    return (<div>
        <h3>Resolvers</h3>
        <p>These allow for properties to be transformed before being passed into the component. The work by creating
            a wrapper class that sets the property and calls forceUpdate on the component when a value changes.</p>
        <p>Below is a list of built in resolvers, documentation TBD.</p>
        <ul>
            {Object.keys(resolvers).map(r=><li key={`resolver-${r}`}>{r}</li>)}
        </ul>
    </div>);

}