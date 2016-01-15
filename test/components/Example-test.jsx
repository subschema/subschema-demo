"use strict";
import React from 'react';
import samples from 'subschema-test-support/samples';
import {into} from 'subschema-test-support';
import {ValueManager} from "Subschema";
import Example from '../../public/components/Example';


describe('components/Example', function(){
    it('should render', function(){
        into(<Example example="Basic"/>,  true);
    })

});