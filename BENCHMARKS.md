Тестирование производительности.
================================

  В ходе обсуждения какие замеры хочется посмотреть мы для себя выделили 3 основных момента - родной шаблонизтор .net, bemhtml внутри своей экосистемы(node.js) и наш пакет.
Для тестирования мы подготовили один набор синтетических данных, в которые входят несложные шаблоны. 

### Подготовка данных
Для синтетических тестов мы сгенерировали рутовый блок с тремя уровнями вложенности.
```
root->group1..100->item1..3
``` 
[Схема](https://github.com/dima117/bemtest-net/blob/master/docs/data.json.md) и [полные дынные](https://github.com/dima117/bemtest-net/blob/master/Benchmarks/test.bemjson.json)

### Шаблоны
Ссылка на полный [шаблон](https://github.com/dima117/bemtest-net/blob/master/Benchmarks/Bem/desktop.bundles/default/default.bemhtml.js), нам там пришлось немного изменить экспорт для работы в синтетических условиях.
Ссылка на [Razor](https://github.com/dima117/bemtest-net/blob/master/Benchmarks/Razor/test.cshtml) шаблон
```javascript
block('root').content()(function() {
  return this.ctx.items;
});

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
```

### Код тестов
```javascript
var templates = require('./Bem/desktop.bundles/default/default.bemhtml'),
    bemjson = require('./test.bemjson.json'),
    i, result;

console.time('someFunction');

for (i = 0; i < 1000; i++) {
    templates.BEMHTML.apply(bemjson);
}

console.timeEnd('someFunction');
```
Вот [тут](https://github.com/dima117/bemtest-net/blob/master/Benchmarks/Program.cs#L23) лежат такие же тесты на .NET.

### Процесс замеров
И так получив базовый набор данных в виде 100 блоков мы начали гонять их шаблонизацию по 1000 раз в разных средах. Получив первые данные было решено поменять значения и генерировать 100 раз по 1000 блоков, при этом замеры замедлились но во всех плоскостях линейно, в связи с чем было решено оставить один набор данных, так как в остальных время изменялось строго линейно.
Разница между шаблонизаторами была даовольно большой и первое что нам казалось значительно замедляет шаблонизацию в .NET это сериализация, в связи с чем было решено добавить тест кейс без [сериализации](https://github.com/dima117/bemtest-net/blob/master/Benchmarks/Bem/desktop.bundles/default2/default2.bemhtml.js).

### Замеры
