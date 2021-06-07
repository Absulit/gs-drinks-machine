'use strict';

import DataHandler from '../DataHandler.js';
import Identifier from '../Identifier.js';
import Events from '../Events.js'
import DrinkInput from './drink-input/drink-input.js';
import CoinInput from './coin-input/coin-input.js';
import Dialog from './dialog/dialog.js';

export default class DrinkMachineForm extends Identifier {
    constructor(el) {
        super(el, import.meta.url + '/../drink-machine-form.html');

        // this one stores the coins comming from the BE
        this._coins = null;
        this._coinsUpdated = null; // used for a copy to update the BE if we accept the transaction

        this._drinks = null
        this._drinksUpdated = null; // used for a copy to update the BE if we accept the transaction

        this._totalCostDrinks = 0;
        this._totalPayCoins = 0;

        this._drinkInputs = [];
        this._coinInputs = [];
        this.dataHandler = new DataHandler();

        this.dialog = null;
    }

    init = () => {
        this.submitEl.onclick = this.onClickSubmit;
        console.log('---- INIT', this.formEl);

        this.dataHandler.addEventListener(Events.COMPLETE, this.onCoinsGetComplete);
        this.dataHandler.get('/Coins/GetAll');

        this.dialog = new Dialog(this.dialogEl);
    }

    clear = () => {
        this._drinkInputs = [];
        this._coinInputs = [];

        this.coinInputs.innerHTML = '';
        this.drinkInputs.innerHTML = '';
        this.orderTotalEl.innerHTML = '# cents/ dollars';
        this.paymentTotalEl.innerHTML = '# cents/ dollars';

        this._totalCostDrinks = 0;
        this._totalPayCoins = 0;
    }

    onClickSubmit = e => {
        const isValid = this.formEl.reportValidity();

        const change = this.getChangeCoins();
        console.log('---- change: ', change);
        const notEnoughChange = change.shouldReturnChange && change.difference > 0
        if (notEnoughChange) {
            console.log('---- NOT ENOUGH CHANGE ');

            this.dialog.addEventListener(Events.OK, this.onOKSubmit);
            this.dialog.addEventListener(Events.CANCEL, this.onCancelSubmit);
            this.dialog.show('Drink Machine - Payment', `<p>Not sufficient change in the inventory</p>`, 'OK', 'Cancel');


        } else {
            if (isValid) {
                //this.dispatchEvent(new Event(Events.SAVE));

                const orderDetailDialog = this.getOrderDetaillMessage();
                const orderTotalDialog = this.getOrderTotalMessage();

                let changeDialog = '';
                if (change.shouldReturnChange) {
                    changeDialog = this.getChangeMessage(change);
                    changeDialog = `<p><strong>Your change is:</strong> ${changeDialog}</p>`
                }

                this.dialog.addEventListener(Events.OK, this.onOKSubmit);
                this.dialog.addEventListener(Events.CANCEL, this.onCancelSubmit);
                this.dialog.show('Drink Machine - Payment', `<p> <strong>Order detail:</strong> ${orderDetailDialog}</p> <p><strong>Your order total is:</strong> ${orderTotalDialog} </p> <p>${changeDialog}</p>`, 'OK', 'Cancel');
            }
        }

        return false;
    }

    getOrderDetaillMessage = () => {
        let message = '';
        let cost = 0;
        this._drinkInputs.forEach(drinkInput => {
            if (drinkInput.drinkAmount.value > 0) {
                cost = drinkInput.cost * drinkInput.drinkAmount.value;
                message += `<p>${drinkInput.drinkAmount.value} ${drinkInput.name} with a value of ${cost} cents.</p>`;
            }
        });
        return message;
    }

    onOKSubmit = e => {
        console.log('---- onOKSubmit');
        this.dialog.removeEventListener(Events.OK, this.onOKSubmit);
        this.dialog.removeEventListener(Events.CANCEL, this.onCancelSubmit);


        this.getUpdatedDrinks();
        console.log('---- onOKSubmit, this._drinksUpdated', this._drinksUpdated);
        this.dataHandler.addEventListener(Events.COMPLETE, this.onUpdateDrinksComplete);
        this.dataHandler.put('/Drinks/Update', this._drinksUpdated);

        return false;
    }

    onUpdateDrinksComplete = e => {
        this.dataHandler.removeEventListener(Events.COMPLETE, this.onUpdateDrinksComplete);

        // we sort back the coins
        this._coinsUpdated.sort((a, b) => a.index - b.index);
        // we update the coins in the BE
        this.dataHandler.addEventListener(Events.COMPLETE, this.onUpdateCoinsComplete);
        this.dataHandler.put('/Coins/Update', this._coinsUpdated);
    }

    onUpdateCoinsComplete = e => {
        this.dataHandler.removeEventListener(Events.COMPLETE, this.onUpdateCoinsComplete);

        this.clear();
        // we call the coins again
        this.dataHandler.addEventListener(Events.COMPLETE, this.onCoinsGetComplete);
        this.dataHandler.get('/Coins/GetAll');
    }

    onCancelSubmit = e => {
        console.log('---- onCancelSubmit');
        this.dialog.removeEventListener(Events.OK, this.onOKSubmit);
        this.dialog.removeEventListener(Events.CANCEL, this.onCancelSubmit);
        return false;
    }

    onCoinsGetComplete = e => {
        this.dataHandler.removeEventListener(Events.COMPLETE, this.onCoinsGetComplete);
        const data = this._coins = this.dataHandler.data;
        console.log('---- onCoinsGetComplete, data', data);


        let coinInput;
        let div;
        data.forEach(coindata => {
            div = document.createElement('div');
            this.coinInputs.appendChild(div);
            coinInput = new CoinInput(div, coindata.name);
            coinInput.centsEquivalent = coindata.centsEquivalent;
            coinInput.addEventListener(Events.CHANGED, this.onChangeCoinInput);
            this._coinInputs.push(coinInput);
        });

        // sort DESC coins by centsEquivalent
        this._coins.forEach((coin, index) => {
            coin.index = index;
        })
        this._coins.sort((a, b) => b.centsEquivalent - a.centsEquivalent);

        this.dataHandler.addEventListener(Events.COMPLETE, this.onDrinksGetComplete);
        this.dataHandler.get('/Drinks/GetAll');

    }

    onChangeCoinInput = e => {
        console.log('---- DrinkMachineForm, onChangeCoinInput');
        this._totalPayCoins = 0;
        this._coinInputs.forEach(coinInput => {
            this._totalPayCoins += (coinInput.centsEquivalent * coinInput.coinInput.value);
        });
        console.log('---- DrinkMachineForm, onChangeCoinInput, _totalPayCoins: ', this._totalPayCoins);

        this.disableSubmitIfCostIsZero();

        this.paymentTotalEl.innerHTML = `${this._totalPayCoins} cents`
    }

    onDrinksGetComplete = e => {
        this.dataHandler.removeEventListener(Events.COMPLETE, this.onDrinksGetComplete);

        const data = this._drinks = this.dataHandler.data;
        console.log('---- onDrinksGetComplete, data', data);

        let drinkInput;
        let div;
        let totalDrinks = 0;
        data.forEach((drinkData, index) => {
            div = document.createElement('div');
            this.drinkInputs.appendChild(div);
            drinkInput = new DrinkInput(div, drinkData.name, drinkData.quantityAvailable, drinkData.cost);
            drinkInput.index = index;
            drinkInput.name = drinkData.name;
            drinkInput.cost = drinkData.cost;
            drinkInput.addEventListener(Events.CHANGED, this.onChangeDrinkAmount);
            totalDrinks += drinkData.quantityAvailable;
            this._drinkInputs.push(drinkInput);
        });
        this._drinks.forEach((drink, index) => {
            drink.index = index;
        })

        if (totalDrinks === 0) {
            submitEl.classList.add('disabled');
        } else {
            this.disableSubmitIfCostIsZero();
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
            console.log('---- DrinkMachineForm, onChangeDrinkAmount, drinkInput.drinkAmount.disabled', drinkInput.drinkAmount.classList.contains('disabled'));
            if(!drinkInput.drinkAmount.classList.contains('disabled')){
                this._totalCostDrinks += (drinkInput.cost * drinkInput.drinkAmount.value);
            }
        });
        console.log('---- DrinkMachineForm, onChangeDrinkAmount, _totalCostDrinks: ', this._totalCostDrinks);

        this.disableSubmitIfCostIsZero();

        this.orderTotalEl.innerHTML = this.getOrderTotalMessage();
    }

    getOrderTotalMessage = () => {
        let orderTotal;
        if (this._totalCostDrinks >= 100) {
            orderTotal = `${this._totalCostDrinks / 100} dollars`;
        } else {
            orderTotal = `${this._totalCostDrinks} cents`;
        }
        return orderTotal;
    }

    getChangeMessage = changeData => {
        const change = changeData.change;
        let message = '';
        change.forEach(changeItem => {
            message += `<p>${changeItem.amount} ${changeItem.name} </p>`
        });
        return message;
    }

    disableSubmitIfCostIsZero = () => {
        if ((this._totalCostDrinks > 0) && (this._totalPayCoins > 0) && (this._totalPayCoins >= this._totalCostDrinks)) {
            submitEl.classList.remove('disabled');
        } else {
            submitEl.classList.add('disabled');
        }
    }

    getChangeCoins = () => {
        let changeResult = { shouldReturnChange: false, change: null, difference: 0 };
        let change = [];
        let difference = 0;
        if ((this._totalCostDrinks > 0) && (this._totalPayCoins > 0) && (this._totalPayCoins >= this._totalCostDrinks)) {

            changeResult.shouldReturnChange = this._totalPayCoins > this._totalCostDrinks;
            // calculate change
            if (changeResult.shouldReturnChange) {
                // no change
                difference = this._totalPayCoins - this._totalCostDrinks;

                console.log('---- this._totalPayCoins', this._totalPayCoins);
                console.log('---- this._totalCostDrinks', this._totalCostDrinks);
                console.log('---- difference', difference);
                console.log('---- coins sorted', this._coins);
                this._coinsUpdated = this._coins.slice();// copy the coins
                this._coinsUpdated.forEach(coin => {
                    if (coin.amount > 0) { // if no coins we can no provide change of this type
                        const timesToSubstract = Math.floor(difference / coin.centsEquivalent); // ignore remainder
                        // check if difference is big enough to pay in this coin
                        if (timesToSubstract > 0) {
                            console.log('---- timesToSubstract', timesToSubstract);
                            const coinAmountToSubstract = timesToSubstract * coin.centsEquivalent;
                            difference -= coinAmountToSubstract;

                            // remove the coins we provide as change
                            coin.amount -= timesToSubstract;

                            let changeCoin = {
                                name: coin.name,
                                amount: timesToSubstract
                            }
                            change.push(changeCoin);
                        }
                    }
                });

            }
        }
        changeResult.change = change;
        changeResult.difference = difference;
        return changeResult;
    }

    getUpdatedDrinks = () => {
        this._drinksUpdated = this._drinks.slice();// copy the drinks

        console.log('---- getUpdatedDrinks, this._drinksUpdated: ', this._drinksUpdated);
        console.log('---- getUpdatedDrinks, this._drinkInputs: ', this._drinkInputs);
        let drinkInput;
        this._drinksUpdated.forEach(drinkUpdated => {
            drinkInput = this._drinkInputs.filter(input => {
                return input.index === drinkUpdated.index;
            });
            console.log('---- getUpdatedDrinks, drinkInput: ', drinkInput);
            drinkUpdated.quantityAvailable -= drinkInput[0].drinkAmount.value;
        });
        return this._drinksUpdated;
    }
}
