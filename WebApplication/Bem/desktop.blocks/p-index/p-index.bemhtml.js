block('p-index')(
    tag()('html'),
    content()(function () {
        return [
            { elem: 'head' },
            {
                elem: 'body',
                content: [
                    { block: 'b-header' },
                    { block: 'b-content' }
                ]
            }
        ];
    })
);

block('p-index').elem('head').tag()('head');
block('p-index').elem('body').tag()('body');