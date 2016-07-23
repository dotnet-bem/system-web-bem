# System.Web.Bem

System.Web.Bem - is a BEM (Block-Element-Modifier) infrastructure for ASP.NET MVC projects.

- [Get Started](#get-started)
- [Details](#details)
    - [Specificity of BEM projects](#specificity-of-bem-projects)
    - [Structure of project files](#structure-of-project-files)
    - [Build the bundles](#build-the-bundles)
    - [Server side BEMHTML templates](#server-side-bemhtml-templates)
    - [External block libraries usage](#external-block-libraries-usage)
- [Articles](#articles)

## Get Started

1. Make sure that [node.js](https://nodejs.org/en/) is installed on the computer that will assemble of the project (node.js on the production server is not required).

1. Install the [System.Web.Bem package](https://www.nuget.org/packages/System.Web.Bem/) into your ASP.NET MVC project.
  ```bash
  PM> Install-Package System.Web.Bem -Pre
  ```

1. Return the instance of the `BemhtmlResult` class from controller's method. Send the essential bemjson to constructor of BemhtmlResult.
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
[BEM](https://en.bem.info) (Block-Element-Modifier) is the frontend development methodology, which was created in [Yandex](https://yandex.com/company). It is based on the component approach. BEM is also the set of tools for comfortable development according to principles of methodology. BEM hepls to develop the sites faster and support them for a long time.

According to the BEM principles, application consists from independent blocks, which located in separate folders. Each block is implemented in several technologies (templates, styles, client-side code). Blocks should be built into the bundles to use them in the running application.

Bundle declaration is a file with the list of blocks, which should be in a bundle. On the base of declaration assembler will build a bundles according to dependencies of blocks and levels of redifinition. Bundle is built separately for each technology. During the application is running the bundle of templates is used for html generation (on the server and the client side), js bundles and style bundles are included in the pages and used on client side.

**System.Web.Bem** is the BEM-infrastructure for ASP.NET MVC projects. During the installation of [System.Web.Bem package](https://www.nuget.org/packages/System.Web.Bem) into the project:
- folder `BEM` with the files structure is created;
- assembler of BEM-projects [enb](https://ru.bem.info/toolbox/enb) is installed from npm and proper configuration file for enb is created;
- reference for .NET library named System.Web.Bem is added (this library allows to use BEMHTML templates on the server side).

### Structure of project files

```
<Project root>
├─ Bem                          // BEM-files folder
│  ├─ .enb
│  │  └─ make.js                // enb configuration file
│  ├─ desktop.blocks            // redefinition level (blocks are located inside)
│  │  ├─ block-1 
│  │  ├─ block-2 
│  │  │  ... 
│  │  └─ block-n 
│  │     ├─ block-n.bemhtml.js  // implementation of 'block-n' in 'bemhtml.js' technology (templates)
│  │     ├─ block-n.css         // implementation of 'block-n' in 'css' technology
│  │     │  ...                 // ...
│  │     └─ block-n.js
│  ├─ desktop.bundles           // folder for the bundles
│  │  ├─ bundle-1 
│  │  ├─ bundle-2 
│  │  │  ... 
│  │  └─ bundle-n 
│  │     └─ bundle-n.bemdecl.js // declaration of the bundle named 'bundle-n'
│  └─ levels.js                 // list of redefinition levels
│  ...
├─ Controllers                  // Controllers, Models, Views - usual ASP.NET MVC folders
├─ Models
├─ Views
│  ...
├─ package.json                 // npm configuration file
└─ Web.config                   // configuration file of your application
```

### Build the bundles
**Attention! Node.js is requeired for project building. Node.js on the production server is not required.**

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
