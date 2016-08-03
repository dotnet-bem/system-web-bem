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

1. Return the instance of the `BemhtmlResult` class from controller's method. Send the essential bemjson to constructor of `BemhtmlResult`.
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

Blocks should be assembled into the bundles for usage in running application. Bundles formation is performed on the base of *bundle declaration*. It is a special file that contains the list of blocks which should be in the bundle. Bundle declaration example:

```javascript
exports.blocks = [
  { name: 'block1' },
  { name: 'block2' }
];
```

Declarations should be located in the `/Bem/desktop.bundles` folder, each bundle is in its own folder. The declaration file name should match the name of the bundle and it should have the `bemdecl.js` extension. For example, the declaration of the `default` bundle should be located in the file `/Bem/desktop.bundles/default/default.bemdecl.js`.

Assembling is performed by special tool [enb](https://ru.bem.info/toolbox/enb), which is added to the project during the System.Web.Bem package installation from NuGet. Also during the package installation the project settings is changed: the automatical enb execution after the MsBuild execution is added. Thus, when you run the build of your ASP.NET MVC project in Visual Studio the assembling of BEM-bundles will be performed automatically after the c# code compilation. During the project assembling will be found all the declarations in the `/Bem/desktop.bundles` folder and for each of them will be assembled all the technologies bundles (templates, styles, java script).

Bundles of technologies should be named `<bundle_name>.<tech_ext>` and should be saved in the folder where the declaration is located. For example, the templates file (bem html.js) for the `default` bundle should have a path `/Bem/desktop.bundles/default/default.bemhtml.js`. Thus, after the build of the project you will see something like this:

```
<Project root>
├─ Bem
│  ├─ ...
│  └─ desktop.bundles
│     ├─ default 
│     │  ├─ default.bemdecl.js  // bundle declaration
│     │  ├─ default.bemhtml.js  // templates bundle 
│     │  ├─ default.js          // client-side code bundle 
│     │  └─ default.css         // styles bundle 
│     │  └─ ...                 // bundles of other technologies
│     └─ ...
└─ ...
```

During the application is running the bundle of templates is used for html generation (on the server and the client side), js bundles and style bundles are included in the pages and used on client side. During the server-side html generation will be used the templates bundle which is selected by application settings. Client-side bundles (js and css) should be included to the page manually.

### Server side BEMHTML templates

[BEMHTML](https://github.com/bem/bem-xjst) is the special templates engine which is convenient for BEM-projects.

During the installation of [System.Web.Bem package](https://www.nuget.org/packages/System.Web.Bem) NuGet package into the project the reference for .NET library named System.Web.Bem will be added (this library allows to use BEMHTML templates on the server side). To generate a html-page using BEMHTML on the server-side you should just return the instance of the `BemhtmlResult` class from the controller's method. Send the essential *bemjson* to constructor of the `BemhtmlResult`.

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

If you need to render BEM-block inside the Razor template you should use the `@Html.Bem` helper (and provide the essential bemjson for it).
```cs
@Html.Bem(new { block = "my-block", data = Model })
```

In the section named `bemSettings` of Web.config file you may setup how to selected the template-bundles for each http-request. 3 variants of request-to-bundle mapping are possible:

1. The single bundle per application - it's name can be set by `DefaultBundle` parameter (`default` by default):

  ```xml
  <bemSettings Mapper="Single" DefaultBundle="index" />
  ```
1. Separate bundle for each server-side controller:

  ```xml
  <bemSettings Mapper="ByController" />
  ```
  The bundle name is formed by controller name: all words are separated by dashes, all letters changed to lower case, the "controller" suffix is deleted and `p-` prefix is added (for example, `MainPageController` → `p-main-page`).
1. The custom mapper - you can write your own mapper class and set it's name in `Mapper` parameter:

  ```xml
  <bemSettings Mapper="MyApplication.MyNamespace.InnerNamespace.MyMapperClass" />
  ```
Your mapper class must be inherited from the base class named [System.Web.Bem.BundleMappers.Mapper](System.Web.Bem/BundleMappers/Mapper.cs) and it must implement the `abstract string GetBundleName(ControllerContext context)` method, which receives a request context as an input parameter and returns the bundle name for this request. Also you can redefine the `virtual string GetBundlePath(string bundleName)` method, which returns the bemhtml-bundle full path by the bundle name (by default the path `<RootDir>\<bundleName>\<bundleName>.bemhtml.js` is formed).

Also you can setup the default root directory of BEM-bundles (by default is `~/Bem/desktop.bundles`):

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
