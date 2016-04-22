using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EdgeJs;

namespace ConsoleApplication
{
	public class Bemhtml
	{
		private readonly Func<object, Task<object>> func;

		public Bemhtml(string template)
		{
			const string wrapper = @"
				{0}

				var api = new BEMHTML({{}});
				api.compile(function(match, once, wrap, elemMatch, block, elem, mode, mod, elemMod, def, tag, attrs, cls, js, bem, mix, content, replace, extend, oninit, xjstOptions, local, applyCtx, applyNext, apply) {{ {1}; }});
				api.exportApply(exports);

				return function (data, callback) {{ callback(null, exports.apply(data));}}";

			this.func = Edge.Func(string.Format(wrapper, Resources.bemhtml, template));
		}

		public async Task<string> Apply(object data) 
		{
			return await func(data) as string;
		}
	}
}
