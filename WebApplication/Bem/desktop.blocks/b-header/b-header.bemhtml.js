block('b-header')(
    js()(true),
    
    content()(function() {
        return [
            { elem: 'logo', content: '.NET BEM Application' },
            { elem: 'description', content: 'This page was rendered by BEMHTML engine on ASP.NET MVC' }
        ];
    })
);