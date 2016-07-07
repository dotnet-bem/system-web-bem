using System.Configuration;
using System.Web.Configuration;

namespace System.Web.Bem.Configuration
{
    public class BemConfiguration : ConfigurationSection
    {
        #region static

        public const string CONFIGURATION_SECTION_NAME = "bemSettings";

        public static BemConfiguration Load()
        {
            return WebConfigurationManager.GetSection(CONFIGURATION_SECTION_NAME) as BemConfiguration;
        }

        #endregion

        #region defaults

        public static class Defaults
        {
            public const string DEFAULT_BUNDLE = "default";

            public const string ROOT_DIR = "~/Bem/desktop.bundles";

            public const string MAPPER = "Single";
        }

        #endregion

        #region properties

        [ConfigurationProperty("DefaultBundle", DefaultValue = Defaults.DEFAULT_BUNDLE)]
        public string DefaultBundle {
            get { return this["DefaultBundle"] as string; }
        }

        [ConfigurationProperty("RootDir", DefaultValue = Defaults.ROOT_DIR)]
        public string RootDir
        {
            get { return this["RootDir"] as string; }
        }

        [ConfigurationProperty("Mapper", DefaultValue = Defaults.MAPPER)]
        public string Mapper
        {
            get { return this["Mapper"] as string; }
        }

        #endregion
    }
    
    public static class Extensions
    {
        public static T Get<T>(this BemConfiguration cfg, Func<BemConfiguration, T> fn, T defaultValue)
        {
            return cfg == null ? defaultValue : fn(cfg);
        }
    }
}
