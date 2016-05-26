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

        #region properties

        [ConfigurationProperty("DefaultBundle", DefaultValue = "index")]
        public string DefaultBundle {
            get { return this["DefaultBundle"] as string; }
        }

        [ConfigurationProperty("RootDir", DefaultValue = "~/Bem/desktop.bundles")]
        public string RootDir
        {
            get { return this["RootDir"] as string; }
        }

        [ConfigurationProperty("Mapper", DefaultValue = "Single")]
        public string Mapper
        {
            get { return this["Mapper"] as string; }
        }

        #endregion
    }
}
