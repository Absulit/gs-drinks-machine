'use strict';

import DataHandler from "../DataHandler.js";
import Identifier from "../Identifier.js";
import Events from "../Events.js"

export default class DrinkMachineForm extends Identifier {
    constructor(el){
        super(el, import.meta.url + '/../drink-machine-form.html');
        this.dataHandler = new DataHandler();
        
    }

    init = () => {
        this.submitEl.onclick = this.onClickSubmit;
        console.log('---- INIT', this.formEl);
        this.dataHandler.addEventListener(Events.COMPLETE, this.onProcessComplete);

        this.cokeAmount.addEventListener('change', this.onChangeDrinkAmount);
        this.pepsiAmount.addEventListener('change', this.onChangeDrinkAmount);
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


            console.log('----data',data)

            this.dataHandler.addEventListener(Events.COMPLETE, this.onProcessComplete);
            this.dataHandler.post('/process', data);
            
        }

        return false;
    }

    onProcessComplete = e => {
        this.dataHandler.removeEventListener(Events.COMPLETE, this.onProcessComplete);
        console.log('---- onProcessComplete');
    }

    onChangeDrinkAmount = e => {
        console.log('---- onChangeDrinkAmount');
    }
}
