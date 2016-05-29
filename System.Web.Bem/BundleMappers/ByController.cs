using System.Collections.Concurrent;
using System.Text.RegularExpressions;
using System.Web.Mvc;

namespace System.Web.Bem.BundleMappers
{
    public class ByController : Mapper
    {
        private static readonly Regex regex1 = new Regex("Controller$", RegexOptions.Compiled);
        private static readonly Regex regex2 = new Regex("([A-Z])", RegexOptions.Compiled);

        private readonly ConcurrentDictionary<Type, string> map = new ConcurrentDictionary<Type, string>();

        protected override string GetBundleName(ControllerContext context)
        {
            var type = context.Controller.GetType();
            return map.GetOrAdd(type, GetBundlePathByControllerType);
        }

        private string GetBundlePathByControllerType(Type type)
        {
            return "p" + regex2.Replace(regex1.Replace(type.Name, string.Empty), "-$1").ToLower();
        }
    }
}
