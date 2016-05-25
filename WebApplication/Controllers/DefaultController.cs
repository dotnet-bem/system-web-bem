using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Bem;

namespace WebApplication.Controllers
{
    public class DefaultController : Controller
    {
        // GET: Default
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