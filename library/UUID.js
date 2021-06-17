/** Генерация UUID @unsafe
  * @return {string} uuid
  */
  export default class UUID {
  /** @type {string} */
    #value;

  /** */
    constructor(value) {
      const temp = value || random();
      const valid = UUID.valudate(temp);
      if (!valid) throw new Error(`Invalid UUID value '${temp}'`);
      this.#value = temp;
    }

  /** */
    get value() {
      return this.#value;
    }

  /** */
    compare(uuid) {
      return this.value === uuid?.value;
    }

  /** */
    static is(value) {
      return value instanceof UUID;
    }

  /** */
    static valudate(uuid) {
    /** @type {string} */
      const value = (UUID.is(uuid) ? uuid.value : uuid).toLowerCase();
      const splitters = [8, 13, 18, 23];
      const dividers = splitters.map(c => value.charAt(c)).every(c => c === '-');
      const content = /^[0-9a-f\-]+$/.test(value);
      return dividers && content;
    }

  /** */
    static random() {
      const value = random();
      return new UUID(value);
    }

  /** */
    static zero() {
      const value = zero();
      return new UUID(value);
    }
  }

// #region [Private]
/** */
  function s4() {
    const number = (1 + Math.random()) * 0x10000;
    return Math
      .floor(number)
      .toString(16)
      .substring(1);
  }

/** */
  function z4() {
    return '0000';
  }

/** */
  function random() {
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  }

/** */
  function zero() {
    return `${z4()}${z4()}-${z4()}-${z4()}-${z4()}-${z4()}${z4()}${z4()}`;
  }
// #endregion
