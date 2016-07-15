# System.Web.Bem

System.Web.Bem - is a BEM (Block-Element-Modifier) infrastructure for ASP.NET MVC projects.

- [Get Started](#Get-Started)
- [Details](#Details)
    - [Specificity of BEM projects](#Specificity-of-bem-projects)
    - [Structure of project files](#Structure-of-project-files)
    - [Build the bundles](#Build-the-bundles)
    - [Server side BEMHTML templates](#Server-side-bemhtml-templates)
    - [External block libraries usage](#External-block-libraries-usage)
- [Articles](#Articles)

## Get Started

1. Убедитесь, что на компьютере, где будет *выполняться сборка* проекта, установлен [node.js](https://nodejs.org/en/) (при этом для *работы приложения* устанавливать node.js не обязательно).

1. Установите [пакет System.Web.Bem](https://www.nuget.org/packages/System.Web.Bem/) в свой проект ASP.NET MVC.
  ```bash
  PM> Install-Package System.Web.Bem -Pre
  ```

1. Верните из метода контроллера экземпляр класса `BemhtmlResult`, передав ему в конструктор нужный bemjson.
  ```cs
  using System.Web.Bem;
  ...
  public class DefaultController : Controller
  {
    public ActionResult Index()
    {
      return new BemhtmlResult(new { block = "p-index" });
    }
  }
  ```

## Details

### Specificity of BEM projects
[БЭМ](https://bem.info) (Блок-Элемент-Модификатор) - это придуманная в [Яндексе](https://yandex.ru) методология разработки веб-приложений, в основе которой лежит компонентный подход. БЭМ - это также набор инструментов для удобной разработки в соответствии с принципами методологии. БЭМ помогает быстрее разрабатывать сайты и поддерживать их долгое время.

Согласно правилам БЭМ, приложение состоит из независимых блоков, которые лежат в отдельных папках. Каждый блок реализован в нескольких технологиях (шаблоны, стили, клиентский код). Чтобы код блоков мог работать в приложении, блоки собирают в бандлы.

Декларация бандла - файл с перечислением блоков, которые должны попасть в бандл. На основе декларации сборщик собирает бандл, учитывая зависимости блоков и уровни переопределения. Бандл собирается отдельно для каждой технологии. Во время работы приложения бандл шаблонов используется для формирования html (на сервере и клиенте), бандлы js и css подключаются на страницы и используются на клиенте.

**System.Web.Bem** - БЭМ-инфрастурктура для ASP.NET MVC проектов. При установке в проект [NuGet пакета System.Web.Bem](https://www.nuget.org/packages/System.Web.Bem/):
- добавляется папка `Bem` с файловой структурой БЭМ проекта;
- из npm ставится сборщик БЭМ-проектов [enb](https://ru.bem.info/toolbox/enb/) и настройки для сборки БЭМ-бандлов при компиляции ASP.NET MVC проекта;
- подключается C# библиотека `System.Web.Bem` для серверной шаблонизации во время работы приложения.

### Structure of project files

```
<Project root>                  // корневая папка проекта
├─ Bem                          // папка БЭМ-проекта
│  ├─ .enb
│  │  └─ make.js                // конфиг сборщика enb
│  ├─ desktop.blocks            // уровень переопределения, внутри находятся блоки
│  │  ├─ block-1 
│  │  ├─ block-2 
│  │  │  ... 
│  │  └─ block-n 
│  │     ├─ block-n.bemhtml.js  // реализация блока block-n в технологии bemhtml.js (шаблоны)
│  │     ├─ block-n.css         // реализация блока block-n в технологии css 
│  │     │  ...                 // ...
│  │     └─ block-n.js
│  ├─ desktop.bundles           // папка с бандлами проекта
│  │  ├─ bundle-1 
│  │  ├─ bundle-2 
│  │  │  ... 
│  │  └─ bundle-n 
│  │     └─ bundle-n.bemdecl.js // декларация бандла bundle-n 
│  └─ levels.js                 // список уровней переопределения
│  ...
├─ Controllers                  // Controllers, Models, Views - стандартные папки ASP.NET MVC
├─ Models
├─ Views
│  ...
├─ package.json                 // конфиг npm
└─ Web.config                   // конфиг вашего приложения
```

### Build the bundles
**Внимание! Для сборки проекта необходимо, чтобы на компьютере был установлен [node.js](https://nodejs.org/en/). Для работы приложения на сервере устанавливать node.js нет необохдимости.**

Чтобы код блоков мог работать в приложении, блоки собирают в бандлы. Сборка бандла выполняется на основе декларации - специального файла с расширением `bemdecl.js`, где перечислены блоки, которые должны попасть в бандл. Пример декларации бандла:

```javascript
exports.blocks = [
  { name: 'block1' },
  { name: 'block2' }
];
```
Декларации находятся в папке `/Bem/desktop.bundles`, каждый бандл в своей папке. Например, декларация бандла `default` должна находиться в файле `/Bem/desktop.bundles/default/default.bemdecl.js`. 

Сборка выполняется специальной утилитой [enb](https://ru.bem.info/toolbox/enb/), которая добавляется в проект при установке NuGet пакета System.Web.Bem. Во время установки пакета настраивается автоматический запуск enb при сборке всего проекта через MsBuild. Таким образом, когда вы собираете ASP.NET MVC проект в Visual Studio, вместе с компиляцией c# кода будет запущена и сборка БЭМ-бандлов. Во время сборки ищутся все декларации внутри `/Bem/desktop.bundles` и для каждой из них собираются бандлы технологий (шаблоны, js, css). 

Бандлы технологий имеют имя `<bundle_name>.<tech_ext>` и сохраняются в папку, где находится декларация. Например, файл шаблонов (bemhtml.js) для бандла `default` будет иметь путь `/Bem/desktop.bundles/default/default.bemhtml.js`. Таким образом, после сбоки проекта вы будете наблюдать примерно такую картину:
```
<Project root>
├─ Bem
│  ├─ ...
│  └─ desktop.bundles
│     ├─ default 
│     │  ├─ default.bemdecl.js  // декларация бандла
│     │  ├─ default.bemhtml.js  // бандл с шаблонами 
│     │  ├─ default.js          // бандл с клиентским кодом 
│     │  └─ default.css         // бандл со стилями 
│     │  └─ ...                 // бандлы других технологий
│     └─ ...
└─ ...
```
Во время работы приложения бандл шаблонов используется для формирования html (на сервере и клиенте), бандлы js и css подключаются на страницы и используются на клиенте. Во время серверной шаблонизации будет использоваться бандл с шаблонами, указанный в настройках приложения. Бандлы js и css нужно самостоятельно подключить на страницу.

### Server side BEMHTML templates

[BEMHTML](https://github.com/bem/bem-xjst) - специальный шаблонизатор, который удобно использовать в БЭМ-проектах.

При установке NuGet пакета System.Web.Bem в проект будет добавлена .NET библиотека для шаблонизации BEMHTML шаблонов на стороне сервера во время работы приложения. Чтобы передать на клиент страницу, сформированную с помощью bemhtml шаблонов, просто верните из контроллера экземпляр класса `BemhtmlResult`, передав ему в конструктор нужный bemjson.

```cs
using System.Web.Bem;
...
public class DefaultController : Controller
{
  public ActionResult Index()
  {
    return new BemhtmlResult(new { block = "p-index" });
  }
}
```

Если нужно внутри Razor-шаблона вставить БЭМ-блок, используйте хелпер `@Html.Bem`, передав ему нужный bemjson.
```cs
@Html.Bem(new { block = "my-block", data = Model })
```

В разделе `bemSettings` файла Web.config вы можете настраивать, каким способом будут выбираться бандлы с bemhtml шаблонами для http-запросов. Возможны 3 варианта мэппинга запросов на бандлы:

1. Один общий бандл на всё приложение - его название можно задать в параметре `DefaultBundle` (по умолчанию `default`):

  ```xml
  <bemSettings Mapper="Single" DefaultBundle="index" />
  ```
1. Отдельный бандл для каждого серверного контроллера:

  ```xml
  <bemSettings Mapper="ByController" />
  ```
  Название бандла определяется по названию контроллера: слова разделяются дефисами, приводятся к нижнему регистру, удаляется суффикс "controller" и добавляется префикс `p-` (например, `MainPageController` → `p-main-page`).
1. Собственный мэппер - есть возможность написать свой класс мэппера и указать его название в параметре `Mapper`:

  ```xml
  <bemSettings Mapper="MyApplication.MyNamespace.InnerNamespace.MyMapperClass" />
  ```
Класс мэппера должен быть унаследован от базового класса [System.Web.Bem.BundleMappers.Mapper](System.Web.Bem/BundleMappers/Mapper.cs) и реализовывать метод `abstract string GetBundleName(ControllerContext context)`, получающий на вход контекст запроса и возвращающий название бандла. Также, при желании, можно переопределить метод `virtual string GetBundlePath(string bundleName)`, возвращающий по названию бандла путь к файлу с bemhtml шаблонами (по умолчанию формируется путь `<RootDir>\<bundleName>\<bundleName>.bemhtml.js`)

Также в настройках можно задать корневую папку для БЭМ-бандлов проекта (по умолчанию, `~/Bem/desktop.bundles`):

```
<bemSettings RootDir="~/public" />
```

### External block libraries usage

Вы можете подключать в свой проект сторонние библиотеки с блоками и использовать их. Для этого скопируйте файлы блоков в свой проект и добавьте новые папки с блоками в список уровней переопределения.

Рекомендуется размещать сторонние библиотеки блоков в папке `/Bem/libs`. Например:
```
└─ Bem
   └─ libs                        // сторонние библиотеки блоков
      ├─ my-ext-block-library     // папка библиотеки
      │  ├─ common.blocks         // уровень переопределения
      │  │   ├─ block1
      │  │   └─ block2
      │  ├─ desktop.blocks        // уровень переопределения
      │  └─ ...                 
      │  ...
      └─ other-ext-block-library  // папка библиотеки
```

Список уровней переопределения находится в файле `/Bem/levels.js`. 

```
├─ Bem
│  ├─ desktop.blocks
│  ├─ desktop.bundles
│  ├─ libs                        // сторонние библиотеки блоков
│  └─ levels.js                   // список уровней переопределения
└─ ...
```

По сути это список папок, из которых будут браться файлы блоков при сборке. Необходимо добавить в него папки уровней переопределения скопированных вами внешних библиотек. Для приведенного выше примера структуры файловой системы должно получиться примерно так:

```javascript
module.exports = [
  { path: 'libs/my-ext-block-library/common.blocks', check: false },
  { path: 'libs/my-ext-block-library/desktop.blocks', check: false },
  { path: 'libs/other-ext-block-library/common.blocks', check: false },
  ...
  'desktop.blocks'
];
```

Для удобства подключения в NuGet были выложены библиотеки [bem-core](https://github.com/bem/bem-core/blob/v3/README.ru.md) и [bem-components](https://github.com/bem/bem-components/blob/v3/README.ru.md). Чтобы добавить их в свой проект установите NuGet пакеты [bem-core](https://www.nuget.org/packages/bem-core/), [bem-components](https://www.nuget.org/packages/bem-components/):
```
Install-Package bem-core
Install-Package bem-components
```
Уровни переопределения библиотек bem-core и bem-components [уже перечислены](https://github.com/dotnet-bem/system-web-bem/blob/master/System.Web.Bem/package/content/Bem/levels.js#L2-L10) в файле `levels.js`, но по умолчанию закомментированы. Раскомментриуйте их.

## Articles
- [Скрещиваем БЭМ и .NET](https://ru.bem.info/forum/1007/)
- [Продолжаем скрещивать БЭМ и .NET](https://ru.bem.info/forum/1048/)
- [Хакатон: БЭМ-инфраструктура для .NET](https://ru.bem.info/forum/1065/)
