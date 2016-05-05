using System.IO;
using System.Web.Mvc;

namespace BemDotNet
{
    public class BemhtmlResult : ActionResult
    {
        public object Bemjson { get; set; }
        public override void ExecuteResult(ControllerContext context)
        {
            string bundle =
                File.ReadAllText(@"C:\projects\bemtest-net\WebApplication\Bem\desktop.bundles\index\index.bemhtml.js");
            Bemhtml bemhtml = new Bemhtml(bundle);

            var html = bemhtml.Apply(Bemjson);
            html.Wait();

            context.HttpContext.Response.Clear();
            context.HttpContext.Response.Write(html.Result as string ?? string.Empty);
        }
    }
}
