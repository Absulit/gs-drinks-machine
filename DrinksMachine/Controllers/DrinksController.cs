using DrinksMachine.Extensions;
using DrinksMachine.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace DrinksMachine.Controllers
{
    public class DrinksController : Controller
    {
        private readonly ILogger<DrinksController> _logger;
        private readonly List<Drink> _drinks = null;
        public DrinksController(ILogger<DrinksController> logger)
        {
            _logger = logger;

            _drinks = new List<Drink>();


            // coke
            Drink coke = new Drink()
            {
                Name = "Coke",
                QuantityAvailable = 5,
                Cost = 5
            };
            // pepsi
            Drink pepsi = new Drink()
            {
                Name = "Pepsi",
                QuantityAvailable = 15,
                Cost = 36
            };

            // soda?
            Drink soda = new Drink()
            {
                Name = "Generic Soda",
                QuantityAvailable = 3,
                Cost = 45
            };

            _drinks.Add(coke);
            _drinks.Add(pepsi);
            _drinks.Add(soda);

        }
        private List<Drink> drinks
        {
            get { return HttpContext.Session.Get<List<Drink>>("drinks"); }
            set { HttpContext.Session.Set<List<Drink>>("drinks", value); }
        }

        public IActionResult GetAll()
        {
            if (drinks == null)
            {
                drinks = _drinks;
            }
            return Ok(drinks);
        }

        [HttpPut]
        public IActionResult Update([FromBody] List<Drink> drinksToUpdate)
        {
            drinks = drinksToUpdate;
            _logger.LogDebug("---- drinks", drinks);
            return Ok(drinks);
        }
    }
}
