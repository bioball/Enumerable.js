Enumerable.js
=============

### *utility functions extendable beyond arrays and hash tables*

When you use a JavaScript array or hash table, you have so many ways to get utility functions at your disposal through libraries like Underscore, Zepto, jQuery, or natively in ECMAScript5. Why can't we have these same utility functions just as easily for other data structures that can be iterated over? Say, a linked list, or a tree, or graph?

This library is heavily inspired by Ruby's Enumerable module. It bootstraps off your object's `.each` function, and provides a wealth of useful utility functions.

Quickstart
----------

For a class that may be iterated over, simply define what `.each` means, then extend your class to enumerable. For example, given a LinkedList, it might look like this

```` js
LinkedList.prototype.each = function(cb){
  var node = this.head;
  while(node){
    cb(node);
    node = node.next;
  }
}
````

There are two ways to inherit from Enumerable.js. Either use Enumerable#extend, like so

`enumerable.extend(LinkedList.prototype);`

Or use Object.create to inherit from Enumerable. Here is a functional instantiation class pattern for a contrived linked list.

```` js
var makeLinkedList = function(){
  var linkedList = Object.create(enumerable);
  linkedList.head = null;
  linkedList.tail = null;
  linkedlist.each = function(){
    var node = this.head;
    while(node){
      cb(node);
      node = node.next;
    }
  }
  return linkedList;
}
````

Conflict Management
-------------------

Have another global `enumerable` variable? Assign `enumerable#noConflict` to another variable, and your previous `enumerable` will be reinstated. The other variable created will reference this library.

---

This is currently a work in progress.