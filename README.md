Enumerable.js
=============

### *utility functions for all types of collections*

When you use a JavaScript array or hash table, you have so many ways to get utility functions at your disposal through libraries like Underscore, Zepto, jQuery, or natively in ECMAScript5. Why can't we have these same utility functions just as easily for other data structures that can be iterated over? Say, a linked list, or a tree, or graph?

This library is heavily inspired by Ruby's Enumerable module. If you have a data structure that holds a colleciton of items, simply define what `.each` means, and extend your object to include all of Enumerable's methods.

Note: This is *not* meant to be a standalone library, but to be used in conjunction with another data type that has a definable `.each` method.

Quickstart
----------

*1. Have a collection of some sort*

```` js
// contrived example
var LinkedList = function(){
  this.head = null;
  this.tail = null;
};

LinkedList.prototype.add = function(value){
  var node = {
    value: value,
    next: null
  };
  if(!this.head){
    this.head = this.tail = node;
  } else {
    this.tail.next = node;
    this.tail = node;
  }
};

````

*2. Define what `.each` means*

```` js
LinkedList.prototype.each = function(callback, context){
  var node = this.head;
  while(node){
    callback.call(context, node);
    node = node.next;
  }
}
````

*3. Extend the object include enumerable*

```` js
enumerable.extend(LinkedList.prototype);
````

*4. Stand in awe of all the awesome utility functions you suddenly have*


Conflict Management
-------------------

Have another global `enumerable` variable? Assign `enumerable#noConflict` to another variable, and your previous `enumerable` will be reinstated. The other variable created will reference this library.

---

This is currently a work in progress.