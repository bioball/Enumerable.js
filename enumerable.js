(function(){

  'use strict';

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

  enumerable.eachSlice = function eachSlice(callback, num, context){
    if(typeof num !== 'number'){ throw new SyntaxError('need a number passed in as a second argument') }
    context = context || this;
    var currentSlice = [];
    this.each(function(item){
      currentSlice.push(item);
      if(currentSlice.length == num){
        callback.call(context, currentSlice);
        currentSlice = [];
      }
    });
    if(currentSlice.length){
      callback.call(context, currentSlice);
    }
  }

  enumerable.reduce = enumerable.inject = function reduce(callback, seed, context){
    context = context || this;
    this.each(function(item){
      seed = callback.call(context, seed, item);
    });
    return seed;
  };

  enumerable.filter = enumerable.select = enumerable.findAll = function filter(callback, context){
    context = context || this;
    var result = [];
    this.each(function(item){
      if(callback.call(context, item)){
        result.push(item);
      }
    });
    return result;
  };

  enumerable.find = function find(callback, context){
    context = context || this;
    var result = null;
    try {
      this.each(function(item){
        if(callback.call(context, item)){
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

  // if no condition is supplied, returns the number of items total
  // if a function is supplied as the condition, counts the number of items for which the condition passes
  // otherwise, counts the number of items that strictly equal the passed in object

  enumerable.count = function count(condition, context){
    context = context || this;
    var result = 0;
    var callback = typeof condition === 'function' 
    ? condition 
    : function(item){
      return item === condition;
    };
    this.each(function(item){
      condition ? callback.call(context, item) && result++ : result++;
    });
    return result;
  };

  enumerable.all = function all(callback, context){
    context = context || this;
    try {
      this.each(function(item){
        if(!callback.call(context, item)){
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

  enumerable.any = function any(callback, context){
    context = context || this;
    return !this.all(function(item){
      return !callback.call(context, item);
    });
  };

  // IMPORTANT TO NOTE: JavaScript primitives are immutable, and this function is designed
  // to mutate each object, so it will not work if the `each` item is a primitive.

  enumerable.mapInPlace = function mapInPlace(callback, property, context){
    context = context || this;
    this.each(function(item){
      item = callback.call(context, item);
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

  enumerable.cycle = function cycle(callback, num, context){
    context = context || this;
    if(typeof num !== 'number'){ throw new SyntaxError('need a number passed in as the second argument'); }
    var count = 0;
    while(count < num){
      this.each.call(context, callback);
      count++;
    }
  };

  enumerable.detect = function detect(callback, context){
    context = context || this;
    return this.find(function(node){
      return !callback.call(context, node);
    });
  };

  enumerable.eachCons = function eachCons(callback, num, context){
    context = context || this;
    var index = 0;
    var self = this;
    try {
      this.each(function(){
        var collection = [];
        self.eachUntilN(function(node){
          collection.push(node);
        }, num, this, index);
        if(collection.length !== num){ throw new BreakException(); }
        callback.call(context, collection);
        index++;
      });
    } catch(e){
      if(!(e instanceof BreakException)){
        throw e;
      }
    }
  };

  // iterates the given callback for the first N elements only. If a start index is given, it starts at that element

  enumerable.eachUntilN = function eachUntilN(callback, num, context, start){
    start = start || 0;
    context = context || this;
    var count = 0;
    var index = 0;
    try {
      this.each(function(item){
        if(index >= start){
          callback.call(context, item);
          count++;
        }
        index++;
        if(count == num){
          throw new BreakException();
        }
      });
    } catch(e) {
      if(!(e instanceof BreakException)){
        throw e;
      }
    }
  };

  enumerable.first = function first(num){
    var count = 0;
    var result;
    try {
      if(typeof num !== 'number'){
        return this.each(function(item){
          result = item;
          throw new BreakException();
        });
      } else {
        result = [];
        this.each(function(item){
          result.push(item);
          if(result.length == num){
            throw new BreakException();
          }
        })
      }
    } catch(e) {
      if(!(e instanceof BreakException)){
        throw e;
      }
    }
    return result;
  };

  enumerable.max = function max(callback, context){
    if(typeof callback !== 'function'){
      throw new SyntaxError('need a callback argument')
    }
    context = context || this;
    var maxObj, maxValue, currentValue;
    this.each(function(currentObj){
      currentValue = callback.call(context, currentObj);
      if(typeof maxObj === 'undefined' || currentValue > maxValue){
        maxObj = currentObj;
        maxValue = currentValue;
      }
    });
    return maxObj;
  };

  enumerable.min = function min(callback, context){
    if(typeof callback !== 'function'){
      throw new SyntaxError('need a callback argument')
    }
    context = context || this;
    var minObj, minValue, currentValue;
    this.each(function(currentObj){
      currentValue = callback.call(context, currentObj);
      if(typeof minObj === 'undefined' || currentValue < minValue){
        minObj = currentObj;
        minValue = currentValue;
      }
    });
    return minObj;
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