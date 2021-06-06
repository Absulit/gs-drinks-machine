'use strict';

import Events from '../../Events.js';
import Identifier from '../../Identifier.js';

export default class Dialog extends Identifier {
    constructor(el) {
        super(el, import.meta.url + '/../dialog.html');
    }

    init = () => {
        this.actionBtnEl.addEventListener('click', this.onClickAction);
        this.cancelBtnEl.addEventListener('click', this.onClickCancel);
        this.closeBtnEl.addEventListener('click', this.onClickCancel);
    }

    show = (title, caption, actionText, cancelText) => {
        this.titleEl.innerHTML = title;
        this.captionEl.innerHTML = caption;
        this.actionBtnEl.innerHTML = actionText;
        this.cancelBtnEl.innerHTML = cancelText;
        this.dialogEl.classList.add('active');
    }

    close = () => {
        this.dialogEl.classList.remove('active');
    }

    onClickAction = e => {
        console.log('OK');
        this.dialogEl.classList.remove('active');
        this.dispatchEvent(new Event(Events.OK));
    }

    onClickCancel = e => {
        console.log('CANCEL');
        this.dialogEl.classList.remove('active');
        this.dispatchEvent(new Event(Events.CANCEL));
    }
}