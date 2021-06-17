/**
  * @typedef {{({ cooldown, timestamp, start }: { cooldown: number, timestamp: number, start: number }): (boolean | void) }} AnimationFrameController
  */

import Vector from 'javascript-algebra/library/Vector.js';

/** */
  export default class Screen {
    #width = 0;
    #height = 0;
    #size = Vector.zero;
    #center = Vector.zero;
    #observed = [];
    #handlers = [];

  /** */
    constructor(root = document.body) {
      this.init();

      const resizeObserver = new ResizeObserver(() => {
        this.init();
        const observed = this.observed;

        for (const item of observed) {
          const node = item.node;
          const handlers = item.handlers;
          handlers.forEach(handler => {
            handler?.call(node, this);
          });
        }

        this.#handlers.forEach(handler => handler.call(root, this));
      });

      resizeObserver.observe(root);
    }

  /** */
    get observed() {
      return this.#observed;
    }

  /** */
    observe(node, handler = node?.resize) {
      const observed = this.observed;
      const index = observed.findIndex(item => item.node === node);
      if (index === -1) {
        const handlers = [];
        if (typeof handler === 'function') {
          handlers.push(handler);
          handler.call(node, this);
        }
        observed.push({ node, handlers });
      } else {
        if (typeof handler === 'function') {
          observed[index].handlers.push(handler);
        }
      }

      return this;
    }

  /** */
    unObserve(node, ...handlers) {
      const observed = this.observed;
      const index = observed.findIndex(item => item.node === node);
      if (index >= 0) {
        if (handlers.length === 0) {
          observed.splice(index, 1);
        } else {
          handlers.forEach(handler => {
            const idx = observed[index].handlers.findIndex(h => h === handler);
            if (idx >= 0) observed[index].handlers.splice(idx, 1);
          });
        }
      }

      return this;
    }

  /** width */
    get width() {
      return this.#width;
    }

  /** height */
    get height() {
      return this.#height;
    }

  /** size */
    get size() {
      return this.#size;
    }

  /** center */
    get center() {
      return this.#center;
    }

  /** onResize */
    onResize(callback) {
      this.#handlers.push(callback);
      return this;
    }

  /** offResize */
    offResize(callbacks) {
      if (callbacks.length === 0) {
        this.#handlers.length = 0;
        return this;
      }

      callbacks.forEach(callback => {
        const index = this.#handlers.indexOf(callback);
        if (index < 0) return this;

        this.#handlers.splice(index, 1);
      });

      return this;
    }

  /** init */
    init() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // const width = document.documentElement.clientWidth;
      // const height = document.documentElement.clientHeight;

      const s = Vector.from(w, h);
      const c = Vector.from(Math.ceil(w / 2.0), Math.ceil(h / 2.0));

      this.#width  = w;
      this.#height = h;
      this.#size   = s;
      this.#center = c;
    }

  /** / pointer @static
    * @param {MouseEvent} event положение курсора мыши
    * @return {Vector} координаты мыши
    */
    static pointer(event) {
      return event
        ? Vector.from(event.pageX, event.pageY)
        : Vector.zero;
    }

  /** / animation @static
   * @param {AnimationFrameController} render контроллер анимации
   */
    static animation(render) {
      const start = performance.now();
      requestAnimationFrame(frame);

    /** */
      function frame(timestamp) {
        const cooldown = timestamp - start;
        const params = { cooldown, timestamp, start };
        const stop = render(params);
        if (stop === false) return;
        requestAnimationFrame(frame);
      }
    }
  }

// /** Отношение размеров двух объектов
//   * @param {Vector} sizeA
//   * @param {Vector} sizeB
//   * @return {number} отношение размеров sizeA к sizeB
//   * @todo / flip / min -> max
//   */
//   export function proportion(sizeA, sizeB) {
//     const hRatio = sizeB.x / sizeA.x;
//     const vRatio = sizeB.y / sizeB.y;
//     return Math.min(hRatio, vRatio);
//   }
