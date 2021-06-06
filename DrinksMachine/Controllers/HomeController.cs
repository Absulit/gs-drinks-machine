using DrinksMachine.Extensions;
using DrinksMachine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics;

namespace DrinksMachine.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            ViewData.Model = new DrinksMachineModel();
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }


        [HttpPost("process")]
        public ActionResult Process([FromBody]DrinksMachineModel drinksMachineModel)
        {
            Debugger.Log(0, "category", $"---- CENTS { drinksMachineModel.Cents } \n\n");

            ViewData.Model = drinksMachineModel;

            return Ok(drinksMachineModel);
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
