# gs-drinks-machine


## application
Application is a Web Core MVC with endpoints and vanilla Javascript

Solution is located in  [/DrinksMachine](https://github.com/Absulit/gs-drinks-machine/tree/main/DrinksMachine) directory

## data
No DB, data is stored temporarly on a Session for 24h.
If the app is restarted the data is restored.

## controllers
Three controllers One for the pages/views, two others to GET and UPDATE data from the Session

- HomeController
- CoinsController
- DrinksController

## models
- Coin
- Drink

## interface
Used Spectre for css https://picturepan2.github.io/spectre since it doesn't use Javascript (I'm not using Bootstrap nor jQuery, just Spectre and Vanilla JS)

Used vanilla Javascript for custom components and interactivity.

Data is requested via endpoints from the BE and loaded into the interface.

Temporarly data is stored in Javascript until the purchase and only updated (sent to the BE) if the user accepts the purchase.

Change is calculated by substracting first the coins of higher value and if there's coin of that type available, if not it will continue with the next on higher value.

Since the interface is blocked (elements disabled) I have not added the message "Drink is sold out, your purchase cannot be processed" because after the interface is updated, if the drink is sold out, the amount is `0` and it contradicts the previous instruction "Validate there are available drinks in the machine, if not, the purchase input should be disabled".

After a purchase both `Coins` and `Drinks` data are sent to the BE via the endpoints

To test the "Not sufficient change in the inventory" you can use the CoinsController and set all the `Amounts` to `0`

## endpoints available 

### GET
- https://localhost:44356/Coins/GetAll
- https://localhost:44356/Drinks/GetAll

### PUT
- https://localhost:44356/Coins/Update
- https://localhost:44356/Drinks/Update

## js components
I've created custom components and are placed in `wwwroot/js/components`

- coin-input
- drink-input
- dialog

- drink-machine-form (the main code)

## js utils
Classes I already have from a custom project

- DataHandler
- Events
- Identifier


[Sebastián Sanabria Díaz](http://absulit.com)


[@absulit](https://github.com/Absulit)
