define('my/shirt', function () {
  /**
     * A module representing a shirt.
     * @exports my/shirt
     */
  let shirt = {
    /** The module's `color` property. */
    color: 'black',
 
    /** @constructor */
    Turtleneck: function (size) {
      /** The class' `size` property. */
      this.size = size;
    }
  };
 
  return shirt;
});



/**
 * A module representing a jacket.
 * @module my/jacket
 */
define('my/jacket', function () {
  /**
     * @constructor
     * @alias module:my/jacket
     */
  let Jacket = function () {
    // ...
  };

  /** Zip up the jacket. */
  Jacket.prototype.zip = function () {
    // ...
  };

  return Jacket;
});