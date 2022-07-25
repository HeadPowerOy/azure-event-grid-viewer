using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using viewer.Models;

namespace viewer.Controllers
{
    public class HomeController : Controller
    {
        #region Public methods

        public IActionResult Index()
        {
            var requestUri = new Uri(Request.GetDisplayUrl());
            var environment = GetEnvironment(requestUri);

            ViewData["Environment"] = environment;

            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        #endregion Public methods

        #region Private methods

        private string GetEnvironment(Uri requestUri)
        {
            if (requestUri.Host.StartsWith("hpo-alfa-"))
            {
                return "ALFA";
            }
            else if (requestUri.Host.StartsWith("hpo-beta-"))
            {
                return "BETA";
            }
            else if (requestUri.Host.StartsWith("hpo-part-"))
            {
                return "PART";
            }
            else if (requestUri.Host.StartsWith("hpo-prod-"))
            {
                return "PROD";
            }

            return "LOCAL";
        }

        #endregion Private methods
    }
}
