Enumerable.js
-------------

*enumerating utility functions to empower your .each*

This is a port of Ruby's Enumerable module into JavaScript. Simply define what `.each` means for your class, and you gain access to a wealth of functions, including reduce, filter, eachSlice, etc.

Quickstart
==========

For a class that may be iterated over, define what `.each` means. For example, given a LinkedList, it might look like this

````
LinkedList.prototype.each = function(cb){
  var node = this.head;
  while(node){
    cb(node.value);
    node = node.next;
  }
}
````

There are two ways to inherit from Enumerable.js. Either use Enumerable#extend, like so

`Enumerable.extend(LinkedList.prototype);`

Or use Object.create to inherit from Enumerable.

`var LinkedList = Object.create(Enumerable);`

---

This is currently a work in progress.