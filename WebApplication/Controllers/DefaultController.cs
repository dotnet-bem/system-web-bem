using System.Web.Mvc;
using System.Web.Bem;

namespace WebApplication.Controllers
{
    public class DefaultController : Controller
    {
        public ActionResult Index()
        {
            return new BemhtmlResult
            {
                Bemjson = new
                {
                    block = "p-index"
                }
            };
        }
    }
}