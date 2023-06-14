/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
}

Rectangle.prototype.getArea = function lol() {
  return this.width * this.height;
};


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  return Object.create(proto, Object.getOwnPropertyDescriptors(obj));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Selector {
  constructor(selector) {
    this.selector = [selector];
  }

  element(value) {
    this.validate('element');
    this.selector.push({ type: 'element', value });
    return this;
  }

  id(value) {
    this.validate('id');
    this.selector.push({ type: 'id', value });
    return this;
  }

  class(value) {
    this.validate('class');
    this.selector.push({ type: 'class', value });
    return this;
  }

  attr(value) {
    this.validate('attr');
    this.selector.push({ type: 'attr', value });
    return this;
  }

  pseudoClass(value) {
    this.validate('pseudo-class');
    this.selector.push({ type: 'pseudo-class', value });
    return this;
  }

  pseudoElement(value) {
    this.validate('pseudo-element');
    this.selector.push({ type: 'pseudo-element', value });
    return this;
  }

  stringify() {
    return this.selector.reduce((acc, el) => {
      switch (el.type) {
        case 'element':
          return acc + el.value;
        case 'id':
          return `${acc}#${el.value}`;
        case 'class':
          return `${acc}.${el.value}`;
        case 'attr':
          return `${acc}[${el.value}]`;
        case 'pseudo-class':
          return `${acc}:${el.value}`;
        case 'pseudo-element':
          return `${acc}::${el.value}`;
        default:
          return acc;
      }
    }, '');
  }

  validate(type) {
    if (type === 'element' || type === 'id' || type === 'pseudo-element') {
      if (this.selector.find((el) => el.type === type)) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
    }

    const correctOrder = ['element', 'id', 'class', 'attr', 'pseudo-class', 'pseudo-element'];
    const index = correctOrder.indexOf(this.selector[this.selector.length - 1].type);
    if (correctOrder.indexOf(type) < index) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new Selector({ type: 'element', value });
  },

  id(value) {
    return new Selector({ type: 'id', value });
  },

  class(value) {
    return new Selector({ type: 'class', value });
  },

  attr(value) {
    return new Selector({ type: 'attr', value });
  },

  pseudoClass(value) {
    return new Selector({ type: 'pseudo-class', value });
  },

  pseudoElement(value) {
    return new Selector({ type: 'pseudo-element', value });
  },

  combine(sel1, combinator, sel2) {
    return {
      sel1,
      sel2,
      combinator,
      stringify() {
        return `${this.sel1.stringify()} ${this.combinator} ${this.sel2.stringify()}`;
      },
    };
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
