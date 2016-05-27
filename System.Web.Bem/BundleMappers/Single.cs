﻿using System.IO;
using System.Web.Mvc;

namespace System.Web.Bem.BundleMappers
{
    public class Single : Mapper
    {
        public override string Map(ControllerContext context)
        {
            return Path.Combine(RootDir, DefaultBundle);
        }
    }
}
