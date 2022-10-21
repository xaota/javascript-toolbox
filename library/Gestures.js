import DOM from './DOM.js';
import Vector from 'javascript-algebra/library/Vector.js';

/** Жесты */
  export default class Gestures {
  /** */
    #previous = 0;

    static cooldown = 300;

  /** */
    #afterTimeout = null;

  /** */
    constructor(element) {
      this.element  = element;
      this.callback = {};

      Gestures.event(this, 'wheel',        wheel);
      Gestures.event(this, 'gesturestart', gesturestart);
    }

  /** */
    before(callback) {
      return this.action('before', callback);
    }

  /** */
    after(callback) {
      return this.action('after', callback);
    }

  /** */
    translate(callback) {
      return this.action('translate', callback);
    }

  /** */
    scale(callback) {
      return this.action('scale', callback);
    }

  /** */
    rotate(callback) {
      return this.action('rotate', callback);
    }

  /** event @static */
    static event(item, event, listener) {
      item.element.addEventListener(event, handler, {passive: false, capture: false});

      /** */
      function handler(e) {
        e.preventDefault(); // - passive!
        if (item.#afterTimeout) clearTimeout(item.#afterTimeout);

        const current = new Date().valueOf();
        const repeat = current - item.#previous <= Gestures.cooldown;
        item.#previous = current;

        listener.call(item, e, repeat);

        item.#afterTimeout = setTimeout(() => {
          item.callback.after?.call(item.element);
        }, Gestures.cooldown);

        return false;
      }
    }

  /** */
    action(name, callback) {
      this.callback[name] = callback;
      return this;
    }
  }

// #region [Private]
/** Обработка жестов через события мыши / wheel
  * @param {Event} event событие
  * @param {boolean} repeat продолжение жеста
  * @this {Gestures}
  */
  function wheel(event, repeat) {
    const root     = this.element;
    const callback = this.callback;
    const meta = {
      rotation: 0,
      scale:    Vector.one,
      origin: Vector.from(event.x, event.y)
    };
    // console.log(event);

    if (!repeat && callback.before) {
      const start = callback.before.call(root, meta);
      Object.assign(meta, start);
    }

    const scale     = callback.scale && event.ctrlKey;
    const rotate    = callback.rotate && event.shiftKey;
    const translate = callback.translate && !scale && !rotate;

    const delta = Vector.from(event.deltaX, event.deltaY);

    if (scale) {
      callback.scale({ repeat, origin: meta.origin, scale: meta.scale.difference(Vector.one.scale(event.deltaY * 0.01)) });
    } else if (rotate) {
      callback.rotate({ repeat, origin: meta.origin, rotation: meta.rotation - event.deltaY / 100 });
    } else if (translate) {
      callback.translate({ repeat, origin: meta.origin, difference: delta });
    }
  }

/** Обработка жестов через события трекпада / gesturestart
  * @param {Event} event событие
  // * @param {boolean} repeat продолжение жеста (неактуально)
  * @this {Gestures}
  */
  function gesturestart(event) {
    console.log("gesturestart", event);

    const root     = this.element;
    const callback = this.callback;
    const coords   = DOM.coords(root);
    const position = Vector.from(event.pageX - coords.left, event.pageY - coords.top);
    const meta = {
      position,
      previous  : position,
      current   : position,
      difference: Vector.zero,
      rotation  : 0,
      scale     : 1
    };

    if (callback.before) {
      const start = callback.before.call(root, meta);
      Object.assign(meta, start);
    }

    root.addEventListener("gesturechange", change, false);
    root.addEventListener("gestureend",    end,    false);

    /**
      * @param {GestureEvent} ev событие
      * @return {Boolean} false
      */
    function change(ev) {
      ev.preventDefault();
      const current = Vector.from(ev.pageX - coords.left, ev.pageY - coords.top);

      const data = {
        origin    : meta.position,
        previous  : meta.previous,
        current,
        difference: meta.previous.difference(current)
      };

      if (callback.translate) callback.translate(data);
      if (callback.rotate)    callback   .rotate({rotation: meta.rotation + ev.rotation});
      if (callback.scale)     callback    .scale({scale: Vector.from(meta.scale.x * ev.scale, meta.scale.y * ev.scale)});

      meta.previous = current;
      return false;
    }

    /** */
    function end(ev) {
      ev.preventDefault();
      root.removeEventListener("gesturechange", change, false);
      root.removeEventListener("gestureend",    end,    false);
      // callback.after
      return false;
    }
  }
// #endregion
