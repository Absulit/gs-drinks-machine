'use strict';

import Events from "../../Events.js";
import Identifier from "../../Identifier.js";

export default class CoinInput extends Identifier{
    constructor(el, name){
        super(el, import.meta.url + '/../coin-input.html');
        this._name = name;
    }

    init = () => {
        this.coinLabel.innerHTML = this._name;

        this.coinInput.addEventListener('change', this.onChangeCoinAmount);
    }

    onChangeCoinAmount = e => {
        console.log('---- DrinkInput, onChangeCoinAmount');
        this.dispatch(Events.CHANGED);
    }
}