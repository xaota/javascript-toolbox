import Channel from './channel.js';

/**
  * @typedef {import("./Channel.js").EventFilter} EventFilter
  * @typedef {import("./Channel.js").EventListener} EventListener
  */

/** Шина обмена событиями @browser @custom-events @event-driven @bus @sub @channel
  *
  */
  export default class BrowserEventChannel extends Channel {
  /** {BrowserEventChannel} создание инстанса @constructor
    * @param {string} name название канала
    * @param {boolean} singleton если установлен, запрещает создать новый инстанс, если уже есть созданный с таким флагом
    */
    constructor(name = 'default', singleton = true) {
      super(new EventTarget(), name, singleton);
    }

  /** Добавление подписчика на событие / on @addEventListener
    * @param {string} event название события
    * @param {EventListener} callback обработчик события
    * @param {Object|Boolean} options характеристики обработчика
    * @return {BrowserEventChannel} шина@this
    */
    on(event, callback, options = false) {
      const listener = e => callback(e.detail);
      /** @type {EventTarget} */
      const channel = this.channel;
      channel.addEventListener(event, listener, options);
      return this;
    }

  /** Фильтр подписки на событие / filter
    * @param {string} event название события
    * @param {EventFilter} filter правила выбора события
    * @param {EventListener} callback обработчик события
    * @param {Object|Boolean} options характеристики обработчика
    * @return {BrowserEventChannel} шина@this
    */
    filter(event, filter, callback, options = false) {
      const listener = e => filter(e, event) && callback(e);
      return this.on(event, listener, options);
    }

  /** Удаление подписчика на событие / off @removeEventListener @TODO:
    * @param {string} event название события
    * @param {EventListener} listener обработчик события {Function}
    * @param {Object|Boolean} options характеристики обработчика
    * @return {BrowserEventChannel} шина@this
   */
    off(event, listener, options = false) {
      this.channel.removeEventListener(event, listener, options);
      return this;
    }

  /** Добавление одноразового подписчика на событие / on / once @addEventListener
    * @param {string} event название события
    * @param {EventListener} listener обработчик события
    * @return {BrowserEventChannel} шина@this
    */
    once(event, listener) {
      return this.on(event, listener, { once: true });
    }

  /** Отправка события в шину (запуск обработчиков) / send @dispatchEvent
    * @param {string} event название события
    * @param {any} detail параметры события
    * @return {BrowserEventChannel} шина@this
    */
    send(event, detail = null) {
      this.channel.dispatchEvent(new CustomEvent(event, { detail }));
      return this;
    }

  /** Отправка события в шину (асинхронный запуск обработчиков) / async @dispatchEvent
    * @param {string} event название события
    * @param {any} detail параметры события
    * @param {number} cooldown количество милисекунд перед отправкой
    * @return {BrowserEventChannel} шина@this
    */
    async(event, detail = null, cooldown = 0) {
      setTimeout(_ => this.send(event, detail), cooldown);
      return this;
    }
  }
