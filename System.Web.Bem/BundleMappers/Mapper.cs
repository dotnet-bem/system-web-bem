using System.IO;
using System.Web.Bem.Configuration;

namespace System.Web.Bem.BundleMappers
{
    public abstract class Mapper
    {
        #region static members

        public static Mapper Create(BemConfiguration config)
        {
            Mapper mapper;

            switch (config.Mapper)
            {
                case "Single":
                    mapper = new Single();
                    break;
                case "ByBlock":
                    mapper = new ByBlock();
                    break;
                case "ByMap":
                    mapper = new ByMap();
                    break;
                default:
                    var type = Type.GetType(config.Mapper, true);
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
            DefaultBundle = config.DefaultBundle;
            RootDir = config.RootDir;
        }

        public abstract string Map(string blockName);

        protected virtual string GetPathByName(string blockName)
        {
            return Path.Combine(blockName, blockName + ".bemhtml.js");
        }

        #endregion
    }
}
