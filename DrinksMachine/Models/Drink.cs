namespace DrinksMachine.Models
{
    public class Drink
    {
        public string Name { get; set; }
        public int QuantityAvailable { get; set; } = 0; // by default there's none
        public int Cost { get; set; } = 25; // just a minimum value by default
    }
}
