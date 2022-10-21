/** Тулзы для работы с DOM {DOM} @class
  */
  export default class DOM {
  /** */
    static clear(node) {
      while (node.firstChild) node.firstChild.remove();
      return node;
    }

  /** */
    static swap(nodeA, nodeB) {
      const A = nodeA.nextElementSibling;
      const B = nodeB.nextElementSibling;
      const root = nodeA.parentNode;
      root.insertBefore(nodeB, A);
      root.insertBefore(nodeA, B);
    }

  /** */
    static coords(elem) { // кроме IE8-
      const box = elem.getBoundingClientRect();
      return {
        top:  box.top + window.pageYOffset,
        left: box.left + window.pageXOffset
      };
    }

  /** */
    static path(el) {
      if (!el) return;

      const stack = [];
      let isShadow = false;
      while (el.parentNode !== null) {
        // console.log(el.nodeName);
        let sibCount = 0;
        let sibIndex = 0;
        // get sibling indexes
        for (let i = 0; i < el.parentNode.childNodes.length; i++) {
          const sib = el.parentNode.childNodes[i];
          if (sib.nodeName === el.nodeName) {
            if (sib === el) {
              sibIndex = sibCount;
            }
            sibCount++;
          }
        }
        // if ( el.hasAttribute('id') && el.id != '' ) { no id shortcuts, ids are not unique in shadowDom
        //   stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
        // } else
        let nodeName = el.nodeName.toLowerCase();
        if (isShadow) {
          nodeName += '::shadow';
          isShadow = false;
        }
        if (sibCount > 1) {
          stack.unshift(nodeName + ':nth-of-type(' + (sibIndex + 1) + ')');
        } else {
          stack.unshift(nodeName);
        }
        el = el.parentNode;
        if (el.nodeType === 11) { // for shadow dom, we
          isShadow = true;
          el = el.host;
        }
      }
      stack.splice(0, 1); // removes the html element
      return stack.join(' > ');
    }
  }
