﻿using System.Web.Mvc;
using System.Web.Bem.Engine;

namespace System.Web.Bem
{
    public class BemhtmlResult : ActionResult
    {
        private static readonly BemhtmlEngine engine = new BemhtmlEngine();

        public object Bemjson { get; set; }

        public BemhtmlResult(object bemjson)
        {
            Bemjson = bemjson;
        }
        
        public override void ExecuteResult(ControllerContext context)
        {
            var task = engine.Render(context, Bemjson);
            task.Wait();

            context.HttpContext.Response.Clear();
            context.HttpContext.Response.Write(task.Result as string ?? string.Empty);
        }
    }
}
