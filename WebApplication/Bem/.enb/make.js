var enbBemTechs = require('enb-bem-techs'),
    techs = {
        fileProvider: require('enb/techs/file-provider'),
        fileCopy: require('enb/techs/file-copy'),
        stylus: require('enb-stylus/techs/stylus'),
        browserJs: require('enb-js/techs/browser-js'),
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

             // css
            [techs.stylus, {
                target: '?.css',
                sourcemap: false,
                autoprefixer: {
                    browsers: ['ie >= 10', 'last 2 versions', 'opera 12.1', '> 2%']
                }
            }],

            // bemhtml
            [techs.bemhtml, { sourceSuffixes: ['bemhtml', 'bemhtml.js'] }],

            // js
            [techs.browserJs, { includeYM: true }],
            [techs.fileCopy, { sourceTarget: '?.browser.js', destTarget: '?.js' }]
             
        ]);

        nodeConfig.addTargets([/* '?.bemtree.js',  '?.html', '?.min.js'*/ '?.bemhtml.js', '?.css', '?.js']);
    });
};