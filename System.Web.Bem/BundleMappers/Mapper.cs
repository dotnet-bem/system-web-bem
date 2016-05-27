using System.Web.Bem.Configuration;
using System.Web.Mvc;

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
                case "ByController":
                    mapper = new ByController();
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

        public abstract string Map(ControllerContext context);

        #endregion
    }
}
