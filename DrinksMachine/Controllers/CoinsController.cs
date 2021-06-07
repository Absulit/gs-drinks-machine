using DrinksMachine.Extensions;
using DrinksMachine.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace DrinksMachine.Controllers
{
    public class CoinsController : Controller
    {
        private readonly ILogger<CoinsController> _logger;
        private readonly List<Coin> _coins = null;
        public CoinsController(ILogger<CoinsController> logger)
        {
            _logger = logger;

            _coins = new List<Coin>();

            Coin cents = new Coin()
            {
                Name = "Cent",
                CentsEquivalent = 1,
                Amount = 100
            };

            Coin pennies = new Coin()
            {
                Name = "Penny",
                CentsEquivalent = 1,
                Amount = 10
            };
            Coin nickels = new Coin()
            {
                Name = "Nickel",
                CentsEquivalent = 5,
                Amount = 5
            };
            Coin quarters = new Coin()
            {
                Name = "Quarter",
                CentsEquivalent = 25,
                Amount = 25
            };

            _coins.Add(cents);
            _coins.Add(pennies);
            _coins.Add(nickels);
            _coins.Add(quarters);

        }

        private List<Coin> coins
        {
            get { return HttpContext.Session.Get<List<Coin>>("coins"); }
            set { HttpContext.Session.Set<List<Coin>>("coins", value); }
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            if (coins == null)
            {
                coins = _coins;
            }
            return Ok(coins);
        }

        [HttpPut]
        public IActionResult Update([FromBody] List<Coin> coinsToUpdate)
        {
            coins = coinsToUpdate;
            _logger.LogDebug("---- coins", coins);
            return Ok(coins);
        }
    }
}
