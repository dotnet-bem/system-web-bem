using System;
using System.Threading.Tasks;
using EdgeJs;

namespace BemDotNet.Engine
{
    /// <summary>
    /// JS template wrapper
    /// </summary>
	public class BemhtmlTemplate
	{
        private readonly Func<object, Task<object>> func;

        public BemhtmlTemplate(string bundle)
		{
			func = Edge.Func(bundle + ";return function (data, cb) { cb(null, exports.apply(data));}");
		}

		public Task<object> Apply(object data) 
		{
			return func(data);
		}
	}
}
