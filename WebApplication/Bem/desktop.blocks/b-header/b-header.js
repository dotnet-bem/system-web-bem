modules.define('b-header', ['BEMHTML', 'i-bem__dom'], function (provide, BEMHTML, BEMDOM) {

    provide(BEMDOM.decl({ block: this.name }, {
        onSetMod: {
            'js': {
                'inited': function () {

                    var html = BEMHTML.apply({
                        block: 'b-event-selector',
                        data: {
                            Event: ['ми ми ми', 'му му', 'хру'],
                            Subjects: ['subject1', 'subject2', 'subject3', 'subject4']
                        }
                    });

                    BEMDOM.append(this.domElem, html);
                }
            }
        }
    }));

});
