block('example')(
    content()([
        {
            elem: 'title',
            content: 'This is an example block'
        },
        {
            elem: 'body',
            content: 'Lorem ipsum dolor sit amet, mea nisl antiopam id, explicari maiestatis has no.'
        }
    ]),

    elem('title').tag()('h1'),

    elem('body').tag()('p')
);