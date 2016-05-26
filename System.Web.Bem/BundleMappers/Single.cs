using System.IO;

namespace System.Web.Bem.BundleMappers
{
    public class Single : Mapper
    {
        public override string Map(string blockName)
        {
            var bundlePath = GetPathByName(DefaultBundle);
            return Path.Combine(RootDir, bundlePath);
        }
    }
}
