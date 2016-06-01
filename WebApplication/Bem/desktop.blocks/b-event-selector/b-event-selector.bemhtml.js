block('b-event-selector')(
    content()(function () {
        return [
            {
                elem: 'description',
                content: '... and this block was rendered by BEM'
            },
            {
                elem: 'field',
                label: 'Хочу',
                options: this.ctx.data.Event
            },
            {
                elem: 'field',
                label: 'на тему',
                options: this.ctx.data.Subjects
            }
        ];
    })
);

block('b-event-selector').elem('field').content()(function () {
    return [
        {
            elem: 'label',
            content: this.ctx.label
        },
        {
            elem: 'control',
            content: {
                block: 'select',
                mods: { mode: 'radio', theme: 'islands', size: 'm' },
                name: 'select2',
                val: 2,
                options: this.ctx.options.map(function (text, index) {
                    return { val: index, text: text };
                })
            }
        }
    ];
})