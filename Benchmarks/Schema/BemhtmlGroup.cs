using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Benchmarks.Schema
{
    public class BemhtmlGroup
    {
        public string block { get; set; }
        public string title { get; set; }

        public BemhtmlItem[] content { get; set; }
    }
}
