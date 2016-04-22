# bemtest-net
эксперименты по скрещиванию БЭМ и .NET

## Шаблонизация bemhtml.js на C&#35;

В проекте [лежит bemxjst](ConsoleApplication/bemhtml.js), в [отдельном файле](ConsoleApplication/templates.bemhtml.js) лежат шаблоны.

Есть [.NET обертка](ConsoleApplication/Bemhtml.cs) над bemhtml. Внутри генерируется скрипт: в начало вставляется код шаблонизатора из первого файла и генерируется вызов `compile` для шаблонов.

Есть небольшая [тестовая программа](ConsoleApplication/Program.cs), которая создает экземпляр шаблонизатора, дает ему bemjson, получает html и выводит его в консоль.
