'use strict';

import Events from './Events.js';

export default class DataHandler extends EventTarget{
    constructor(){
        super();
        this.data = null;
        this.xhr =  new XMLHttpRequest();
        this.status = null;
    }

    get(url) {
        this.xhr.open('GET', url, true);
        this.xhr.responseType = 'json';
        this.xhr.onload = this.onLoadXHR.bind(this);
        this.xhr.send();
    };

    post(url, data){
        this.xhr.open('POST', url, true);
        this.xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        this.xhr.onload = this.onLoadXHR.bind(this);
        this.xhr.send(JSON.stringify(data));
    }

    put(url, data){
        this.xhr.open('PUT', url, true);
        this.xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        this.xhr.onload = this.onLoadXHR.bind(this);
        this.xhr.send(JSON.stringify(data));
    }

    delete(url){
        this.xhr.open('DELETE', url, true);
        this.xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        this.xhr.onload = this.onLoadXHR.bind(this);
        this.xhr.send();
    }

    onLoadXHR() {
        this.status = this.xhr.status;
        if (status === 200) {
            this.onLoadJSON(null, this.xhr.response);
        } else {
            this.onLoadJSON(status, this.xhr.response);
        }
    }

    onLoadJSON(err, data) {
        console.log(data);
        console.log(this.xhr.url);
        if (err) {
            this.dispatchEvent(new Event(Events.ERROR));
        } else {
            this.data = data;
            this.dispatchEvent(new Event(Events.COMPLETE));
        }
    }
};
