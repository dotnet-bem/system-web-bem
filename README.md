# System.Web.Bem

System.Web.Bem - БЭМ-инфрастурктура для ASP.NET MVC.

## Как установить
Установите [пакет System.Web.Bem](https://www.nuget.org/packages/System.Web.Bem/)
```
PM> Install-Package System.Web.Bem -Pre
```
При установке:
- добавляется папка Bem с файловой структурой БЭМ проекта и конфигом для enb,
- в проект из npm ставится сборщик enb и нужные для сборки enb-технологии,
- в конфиг MsBuild добавляется дополнительный этап сборки: запуск enb - таким образом при компиляции C# в Visual Studio выполняется также и сборка БЭМ-бандлов
- в проект подключается C# библиотека System.Web.Bem для серверной шаблонизации

## Структура проекта

```
<Project root>                  // корневая папка проекта
├─ Bem                          // папка 
│  ├─ .enb
│  │  └─ make.js                // конфиг сборщика enb
│  ├─ desktop.blocks            // уровень переопределения, внутри находятся блоки
│  │  ├─ block-1 
│  │  ├─ block-2 
│  │  │  ... 
│  │  └─ block-n 
│  │     ├─ block-n.bemhtml.js  // реализация блока block-n в технологии bemhtml.js
│  │     ├─ block-n.css         // реализация блока block-n в технологии css 
│  │     │  ...                 // ...
│  │     └─ block-n.js
│  └─ desktop.bundles           // папка с бандлами проекта
│     ├─ bundle-1 
│     ├─ bundle-2 
│     │  ... 
│     └─ bundle-n 
│        └─ bundle-n.bemdecl.js // декларация бандла bundle-n 
│  ...
├─ Controllers                  // Controllers, Models, Views - стандартные папки ASP.NET MVC
├─ Models
├─ Views
│  ...
├─ package.json                 // конфиг npm
└─ Web.config                   // конфиг вашего приложения
```

## Использование

- хелперы
- как подключить библиотеки блоков

## Сборка

## Серверная шаблонизация

Возможны 3 варианта выбора бандла для шаблонизации ответа на http запрос:
1. один бандл на всё приложение - его название можно задать в параметре `DefaultBundle` (по умолчанию `default`)
```xml
<bemSettings Mapper="Single" DefaultBundle="index" />
```
1. отдельный бандл для каждого серверного контроллера
```xml
<bemSettings Mapper="ByController" />
```
  Название бандла определяется по названию контроллера: слова разделяются дефисами, приводятся к нижнему регистру, удаляется суффикс "controller" и добавляется префикс `p-` (например, `MainPageController` → `p-main-page`). Есть идея еще добавить возможность настройки названия бандла для контроллера через C# атрибуты.
1. кастомный мэппер - есть возможность написать свой класс мэппера и указать его название в параметре `Mapper`:
```xml
<bemSettings Mapper="MyApplication.MyNamespace.InnerNamespace.MyMapperClass" />
```
Класс мэппера [должен быть унаследован](https://github.com/dima117/bemtest-net/blob/master/System.Web.Bem/BundleMappers/Mapper.cs) от `System.Web.Bem.BundleMappers.Mapper` и реализовывать метод `abstract string GetBundleName(ControllerContext context)`, получающий на вход контекст запроса и возвращающий название бандла. Также, при желании, можно переопределить метод `virtual string GetBundlePath(string bundleName)`, возвращающий по названию бандла путь к файлу с bemhtml шаблонами (по умолчанию формируется путь `<RootDir>\<bundleName>\<bundleName>.bemhtml.js`)

## Публикации
- https://ru.bem.info/forum/1007/
- https://ru.bem.info/forum/1048/
