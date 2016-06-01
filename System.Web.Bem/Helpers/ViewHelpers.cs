using System.Web.Bem.Engine;
using System.Web.Mvc;

namespace System.Web.Bem.Helpers
{
    public static class ViewHelpers
    {
        public static MvcHtmlString Bem(this HtmlHelper helper, object data)
        {
            var html = BemhtmlEngine.Instance.Render(helper.ViewContext, data);
            html.Wait();

            return new MvcHtmlString(html.Result as string);
        }
    }
}
