(function(root){
  // this is used to "break" out of an each loop
  var BreakException = function(result){
    this.result = result;
  };

  root.enumerable = enumerable = {};

  enumerable.eachSlice = function eachSlice(callback, num){
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
      if(filter(item)){
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
    return this.all(function(item){
      return !callback(item);
    });
  };

  // since JavaScript primitives are immutable, a property reference is needed to correctly map
  enumerable.map = function map(callback, property){
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

})(this);