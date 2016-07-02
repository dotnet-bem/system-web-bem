'use strict';
var bemxjst = require('bem-xjst'),
    fs = require('fs');

console.log(Object.keys(bemxjst));
debugger;
var bundle = bemxjst.bemhtml.generate(function () {

    block('group')(
        tag()('ol'),
        attrs()(function() {
            return { title: this.ctx.title };
        })
    );

    block('item')(
        tag()('li'),
        content()(function() {
            return [
                {
                    elem: 'label',
                    content: 'text:'
                },
                {
                    elem: 'text',
                    content: this.ctx.text
                }
            ];
        }),

        elem('label').tag()('strong'),

        elem('text').tag()('span')
    );
});

fs.writeFileSync('template.js', bundle);