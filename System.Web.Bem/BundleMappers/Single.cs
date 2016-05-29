using System.IO;
using System.Web.Mvc;

namespace System.Web.Bem.BundleMappers
{
    public class Single : Mapper
    {
        protected override string GetBundleName(ControllerContext context)
        {
            return DefaultBundle;
        }
    }
}
