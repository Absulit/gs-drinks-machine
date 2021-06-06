'use strict';

/**
 * Extracts Ids from the `el` (DOM element) and / or template to automatically
 * create properties for easy handling.
 */
export default class Identifier extends EventTarget {
    /**
     * @param {Element} el Element in the `DOM` where you want to assign the template.
     * @param {string} templatePath Path to `HTML` file.
     */
    constructor(el, templatePath) {
        super();
        this._template = null;
        this._templatePath = templatePath;
        this.el = el;

        if (this._templatePath) {
            this._template = document.createElement('template');
            fetch(this._templatePath)
                .then(stream => stream.text())
                .then(text => this._onLoadTemplate(text));
        } else {
            console.warn('If you are using a template, you must set the `templatePath` value in super(el, templatePath)');
            this._assignIdsToProperties();
        }
    }

    _onLoadTemplate = text => {
        this._template.innerHTML = text;
        this.el.appendChild(this._template.content.cloneNode(true));
        this._assignIdsToProperties();
    }

    _assignIdsToProperties = () => {
        const _ids = this.el.querySelectorAll('*[id]:not([id=""])');
        _ids.forEach(element => {
            console.log(element.id);
            this[element.id] = element
        });
        this.init();
    }

    /**
     * Overridable method.
     * It should be called to access the newly created properties.
     */
    init = () => {
        console.error('init not implemented in', this.constructor.name);
        console.trace();
    }

    dispatch = eventName => {
        this.dispatchEvent(new Event(eventName));
    }
}
