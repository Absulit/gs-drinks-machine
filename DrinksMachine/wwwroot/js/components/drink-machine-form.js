﻿'use strict';

import DataHandler from "../DataHandler.js";
import Identifier from "../Identifier.js";
import Events from "../Events.js"
import DrinkInput from "./drink-input/drink-input.js";
import CoinInput from "./coin-input/coin-input.js";

export default class DrinkMachineForm extends Identifier {
    constructor(el) {
        super(el, import.meta.url + '/../drink-machine-form.html');
        this._totalCostDrinks = 0;
        this._drinkInputs = [];
        this.dataHandler = new DataHandler();
    }

    init = () => {
        this.submitEl.onclick = this.onClickSubmit;
        console.log('---- INIT', this.formEl);

        this.dataHandler.addEventListener(Events.COMPLETE, this.onCoinsGetComplete);
        this.dataHandler.get('/Coins/GetAll');


    }

    onClickSubmit = (e) => {
        const isValid = this.formEl.reportValidity();

        if (isValid) {
            //this.dispatchEvent(new Event(Events.SAVE));
            const data = {
                'cents': Number(this.centsInput.value),
                'pennies': Number(this.penniesInput.value),
                'nickels': Number(this.nickelsInput.value),
                'quarters': Number(this.quartersInput.value),
                'cokeAmount': Number(this.cokeAmount.value),
                'pepsiAmount': Number(this.pepsiAmount.value),
                'orderTotal': 0
            }
            console.log('----data', data)

            this.dataHandler.addEventListener(Events.COMPLETE, this.onProcessComplete);
            this.dataHandler.post('/process', data);
        }

        return false;
    }

    onCoinsGetComplete = e => {
        this.dataHandler.removeEventListener(Events.COMPLETE, this.onCoinsGetComplete);
        const data = this.dataHandler.data;
        console.log('---- onCoinsGetComplete, data', data);

        let coinInput;
        let div;
        data.forEach(coindata => {
            div = document.createElement('div');
            this.coinInputs.appendChild(div);
            coinInput = new CoinInput(div, coindata.name);
            coinInput.addEventListener(Events.CHANGED, this.onChangeCoinInput);
        });


        this.dataHandler.addEventListener(Events.COMPLETE, this.onDrinksGetComplete);
        this.dataHandler.get('/Drinks/GetAll');
    }

    onChangeCoinInput = e => {
        console.log('---- DrinkMachineForm, onChangeCoinInput', e);
    }

    onDrinksGetComplete = e => {
        this.dataHandler.removeEventListener(Events.COMPLETE, this.onDrinksGetComplete);

        const data = this.dataHandler.data;
        console.log('---- onDrinksGetComplete, data', data);

        let drinkInput;
        let div;
        let totalDrinks = 0;
        data.forEach(drinkData => {
            div = document.createElement('div');
            this.drinkInputs.appendChild(div);
            drinkInput = new DrinkInput(div, drinkData.name, drinkData.quantityAvailable, drinkData.cost);
            drinkInput.cost = drinkData.cost;
            drinkInput.addEventListener(Events.CHANGED, this.onChangeDrinkAmount);
            totalDrinks += drinkData.quantityAvailable;
            this._drinkInputs.push(drinkInput);
        });

        if(totalDrinks === 0){
            submitEl.classList.add('disabled');
        }
    }

    onProcessComplete = e => {
        this.dataHandler.removeEventListener(Events.COMPLETE, this.onProcessComplete);
        console.log('---- onProcessComplete');
    }

    onChangeDrinkAmount = e => {
        console.log('---- DrinkMachineForm, onChangeDrinkAmount');
        this._totalCostDrinks = 0;
        this._drinkInputs.forEach(drinkInput => {
            this._totalCostDrinks += (drinkInput.cost * drinkInput.drinkAmount.value);
        });
        console.log('---- DrinkMachineForm, onChangeDrinkAmount, totalCostDrinks: ', this._totalCostDrinks);

        if(this._totalCostDrinks >= 100){
            this.orderTotalEl.innerHTML = `${this._totalCostDrinks/100} dollars`
        }else{
            this.orderTotalEl.innerHTML = `${this._totalCostDrinks} cents`
        }

    }
}
