// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

'use strict';

import DrinkMachineForm from "./components/drink-machine-form.js";

// Write your JavaScript code.

console.log('---- TEST');

const formContainer = document.getElementById('form-container');

const drinkMachineForm = new DrinkMachineForm(formContainer);
