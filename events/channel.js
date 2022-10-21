/**
  * @typedef {object} EventProvider
  * @typedef {(...args: any[]) => void} EventListener обработчик события
  * @typedef {(e: Event, type: string) => boolean} EventFilter фильтр событий
  */

/** Шина обмена событиями @base
  *
  */
  export default class Channel {
  /** @type {Channel} */
    static instance;

  /** @type {string} */
    #name;

  /**
    * @type {EventProvider}
    */
    #channel;

  /** {EventsChannel} создание инстанса @constructor
    * @param {EventProvider} channel канал передачи сообщений
    * @param {string} name название канала
    * @param {boolean} singleton если установлен, запрещает создать новый инстанс, если уже есть созданный с таким флагом
    */
    constructor(channel, name = 'default', singleton = true) {
      const instance = singleton === true && Channel.instance && Channel.instance instanceof Channel;
      if (instance) return Channel.instance;
      if (singleton === true) Channel.instance = this;
      this.#name = name;
      this.#channel = channel;
    }

  /** Название канала / name
    * @readonly
    * @return {string} канал
    */
    get name() {
      return this.#name;
    }

  /** Канал передачи событий / channel
    * @readonly
    * @return {EventProvider} канал
    */
    get channel() {
      return this.#channel;
    }

  /** Добавление подписчика на событие / on @addEventListener
    * @param {string} event название события
    * @param {EventListener} callback обработчик события
    * @param {Object|Boolean} options характеристики обработчика
    * @return {Channel} шина@this
    */
    on(event, callback, options = false) {
      error('on', { event, callback, options });
      return this;
    }

  /** Фильтр подписки на событие / filter
    * @param {string} event название события
    * @param {EventFilter} filter правила выбора события
    * @param {EventListener} callback обработчик события
    * @param {Object|Boolean} options характеристики обработчика
    * @return {Channel} шина@this
    */
    filter(event, filter, callback, options = false) {
      error('filter', { event, filter, callback, options });
      return this;
    }

  /** Удаление подписчика на событие / off @removeEventListener @TODO:
    * @param {string} event название события
    * @param {EventListener} listener обработчик события
    * @param {Object|Boolean} options характеристики обработчика
    * @return {Channel} шина@this
    */
    off(event, listener, options = false) {
      error('off', { event, listener, options });
      return this;
    }

  /** Добавление одноразового подписчика на событие / on / once @addEventListener
    * @param {string} event название события
    * @param {EventListener} listener обработчик события
    * @return {Channel} шина@this
    */
    once(event, listener) {
      error('once', { event, listener });
      return this;
    }

  /** Отправка события в шину (запуск обработчиков) / send @dispatchEvent
    * @param {string} event название события
    * @param {any} detail параметры события
    * @return {Channel} шина@this
    */
    send(event, detail = null) {
      error('send', { event, detail });
      return this;
    }

  /** Отправка события в шину (асинхронный запуск обработчиков) / async @dispatchEvent
    * @param {string} event название события
    * @param {any} detail параметры события
    * @param {number} cooldown количество милисекунд перед отправкой
    * @return {Channel} шина@this
    */
    async(event, detail = null, cooldown = 0) {
      error('async', { event, detail, cooldown });
      return this;
    }
}

// #region [Private]
/** Отображение ошибки реализации методов / error
  * @param {string} method реализуемый метод
  * @param {object} args список аргументов
  */
  function error(method, args) {
    const name = this.name;
    throw new Error(`${name}.${method}(${Object.keys(args).join(', ')}): realisation required!`);
  }
// #endregion
