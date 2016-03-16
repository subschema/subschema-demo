"use strict";
var ctx = require.context('.', false, /(?!(.*(index|-setup)\.jsx?$)).*\.jsx?$/);
var mtx = require.context('.', false, /\.md$/);

var api = ctx.keys().reduce(function (obj, key) {
    if (/(index|-setup)/.test(key)) {
        return obj;
    }
    obj[key.replace(/\.jsx?$/, '').replace(/.*\//, '')] = ctx(key).default;
    return obj;
}, {});

mtx.keys().reduce(function (obj, key) {

    obj[key.replace(/\.md?$/, '').replace(/.*\//, '')] = mtx(key);

    return obj;
}, api);

module.exports = api;

