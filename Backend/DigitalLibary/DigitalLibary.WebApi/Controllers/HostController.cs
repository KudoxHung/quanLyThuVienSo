using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace DigitalLibary.WebApi.Controllers
{
    [Route("api/host")]
    [ApiController]
    public class HostController : Controller
    {

        public HostController()
        {

        }

        [HttpGet]
        [Route("ListBackEnd")]
        public List<KeyValuePair<int, string>> ListBackEnd()
        {
            List<KeyValuePair<int, string>> list = new List<KeyValuePair<int, string>>();

            // Adding key-value pairs
            list.Add(new KeyValuePair<int, string>(1, "https://localhost:44347"));
            list.Add(new KeyValuePair<int, string>(2, "Value2"));
            list.Add(new KeyValuePair<int, string>(3, "Value3"));

            return list;

        }
    }
}
