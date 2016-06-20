var enbBemTechs = require('enb-bem-techs'),
    techs = {
        fileProvider: require('enb/techs/file-provider'),
        bemhtml: require('enb-bemxjst/techs/bemhtml')
    },
    levels = [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/desktop.blocks', check: false },
        { path: 'libs/bem-components/common.blocks', check: false },
        { path: 'libs/bem-components/desktop.blocks', check: false },
        { path: 'libs/bem-components/design/common.blocks', check: false },
        { path: 'libs/bem-components/design/desktop.blocks', check: false },
        'desktop.blocks'
    ];


module.exports = function(config) {

    config.nodes('*.bundles/*', function(nodeConfig) {
        nodeConfig.addTechs([
            [techs.fileProvider, { target: '?.bemdecl.js' }],
            [enbBemTechs.levels, { levels: levels }],
            [enbBemTechs.files],
            [enbBemTechs.deps],

            [techs.bemhtml, { sourceSuffixes: ['bemhtml', 'bemhtml.js'] }]
             
        ]);

        nodeConfig.addTargets([/* '?.bemtree.js',  '?.html', '?.min.css', '?.min.js'*/ '?.bemhtml.js']);
    });
};