/** Работа с ресурсами {Asset} @class
  */
  export default class Asset {
  /** */
    static async load(path) {
      return await fetch(path);
    }

  /** */
    static async text(path) {
      return Asset.load(path).then(r => r.text());
    }

  /** */
    static async image(path) {
      // ...
    }

  /** */
    static async svg(path) {
      const SVG = await Asset.text(path);
      const fragment = document.createElement('template');
      fragment.innerHTML = SVG.trim();
      const svg = fragment.content.querySelector('svg'); // firstChild;
      return svg;
    }
  }
