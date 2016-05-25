using System.IO;

namespace System.Web.Bem.Engine
{
    /// <summary>
    /// Bundle name to path mapper
    /// </summary>
    public class BemhtmlBundleMapper
    {
        public string GetPathByName(string name)
        {
            return Path.Combine("~/Bem/desktop.bundles", name, name + ".bemhtml.js");
        }
    }
}