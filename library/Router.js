/** Роутер @hash @router @frontend @js @web-components @native
  * @typedef {object} Route Роут
  * @property {string} [name] название роута
  * @property {string} [path] адрес
  * @property {HTMLElement|string} [node] создаваемый компонент или название его тега
  * @property {Function?} [test] проверка, подходит ли роут
  * @property {Function} [handler] обработчик переключения
  * @property {Function} [callback] обработчик результата переключения
  * @property {Router} [nesting] дочерние роуты
  * @property {boolean} [default] рут по-умолчанию
  */

import DOM from './DOM.js';

/** {Router} Роутинг и HistoryApi? @class @export @default
  * @property {object} routes список роутов
  */
  export default class Router {
    /** @type {HTMLElement} */
    #root;

    /** @type {Function} */
    #callback;

  /** Роут по-умолчанию / default @private @field
    * @type {Route}
    */
    #default = undefined;

    /** @type {Array<Route>} */
    #routes = [];

    /** @todo: State */
    /** @todo: History */
    /** @todo: Options */
    /** @todo: Current */

    /** {Router} Роутинг в приложении @constructor
      * @param {HTMLElement} [root] узел для роутов
      * @param {Function} [handler] обработчик смены роута
      */
    constructor(root, handler) {
      this.root = root;
    }

  /** */
    set root(root) {
      this.#root = root;
    }

    /** Добавить роут в список роутов / route
      * @param {Route} route роут
      * @return {Router} #this
      */
    route(route) {
      this.#routes.push(route);
      if (route.default === true) this.#default = route;
      return this;
    }

    /** / name */
    name(name) {
      return this.go({name});
    }

    /** / path */
    path(location) {
      return this.go({location});
    }

    /** / check */
    check(options) {
      const route = this.#routes.find(r => check(r, options));
      return route || this.default;
    }

    /** / go */
    go(options) {
      const route = this.check(options);
      return this.open(route, options);
    }

    /** / open */
    open(route, options, depth = 0) {
      DOM.clear(this.#root);
      if (route !== undefined) {
        const RouteComponent = typeof route.node === 'string' || route.node instanceof String
          ? window.customElements.get(route.node)
          : route.node;

        const element = route.handler
          ? route.handler(options)
          : new RouteComponent();

        this.#root.append(element);
        this.init(element, options, route, depth);
      }
      return this;
    }

    /** / init */
    init(element, options, route, depth) {
      if (route.nesting) {
        route.nesting.root = element;
        const location = (options.location || []).slice(1); // match from options
        route.nesting.start(location);
      }
      if (!options.scroll) window.scrollTo({top: 0}); // !
      route?.callback?.(element, options, route, this);
      element.event?.('component-routing', { route, options, router: this, depth });
      this.#callback?.(route);
      return this;
    }

    callback(callback) {
      this.#callback = callback;
      return this;
    }

    /** / init */
    start(location = new URL(window.location.href).hash.slice(1).split('/')) {
      this.path(location);
      return this;
    }

    /** / clear */
    clear() {
      this.#routes.length = 0;
      this.#default = undefined;
      return this;
    }

    /** @section @fields */
    /** Возвращает Роут по-умолчанию / default @readonly
      * @return {Route} Роут по-умолчанию
      */
    get default() {
      return this.#default;
    }

    /** @section @factory */
    /** */
    static hash(root) {
      const router = new Router(root);

      /**
        * @param {HashChangeEvent} e событие смены урла
        */
        function hashChangeHandler(e) {
          const prevoius = new URL(e.oldURL).hash.slice(1).split('/');
          const location = new URL(e.newURL).hash.slice(1).split('/');
          const options = { location, prevoius };
          router.go(options);
        }

      window.addEventListener('hashchange', hashChangeHandler, false);

      return router;
    }
  }

// #region [Private]
/** / check */
  function check(route, options) {
    if (options.name) return route.name === options.name;
    if (options.location) return options.location.join('/').startsWith(route.path || route.name);
    return false;
  }
 // #endregion
