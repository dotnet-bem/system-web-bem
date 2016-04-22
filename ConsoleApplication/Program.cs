using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApplication
{
	class Program
	{
		static async void Run()
		{
			var templates = File.ReadAllText("templates.bemhtml.js");

			var bemhtml = new Bemhtml(templates);

			var bemjson = new
			{
				block = "button",
				name = "name",
				icon = new
				{
					block = "icon",
					url = "arrow.svg"
				},
				text = "submit"
			};

			var html = await bemhtml.Apply(bemjson);

			Console.Write(html);
		}

		static void Main(string[] args)
		{
			Run();
			Console.ReadKey();
		}
	}
}
