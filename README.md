# System.Web.Bem

System.Web.Bem - is a BEM (Block-Element-Modifier) infrastructure for ASP.NET MVC projects.

- [Quick start](#quick-start)
- [Details](#details)
    - [Specificity of BEM projects](#specificity-of-bem-projects)
    - [Project structure](#project-structure)
    - [Build the bundles](#build-the-bundles)
    - [Server-side templating with BEMHTML](#server-side-templating-with-bemhtml)
    - [External block libraries usage](#external-block-libraries-usage)
- [Articles](#articles)

## Quick start

1. Make sure that [node.js](https://nodejs.org/en/) is installed on the computer that will assemble the project (node.js on the production server is not required).

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

According to the BEM principles, application consists of independent blocks, which located in separate folders. Each block is implemented in several technologies (templates, styles, client-side code). Blocks should be assembled into the bundles to use them in the running application.

Bundle declaration is a file with the list of blocks, which should be in a bundle. On the base of declaration assembler will build a bundles according to dependencies of blocks and levels of redifinition. Bundle is built separately for each technology. During the application is running the bundle of templates is used for html generation (on the server and the client side), js bundles and style bundles are included in the pages and used on client side.

**System.Web.Bem** is the BEM-infrastructure for ASP.NET MVC projects. During the installation of [System.Web.Bem package](https://www.nuget.org/packages/System.Web.Bem) into the project:
- folder `BEM` with the files structure is created;
- assembler of BEM-projects [enb](https://ru.bem.info/toolbox/enb) is installed from npm and proper configuration file for enb is created;
- reference for .NET library named System.Web.Bem is added (this library allows to use BEMHTML templates on the server side).

### Project structure

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
**Note! Node.js is required for project building. Node.js on the production server is not required.**

Blocks should be assembled into the bundles for usage in running application. Bundles formation is performed on the base of *bundle declaration*. It is a special file that contains the list of blocks which should be in the bundle. Bundle declaration example:

```javascript
exports.blocks = [
  { name: 'block1' },
  { name: 'block2' }
];
```

Declarations should be located in the `/Bem/desktop.bundles` folder, each bundle is in its own folder. The declaration file name should match the name of the bundle and it should have the `bemdecl.js` extension. For example, the declaration of the `default` bundle should be located in the file `/Bem/desktop.bundles/default/default.bemdecl.js`.

Assembling is performed by special tool [enb](https://ru.bem.info/toolbox/enb), which is added to the project during the System.Web.Bem package installation from NuGet. Also during the package installation the project settings is changed: the automatical enb execution after the MsBuild execution is added. Thus, when you run the build of your ASP.NET MVC project in Visual Studio the assembling of BEM-bundles will be performed automatically after the c# code compilation. During the project assembling will be found all the declarations in the `/Bem/desktop.bundles` folder and for each of them will be assembled all the technologies bundles (templates, styles, java script).

Bundles of technologies should be named `<bundle_name>.<tech_ext>` and should be saved in the folder where the declaration is located. E.g. the templates file (`bemhtml.js`) for the `default` bundle should have a path `/Bem/desktop.bundles/default/default.bemhtml.js`. Thus, after the build of the project you will see something like this:

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

During the application is running the bundle of templates is used for html generation (on the server and the client side), js bundles and style bundles are included to the pages and used on the client side. During the server-side html generation the templates bundle specified in application settings will be used. Client-side bundles (js and css) should be included to the page manually.

### Server-side templating with BEMHTML

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

If you need to render BEM-block from the Razor template you have to use the `@Html.Bem` helper and provide the essential bemjson for it.
```cs
@Html.Bem(new { block = "my-block", data = Model })
```

In the `bemSettings` section of Web.config file you can setup how to selected the template-bundles for http-requests. There are 3 choices of request-to-bundle mapping available:

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

You can add to your project third-party block libraries and use them. For that you should copy the blocks files into your project and add the copied folders to the list of redefinition levels.

It is recommended to locate third-party blocks inside the `/Bem/libs` folder. For example:
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

The list of redefinition levels is located in `/Bem/levels.js` file. 

```
├─ Bem
│  ├─ desktop.blocks
│  ├─ desktop.bundles
│  ├─ libs                        // third-party block libraries
│  └─ levels.js                   // list of redefinition levels
└─ ...
```

Actually it is the list of folders from which the files will be used during project build. It's necessary to add the redefinition levels of the used third-party libraries to this list. For the file structure example which is described above, the list of redefinition levels should be similar to this:

```javascript
module.exports = [
  { path: 'libs/my-ext-block-library/common.blocks', check: false },
  { path: 'libs/my-ext-block-library/desktop.blocks', check: false },
  { path: 'libs/other-ext-block-library/common.blocks', check: false },
  ...
  'desktop.blocks'
];
```

Block libraries [bem-core](https://github.com/bem/bem-core/blob/v3/README.ru.md) and [bem-components](https://github.com/bem/bem-components/blob/v3/README.ru.md) were published in NuGet for easy installation into any project. To use it just install [bem-core](https://www.nuget.org/packages/bem-core/) and [bem-components](https://www.nuget.org/packages/bem-components/) NuGet packages:
```
Install-Package bem-core
Install-Package bem-components
```
Redefinition levels of bem-core and bem-components libraries [already exists](https://github.com/dotnet-bem/system-web-bem/blob/master/System.Web.Bem/package/content/Bem/levels.js#L2-L10) in the `levels.js` file but they are commented out. Uncomment them to use those libraries.

## Articles
- [Combine BEM with .NET](https://ru.bem.info/forum/1007/) (in Russian)
- [Сontinue to combine BEM with .NET](https://ru.bem.info/forum/1048/) (in Russian)
- [Hackathon: BEM-infrastructure for .NET](https://ru.bem.info/forum/1065/) (in Russian)
