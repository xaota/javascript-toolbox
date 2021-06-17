/** Locator (need override)
  */

/** {Locator} DI @class @export @default
  *
  */
  export default class Locator {
  /** {any} */
    #services = {};

  /** {Locator} DI @constructor
    */
    constructor(services) {
      this.services = services;
    }

  /** @section services setting */
  /** */
    set services(services) {
      Object.assign(this.#services, services);
    }

  /** */
    set(name, service) {
      this.#services[name] = service;
      return this;
    }

  /** */
    get(name) {
      return this.#services[name];
    }
  }
