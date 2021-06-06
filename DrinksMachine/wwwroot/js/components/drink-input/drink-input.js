'use strict'

import Events from "../../Events.js";
import Identifier from "../../Identifier.js";

export default class DrinkInput extends Identifier {
    constructor(el, name, quantity, cost) {
        super(el, import.meta.url + '/../drink-input.html');
        this._name = name;
        this._quantity = quantity;
        this._cost = cost;
    }

    init = () => {
        console.log('---- DrinkInput INIT');

        this.drinkAmount.addEventListener('change', this.onChangeDrinkAmount);

        if(this._quantity == 0){
            this.drinkAmount.classList.add('disabled');
        }

        this.drinkLabel.innerHTML = this._name;
        this.drinkQuantity.innerHTML = this._quantity;
        this.drinkCost.innerHTML = this._cost;

        this.drinkAmount.max = this._quantity;
    }

    onChangeDrinkAmount = e => {
        console.log('---- DrinkInput, onChangeDrinkAmount');
        this.dispatch(Events.CHANGED);
    }
}
