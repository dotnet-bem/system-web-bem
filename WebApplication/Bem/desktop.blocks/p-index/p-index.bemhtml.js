block('p-index')(
    tag()('html'),
    js()(true),
    content()(function () {
        return [
        {
            elem: 'head',
            content: [
                { elem: 'css', url: '/Bem/desktop.bundles/default/default.css' }
            ]
        },
        {
            elem: 'body',
            content: [
                { block: 'b-header' },
                { block: 'b-content' },
                {
                    elem: 'test-button',
                    content: {
                        block: 'button',
                        mods: { theme: 'islands', size: 'm', type: 'link' },
                        url: 'https://bem.info',
                        text: 'Попробуй БЭМ'
                    }
                },
                {
                    elem: 'test-button',
                    content: {
                        block: 'input',
                        mods: { theme: 'islands', size: 'm' },
                        placeholder: 'Введите имя'
                    }
                },
                { elem: 'js', url: '/Bem/desktop.bundles/default/default.js' }
            ]
        }
        ];
    })
);

block('p-index').elem('head').tag()('head');
block('p-index').elem('js')(
    tag()('script'),
    attrs()(function () {
        return {
            src: this.ctx.url
        };
    })
);

block('p-index').elem('css')(
    tag()('link'),
    attrs()(function () {
        return {
            rel: 'stylesheet',
            href: this.ctx.url
        };
    })
);

block('p-index').elem('body').tag()('body');