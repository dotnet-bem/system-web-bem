using System.Web.Mvc;
using System.Web.Bem;
using System.Web.Bem.Helpers;
using WebApplication.Models;

namespace WebApplication.Controllers
{
    public class DefaultController : Controller
    {
        public ActionResult Index()
        {
            return new BemhtmlResult(new { block = "p-index" });
        }

        public ActionResult Test()
        {
            return View(new TestModel
            {
                Event = new[] { "Доклад", "Мастер-класс", "Круглый стол" },
                Subjects = new[] { "БЭМ", "ASP.NET" }
            });
        }
    }
}