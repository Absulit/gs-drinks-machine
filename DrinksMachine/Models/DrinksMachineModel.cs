using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DrinksMachine.Models
{
    public class DrinksMachineModel
    {
        public int Cents { get; set; } = 0;
        public int Pennies { get; set; } = 0;
        public int Nickels { get; set; } = 0;
        public int Quarters { get; set; } = 0;

        public int CokeAmount { get; set; } = 0;
        public int PepsiAmount { get; set; } = 0;
        public int OrdelTotal { get; set; } = 0;
    }
}
