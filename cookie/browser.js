/** */
export default class Cookie {
  /** */
    static get(name) {
      name = name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1');
      const regexp = new RegExp("(?:^|; )" + name + "=([^;]*)");
      const matches = document.cookie.match(regexp);
      return matches
        ? decodeURIComponent(matches[1])
        : undefined;
    }

  /** */
    static set(name, value, options = {}) {
      value = encodeURIComponent(value);

      let attributes = {path: '/', ...options};
      const expires = attributes.expires;
      if (expires) {
        if (typeof expires === 'number') {
          const date = new Date();
          date.setTime(date.getTime() + expires * 1000);
        }
        attributes.expires = expires.toUTCString();
      }

      attributes = Object
        .entries(attributes)
        .map(([k,v]) => k + '=' + v)
        .join(';');

      if (attributes.length > 0) attributes = ';' + attributes;

      document.cookie = name + '=' + value + attributes;
    }

  /** */
    static remove(name) {
      return Cookie.set(name, {expires: -1});
    }

  // /** */
  //   static toJSON(name) {
  //     const value = Cookie.get(name);
  //     return JSON.parse(value);
  //   }

  // /** */
  //   static fromJSON(name, value, options) {
  //     value = JSON.stringify(value);
  //     return Cookie.set(name, value, options);
  //   }
  }
