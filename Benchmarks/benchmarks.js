process.env.NODE_ENV = 'production';

var templates = require('./Bem/desktop.bundles/default/default.bemhtml'),
    bemjson = require('./test.bemjson.json'),
    i, result;



//console.log(templates.BEMHTML.apply(bemjson));

console.time('someFunction');

for (i = 0; i < 1000; i++) {
    templates.BEMHTML.apply(bemjson);
}
console.timeEnd('someFunction');

