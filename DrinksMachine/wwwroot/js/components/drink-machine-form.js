'use strict';

import DataHandler from "../DataHandler.js";
import Identifier from "../Identifier.js";
import Events from "../Events.js"
import DrinkInput from "./drink-input/drink-input.js";

export default class DrinkMachineForm extends Identifier {
    constructor(el) {
        super(el, import.meta.url + '/../drink-machine-form.html');
        this.dataHandler = new DataHandler();
    }

    init = () => {
        this.submitEl.onclick = this.onClickSubmit;
        console.log('---- INIT', this.formEl);

        this.dataHandler.addEventListener(Events.COMPLETE, this.onDrinksGetComplete);
        this.dataHandler.get('/Drinks/GetAll');
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

    onDrinksGetComplete = e => {
        this.dataHandler.removeEventListener(Events.COMPLETE, this.onDrinksGetComplete);

        const data = this.dataHandler.data;
        console.log('---- onDrinksGetComplete, data', data);

        let drinkInput;
        let div;
        data.forEach(drinkData => {
            div = document.createElement('div');
            this.drinkInputs.appendChild(div);
            drinkInput = new DrinkInput(div, drinkData.name, drinkData.quantityAvailable, drinkData.cost);
            drinkInput.addEventListener(Events.CHANGED, this.onChangeDrinkAmount);
        });
    }

    onProcessComplete = e => {
        this.dataHandler.removeEventListener(Events.COMPLETE, this.onProcessComplete);
        console.log('---- onProcessComplete');
    }

    onChangeDrinkAmount = e => {
        console.log('---- DrinkMachineForm, onChangeDrinkAmount', e);
    }
}
