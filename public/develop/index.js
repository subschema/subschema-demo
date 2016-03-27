"use strict";
var ctx = require.context('.', false, /(?!(.*(index|-setup)\.jsx?$)).*\.jsx?$/);

var api = ctx.keys().reduce(function (obj, key) {
    if (/(index|-setup)/.test(key)) {
        return obj;
    }
    obj[key.replace(/\.jsx?$/, '').replace(/.*\//, '')] = ctx(key).default;
    return obj;
}, {});

module.exports = api;

