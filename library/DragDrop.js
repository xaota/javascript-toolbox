import {getDomPath} from './dom.js';

/** */
  export default class DragDrop {
  /** */
    constructor(element, self = false) {
      this.element  = element;
      this.callback = {};

      if (self) {
        this.element.draggable = true;
        this.element.dropzone  = true;
      }

      DragDrop.event(this, 'dragstart', dragstart);
      DragDrop.event(this, 'dragenter', dragenter);
      DragDrop.event(this, 'dragover',  dragover);
      DragDrop.event(this, 'dragleave', dragleave);
      DragDrop.event(this, 'drop',      drop);
      DragDrop.event(this, 'dragend',   dragend);
    }

  /** */
    start(callback) {
      return this.action('dragstart', callback);
    }

  /** */
    enter(callback) {
      return this.action('dragenter', callback);
    }

  /** */
    over(callback) {
      return this.action('dragover', callback);
    }

  /** */
    leave(callback) {
      return this.action('dragleave', callback);
    }

  /** */
    drop(callback) {
      return this.action('drop', callback);
    }

  /** */
    end(callback) {
      return this.action('dragend', callback);
    }

  /** */
    action(name, callback) {
      this.callback[name] = callback;
      return this;
    }

  /** */
    static event(item, event, listener) {
      item.element.addEventListener(event, handler, false);

      /** */
      function handler(e) {
        const result = listener.call(item.element, e);
        const handler = item.callback[event];
        if (handler) handler.call(item, e, result);
      }
    }
  }

// #region [Private]
  /** */
    function dragstart(e) {
      const selector = getDomPath(this);
      e.dataTransfer.setData('selector', selector);
      e.dataTransfer.effectAllowed = 'move';
    }

  /** */
    function dragenter(e) {}

  /** */
    function dragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
      return false;
    }

  /** */
    function dragleave(e) {}

  /** */
    function drop(e) {
      e.stopPropagation(); // stops the browser from redirecting.
      e.preventDefault();
      const selector = e.dataTransfer.getData('selector');
      return selector
        ? document.querySelector(selector)
        : null;
    }

  /** */
    function dragend() {}
// #endregion
