/** Store-Context API {Context} @class
  * @template {object} T
  */
  export default class Context {
  /** @type {string} */
    #name;

  /** @type {T} */
    #data = null

  /** @constructor
    * @param {string} name название контекста
    * @param {T} value значение по-умолчанию
    * @param {Function} init ко
    */
    constructor(name = "context", value = null, init = undefined) {
      this.#name = name;
      this.#data = value;
    }

  /** @return {string} Название контекста */
    get name() {
      return this.#name;
    }

  /** */

  }
