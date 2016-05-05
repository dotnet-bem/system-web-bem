using System;
using System.Threading.Tasks;
using EdgeJs;

namespace BemDotNet
{
	public class Bemhtml
	{
        private readonly Func<object, Task<object>> func;

        public Bemhtml(string bundle)
		{
			func = Edge.Func(bundle + ";return function (data, cb) { cb(null, exports.apply(data));}");
		}

		public Task<object> Apply(object data) 
		{
			return func(data);
		}
	}
}
