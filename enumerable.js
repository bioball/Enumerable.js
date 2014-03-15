'use strict';

(function(){

  var root = this;
  // this is used to "break" out of an each loop
  var BreakException = function(result){
    this.result = result;
  };

  // store the old enumerable
  var oldEnumerable = root.enumerable;

  var enumerable = {};

  enumerable.noConflict = function noConflict(){
    root.enumerable = oldEnumerable;
    return enumerable;
  };

  enumerable.eachSlice = function eachSlice(callback, num){
    if(!num){ throw new SyntaxError('need a slice size passed in as a second argument') }
    var currentSlice = [];
    this.each(function(item){
      currentSlice.push(item);
      if(currentSlice.length == num){
        callback(currentSlice);
        currentSlice = [];
      }
    });
    if(currentSlice.length){
      callback(currentSlice);
    }
  }

  enumerable.reduce = enumerable.inject = function reduce(callback, seed){
    this.each(function(item){
      seed = callback(seed, item);
    });
    return seed;
  };

  enumerable.filter = enumerable.select = function filter(callback){
    var result = [];
    this.each(function(item){
      if(callback(item)){
        result.push(item);
      }
    });
    return result;
  };

  enumerable.find = function find(callback){
    var result;
    try {
      this.each(function(item){
        if(callback(item)){
          throw new BreakException(item);
        }
      });
    } catch(e) {
      if(e instanceof BreakException){
        result = e.result;
      } else {
        throw e;
      }
    } finally {
      return result;
    }
  };

  enumerable.all = function all(callback){
    try {
      this.each(function(item){
        if(!callback(item)){
          throw new BreakException();
        }
      });
    } catch(e) {
      if(e instanceof BreakException){
        return false;
      } else {
        throw e;
      }
    }
    return true;
  };

  enumerable.any = function any(callback){
    return !this.all(function(item){
      return !callback(item);
    });
  };

  // IMPORTANT TO NOTE: JavaScript primitives are immutable, and this function is designed
  // to mutate each object, so it will not work if the `each` item is a primitive.
  // if using primitives, you should use ECMAScript5's native Array.prototype.map

  enumerable.mapInPlace = function mapInPlace(callback, property){
    this.each(function(item){
      item = callback(item);
    });
  };

  // if two objects are passed in, it will extend properties of the first object to the second object.
  // otherwise, if just one is passed in, it will extend enumerable to that object.
  enumerable.extend = function extend(obj1, obj2){
    if(!obj2){
      this.extend(this, obj1);
    } else {
      for(var key in obj1){
        obj2[key] = obj1[key];
      }
    }
  };

  enumerable.toArray = function toArray(){
    var result = [];
    this.each(function(item){
      result.push(item);
    });
    return result;
  };

  if(typeof exports !== 'undefined') {
    if(typeof module !== 'undefined' && module.exports) {
      exports = module.exports = enumerable;
    }
    exports.enumerable = enumerable;
  } else {
    root.enumerable = enumerable
  }

}).call(this);