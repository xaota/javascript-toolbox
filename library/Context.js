/** {Context} @class
  * setState(state => reducer(state, action))
  * @template {object} T
  */
  export default class Context {
  /** @type {string} */
    #name;

  /** @type {T} */
    #data = null

  /** @type {object} */
    #actions = {}

  /** @type {Array<Function>} */
    #handlers = [];

  // /** */
  //   #reducer = (state, value, action) => {
  //     this.#data = value;
  //   }


  /** @constructor
    * @param {string} name название контекста
    * @param {T} value значение по-умолчанию
    * @param {Function} init ко
    */
    constructor(name = "context", value = null, init = undefined) {
      this.#name = name;
      this.#data = value;
      if (init) {
        this.#data = init(this.#data);
        this.handlers();
      }
    }

  /** @return {string} Название контекста */
    get name() {
      return this.#name;
    }

  /** */
    dispatch(value, action) {
      if (action) {
        this.#actions[action]?.(this.#data, value);
      } else {
        this.#data = value;
      }
      return this.handlers();
    }

  /** */
    action(name, reducer) {
      this.#actions[name] = reducer;
      return this;
    }

  /** */
    on(handler) {
      this.#handlers.push(handler);
      return this;
    }

  /** */
    off(handler) {
      const index = this.#handlers.indexOf(handler);
      this.#handlers.splice(index, 1);
      return this;
    }

  /** */
    handlers() {
      this.#handlers.forEach(handler => handler?.());
      return this;
    }

  /**
    * @param {Array<string>} path селектор
    * @return {T} стор
    */
    store(...path) {
      let root = this.#data;
      let index = 0;
      while (index < path.length) {
        const item = path[index++];
        if (!item) break;
        root = root[item];
        if (!root) break; // !
      }
      return root;
    }

  /**
    * @param {Function} selector функция для выбора значения
    * @return {T} стор
    */
    select(selector = undefined) {
      if (!selector) return this.#data;
      return selector(this.#data);
    }
  }
