import { EventEmitter } from 'events';
import Channel from './channel.js';

/**
  * @typedef {import("./Channel.js").EventFilter} EventFilter
  * @typedef {import("./Channel.js").EventListener} EventListener
  */

/** Шина обмена событиями @nodejs @custom-events @event-driven @bus @sub @channel
  *
  */
  export default class NodeEventChannel extends Channel {
  /** {NodeEventChannel} создание инстанса @constructor
    * @param {string} name название канала
    * @param {boolean} singleton если установлен, запрещает создать новый инстанс, если уже есть созданный с таким флагом
    */
    constructor(name = 'default', singleton = true) {
      super(new EventEmitter(), name, singleton);
    }

  /** Добавление подписчика на событие / on @addEventListener
    * @param {String} event название события
    * @param {Function} callback обработчик события
    * @return {NodeEventChannel} шина@this
    */
    on(event, callback) {
      const listener = e => callback(e.detail);
      this.channel.addListener(event, listener);
      return this;
    }

  /** Фильтр подписки на событие / filter
    * @param {string} event название события
    * @param {EventFilter} filter правила выбора события
    * @param {EventListener} callback обработчик события
    * @return {NodeEventChannel} шина@this
    */
    filter(event, filter, callback) {
      const listener = e => filter(e, event) && callback(e);
      return this.on(event, listener);
    }

  /** Удаление подписчика на событие / off @removeEventListener @TODO:
    * @param {String} event название события
    * @param {EventListener} listener обработчик события
    * @return {NodeEventChannel} шина@this
    */
    off(event, listener) {
      this.channel.removeListener(event, listener);
      return this;
    }

  /** Добавление одноразового подписчика на событие / on / once @addEventListener
    * @param {string} event название события
    * @param {EventListener} listener обработчик события
    * @return {NodeEventChannel} шина@this
    */
    once(event, listener) {
      this.channel.once(event, listener);
      return this;
    }

  /** Отправка события в шину (запуск обработчиков) / send @dispatchEvent
    * @param {string} event название события
    * @param {any} detail параметры события
    * @return {NodeEventChannel} шина@this
    */
    send(event, detail = null) {
      this.channel.emit(event, { detail });
      return this;
    }

  /** Отправка события в шину (асинхронный запуск обработчиков) / async @dispatchEvent
    * @param {string} event название события
    * @param {any} detail параметры события
    * @param {number} cooldown количество милисекунд перед отправкой
    * @return {NodeEventChannel} шина@this
    */
    async(event, detail = null, cooldown = 0) {
      setTimeout(_ => this.send(event, detail), cooldown);
      return this;
    }
}
