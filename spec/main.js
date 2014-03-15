'use strict';

var enumerable = require('../enumerable');
var expect     = require('chai').expect;

// TEST CLASSES
var LinkedList = require('./classes/LinkedList.js');

describe('enumerable', function(){
  it('should have a reduce function', function(){
    expect(typeof enumerable.reduce).to.equal('function');
  });

  it('should have an inject function which is equal to reduce', function(){
    expect(enumerable.inject).to.equal(enumerable.reduce);
  });

  it('should respond to all enumerable functions', function(){
    expect(enumerable).to.respondTo('eachSlice');
    expect(enumerable).to.respondTo('reduce');
    expect(enumerable).to.respondTo('filter');
    expect(enumerable).to.respondTo('find');
    expect(enumerable).to.respondTo('all');
    expect(enumerable).to.respondTo('any');
    expect(enumerable).to.respondTo('mapInPlace');
    expect(enumerable).to.respondTo('extend');
    expect(enumerable).to.respondTo('noConflict');
    expect(enumerable).to.respondTo('count');
    expect(enumerable).to.respondTo('toArray');
  });

  describe('with linked lists', function(){
    var list;

    beforeEach(function(){
      enumerable.extend(LinkedList.prototype);
      list = new LinkedList();
      list.add(3);
      list.add(4);
      list.add(5);
      list.add(6);
    });


    it('should be able to reduce', function(){
      var sum = list.reduce(function(sum, node){
        return sum + node.value;
      }, 0);
      expect(sum).to.equal(18);
    });

    it('should be able to filter', function(){
      var evens = list.filter(function(node){
        return node.value % 2 === 0;
      });
      expect(evens.length).to.equal(2);
      expect(evens[0].value).to.equal(4);
      expect(evens[1].value).to.equal(6);
      expect(Array.isArray(evens)).to.be.true;
    });

    it('should be able to find', function(){
      var three = list.find(function(node){
        return node.value === 3;
      });
      var six = list.find(function(node){
        return node.value === 6
      })
      expect(three).to.equal(list.head);
      expect(six).to.equal(list.tail);
    });

    it('should return the correct boolean for `all`', function(){
      var allPositive = list.all(function(node){
        return node.value > 0;
      });
      var allEven = list.all(function(node){
        return node.value % 2 === 0;
      });
      expect(allPositive).to.be.true;
      expect(allEven).to.be.false;
    });

    it('should return the correct boolean for `any`', function(){
      var anyNegative = list.any(function(node){
        return node.value < 0;
      });
      var anyFour = list.any(function(node){
        return node.value === 4;
      });

      expect(anyNegative).to.be.false;
      expect(anyFour).to.be.true;
    });

    it('should map in place', function(){
      list.mapInPlace(function(node){
        node.value *= 2;
        return node;
      });
      expect(list.head.value).to.equal(6);
      expect(list.head.next.value).to.equal(8);
    });

    it('should handle eachSlice', function(){
      list.add(7);

      var nodeSlices = [];
      list.eachSlice(function(nodes){
        nodeSlices.push(nodes);
      }, 2);

      expect(nodeSlices[0].length).to.equal(2);
      expect(nodeSlices[1].length).to.equal(2);
      expect(nodeSlices[2].length).to.equal(1);
      expect(Array.isArray(nodeSlices[0])).to.be.true;
      expect(nodeSlices[0][0]).to.equal(list.head);
      expect(nodeSlices[0][1]).to.equal(list.head.next);

    });

    it('should count properly when no condition is passed in', function(){
      expect(list.count()).to.equal(4);
      list.add(13);
      expect(list.count()).to.equal(5);
    });

    it('should count properly when a function is supplied', function(){
      var count = list.count(function(node){
        return node.value % 2 == 0;
      })
      expect(count).to.equal(2);
      list.add(14);

      count = list.count(function(node){
        return node.value % 2 == 0;
      });
      expect(count).to.equal(3);
    });

    it('should count properly when a non-object condition is supplied', function(){
      var countHead = list.count(list.head);
      var countNum = list.count(9);

      expect(countHead).to.equal(1);
      expect(countNum).to.equal(0);
    });

    it('should be able to put everything in an array', function(){
      var arr = list.toArray();
      expect(Array.isArray(arr)).to.be.true;
      expect(arr.length).to.equal(4);
      expect(arr[0]).to.equal(list.head);
      expect(arr[arr.length - 1]).to.equal(list.tail);
    })
  });
});
