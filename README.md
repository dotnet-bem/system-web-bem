# System.Web.Bem

System.Web.Bem is a BEM (Block-Element-Modifier) infrastructure for ASP.NET MVC projects.

- [Quick start](#quick-start)
- [Details](#details)
    - [Specifics of BEM projects](#specifics-of-bem-projects)
    - [Project structure](#project-structure)
    - [Building the bundles](#building-the-bundles)
    - [Server-side templating with BEMHTML](#server-side-templating-with-bemhtml)
    - [External block libraries usage](#external-block-libraries-usage)
- [Articles](#articles)

## Quick start

1. Make sure that [node.js](https://nodejs.org/en/) is installed on the computer that will assemble the project (node.js is not required on the production server).

1. Install the [System.Web.Bem package](https://www.nuget.org/packages/System.Web.Bem/) into your ASP.NET MVC project.
  ```bash
  PM> Install-Package System.Web.Bem -Pre
  ```

1. Return the instance of the `BemhtmlResult` class from the controller's method and send the necessary bemjson to the `BemhtmlResult` constructor.
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

### Specifics of BEM projects
[BEM](https://en.bem.info) (Block-Element-Modifier) is the frontend development methodology, which was created in [Yandex](https://yandex.com/company). It is based on the component approach. BEM also includes a set of tools that make development with the BEM methodology more convenient. BEM helps you develop sites faster and support them for a long time.

According to the BEM principles, an application consists of independent blocks, which are located in separate folders. Each block is implemented in several technologies (templates, styles, client-side code). Blocks should be assembled into the bundles to use them in the running application.

A bundle declaration is a file that lists the blocks that should be in a bundle. The assembler builds the bundle based on this declaration, accounting for block dependencies and redefinition levels. A separate bundle is made for each technology. When the application is running, the bundle of templates is used for generating HTML (on the server and the client side), while the JS and CSS bundles are included in the pages and used on the client side.

**System.Web.Bem** is the BEM infrastructure for ASP.NET MVC projects. When the [System.Web.Bem package](https://www.nuget.org/packages/System.Web.Bem) is installed into the project:
- The `Bem` folder is created with the project's file structure.
- The [enb](https://en.bem.info/toolbox/enb) assembler for BEM projects is installed from npm, and the enb configuration file is created.
- The `System.Web.Bem` library for .NET is integrated for using BEMHTML templates on the server side.

### Project structure

```
<Project root>
├─ Bem                          // BEM files folder
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
├─ Controllers                  // Controllers, Models, Views - the standard ASP.NET MVC folders
├─ Models
├─ Views
│  ...
├─ package.json                 // npm configuration file
└─ Web.config                   // configuration file of your application
```

### Building the bundles
**Note! Node.js is required for project building. Node.js on the production server is not required.**

Blocks should be assembled into the bundles for use in the running application. Bundle formation is based on the *bundle declaration*, which is a special file that lists the blocks to bundle. Here is an example of a bundle declaration:

```javascript
exports.blocks = [
  { name: 'block1' },
  { name: 'block2' }
];
```

Declarations should be located in the `/Bem/desktop.bundles` folder, each bundle is in its own folder. The declaration file name should match the name of the bundle and it should have the `bemdecl.js` extension. For example, the declaration of the `default` bundle should be located in the file `/Bem/desktop.bundles/default/default.bemdecl.js`.

Assembly is performed by the [enb](https://en.bem.info/toolbox/enb) tool, which is added to the project during installation of the System.Web.Bem package from NuGet. The project settings are also changed during the package installation, to make enb run automatically after MsBuild is executed. Thus, when you run the build of your ASP.NET MVC project in Visual Studio, the BEM bundles are assembled automatically when C# code is compiled. When building the project, all declarations are found in the `/Bem/desktop.bundles` folder and the technology bundles (templates, styles, and JavaScript) are assembled for each of them.

Bundles of technologies should be named `<bundle_name>.<tech_ext>` and should be saved in the folder where the declaration is located. E.g. the templates file (`bemhtml.js`) for the `default` bundle should have the path `/Bem/desktop.bundles/default/default.bemhtml.js`. So after building the project you will see something like this:

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

When the application is running, the bundle of templates is used for generating HTML (on the server and the client side), while JS bundles and style bundles are included to the pages and used on the client side. Server-side HTML generation uses the bundle of templates specified in application settings. The client-side bundles (JS and CSS) should be included into the page manually.

### Server-side templating with BEMHTML

[BEMHTML](https://github.com/bem/bem-xjst) is a special template engine that is convenient for BEM projects.

When the NuGet [System.Web.Bem package](https://www.nuget.org/packages/System.Web.Bem) is installed in the project, a reference to the System.Web.Bem .NET library is added in order to use BEMHTML templates on the server side. To generate an HTML using BEMHTML on the server, just return an instance of the `BemhtmlResult` class from the controller's method and send the necessary *bemjson* to the `BemhtmlResult` constructor.

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

If you need to render a BEM block from the Razor template you have to use the `@Html.Bem` helper and provide the necessary bemjson for it.
```cs
@Html.Bem(new { block = "my-block", data = Model })
```

In the `bemSettings` section of the Web.config file, you can set up how to select template bundles for HTTP requests. There are three possible ways to map requests to bundles:

1. A single bundle per application. You can set its name in the `DefaultBundle` parameter (set to `default` by default):

  ```xml
  <bemSettings Mapper="Single" DefaultBundle="index" />
  ```
1. A separate bundle for each server-side controller:

  ```xml
  <bemSettings Mapper="ByController" />
  ```
  The bundle name is formed from the controller name. All words are separated by dashes, all letters are changed to lowercase, the `controller` suffix is deleted, and the `p-` prefix is added (for example, `MainPageController` → `p-main-page`).
1. A custom mapper - you can write your own mapper class and set its name in the `Mapper` parameter:

  ```xml
  <bemSettings Mapper="MyApplication.MyNamespace.InnerNamespace.MyMapperClass" />
  ```
Your mapper class must be inherited from the base class named [System.Web.Bem.BundleMappers.Mapper](System.Web.Bem/BundleMappers/Mapper.cs) and it must implement the `abstract string GetBundleName(ControllerContext context)` method, which receives a request context as an input parameter and returns the bundle name for this request. Also you can owerride the `virtual string GetBundlePath(string bundleName)` method, which returns the full path to the bemhtml bundle for the bundle name (by default the path `<RootDir>\<bundleName>\<bundleName>.bemhtml.js` is formed).

You can also set up the default root directory for BEM bundles (`~/Bem/desktop.bundles` by default):

```
<bemSettings RootDir="~/public" />
```

### External block libraries usage

You can add third-party block libraries to your project and use them. To do this, copy the block files into your project and add the copied folders to the list of redefinition levels.

We recommend putting third-party blocks inside the `/Bem/libs` folder. For example:

```
└─ Bem
   └─ libs                        // third-party block libraries
      ├─ my-ext-block-library     // library folder
      │  ├─ common.blocks         // redefinition level
      │  │   ├─ block1
      │  │   └─ block2
      │  ├─ desktop.blocks        // other redefinition level
      │  └─ ...                 
      │  ...
      └─ other-ext-block-library  // other library folder
```

The list of redefinition levels is located in the `/Bem/levels.js` file. 

```
├─ Bem
│  ├─ desktop.blocks
│  ├─ desktop.bundles
│  ├─ libs                        // third-party block libraries
│  └─ levels.js                   // list of redefinition levels
└─ ...
```

This is actually a list of folders where files will be taken from for building the project. You must add the redefinition levels of third-party libraries you are using to this list. For the file structure example which is described above, the list of redefinition levels should be similar to this:

```javascript
module.exports = [
  { path: 'libs/my-ext-block-library/common.blocks', check: false },
  { path: 'libs/my-ext-block-library/desktop.blocks', check: false },
  { path: 'libs/other-ext-block-library/common.blocks', check: false },
  ...
  'desktop.blocks'
];
```

The block libraries [bem-core](https://github.com/bem/bem-core/blob/v3/README.ru.md) and [bem-components](https://github.com/bem/bem-components/blob/v3/README.ru.md) were published in NuGet for easy installation into any project. To use it just install [bem-core](https://www.nuget.org/packages/bem-core/) and [bem-components](https://www.nuget.org/packages/bem-components/) NuGet packages:
```
Install-Package bem-core
Install-Package bem-components
```
Redefinition levels of bem-core and bem-components libraries [already exist](https://github.com/dotnet-bem/system-web-bem/blob/master/System.Web.Bem/package/content/Bem/levels.js#L2-L10) in the `levels.js` file but they are commented out. Uncomment them to use those libraries.

## Articles
- [Combine BEM with .NET](https://ru.bem.info/forum/1007/) (in Russian)
- [Сontinue to combine BEM with .NET](https://ru.bem.info/forum/1048/) (in Russian)
- [Hackathon: BEM-infrastructure for .NET](https://ru.bem.info/forum/1065/) (in Russian)
