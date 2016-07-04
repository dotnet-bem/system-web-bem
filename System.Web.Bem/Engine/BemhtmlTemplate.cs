using System.Threading.Tasks;
using EdgeJs;

namespace System.Web.Bem.Engine
{
    /// <summary>
    /// JS template wrapper
    /// </summary>
	public class BemhtmlTemplate
	{
        private readonly Func<object, Task<object>> func;

        public BemhtmlTemplate(string bundle)
		{
			func = Edge.Func(bundle + @"
                ;return function (data, cb) { 
                    cb(null, exports.BEMHTML.apply(data)); 
                    debugger; 
                }
            ");
		}

		public Task<object> Apply(object data) 
		{
			return func(data);
		}
	}
}
