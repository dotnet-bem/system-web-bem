using System.IO;
using System.Web.Bem.Configuration;
using System.Web.Hosting;
using System.Web.Mvc;

namespace System.Web.Bem.BundleMappers
{
    public abstract class Mapper
    {
        #region static members

        public static Mapper Create(BemConfiguration config)
        {
            string name = config.Get(cfg => cfg.Mapper, BemConfiguration.Defaults.MAPPER);
            Mapper mapper;

            switch (name)
            {
                case "Single":
                    mapper = new Single();
                    break;
                case "ByController":
                    mapper = new ByController();
                    break;
                default:
                    var type = Type.GetType(name, true);
                    mapper = (Mapper)Activator.CreateInstance(type);
                    break;
            }

            mapper.Init(config);
            return mapper;
        }

        #endregion

        #region instance members

        protected string DefaultBundle { get; set; }

        protected string RootDir { get; set; }

        public virtual void Init(BemConfiguration config)
        {
            var rootDir = config.Get(cfg => cfg.RootDir, BemConfiguration.Defaults.ROOT_DIR);

            RootDir = Path.IsPathRooted(rootDir) ? rootDir : HostingEnvironment.MapPath(rootDir);
            DefaultBundle = config.Get(cfg => cfg.DefaultBundle, BemConfiguration.Defaults.DEFAULT_BUNDLE);
        }

        public virtual string Map(ControllerContext context)
        {
            var bundleName = GetBundleName(context);
            return GetBundlePath(bundleName);
        }

        protected virtual string GetBundlePath(string bundleName)
        {
            return Path.Combine(RootDir, bundleName, bundleName + ".bemhtml.js");
        }

        protected abstract string GetBundleName(ControllerContext context);

        #endregion
    }
}
