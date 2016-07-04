using System.Collections.Concurrent;
using System.IO;
using System.Threading.Tasks;
using System.Web.Bem.BundleMappers;
using System.Web.Bem.Configuration;
using System.Web.Hosting;
using System.Web.Mvc;

namespace System.Web.Bem.Engine
{
    /// <summary>
    /// Template manager: init/cache/find
    /// </summary>
    public class BemhtmlEngine
    {
        private static readonly BemConfiguration config;
        public static readonly BemhtmlEngine Instance;

        private readonly Mapper mapper;
        private readonly ConcurrentDictionary<string, BemhtmlTemplate> cache;

        static BemhtmlEngine()
        {
            config = BemConfiguration.Load();
            Instance = new BemhtmlEngine();

            if (config.Debug)
            {
                Environment.SetEnvironmentVariable("EDGE_NODE_PARAMS", "--debug");
            }
        }

        public BemhtmlEngine()
        {
            mapper = Mapper.Create(config);
            cache = new ConcurrentDictionary<string, BemhtmlTemplate>();
        }

        /// <summary>
        /// Create and cache bundle .NET wrapper
        /// </summary>
        public BemhtmlTemplate GetTemplate(ControllerContext context)
        {
            var path = mapper.Map(context);
            return cache.GetOrAdd(path, InitTemplate);
        }

        private BemhtmlTemplate InitTemplate(string absolutePath)
        {
            var content = File.ReadAllText(absolutePath);

            return new BemhtmlTemplate(content);
        }

        public Task<object> Render(ControllerContext context, object data)
        {
            return GetTemplate(context).Apply(data);
        }
    }
}
