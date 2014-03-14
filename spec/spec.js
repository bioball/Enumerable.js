var LinkedList = function(){
  this.head = null;
  this.tail = null;
}

LinkedList.prototype.makeNode = function(val){
  var node = {
    value: val,
    next: null
  }
  if(!this.head){
    this.head = node;
    this.tail = node;
  } else {
    this.tail.next = node;
    this.tail = node;
  }
}

LinkedList.prototype.each = function(cb){
  var node = this.head;
  while(node){
    cb(node);
    node = node.next;
  }
}

describe('enumerable', function(){
  describe('with linked lists', function(){
    var list;
    before(function(){
      list = new LinkedList();
    });

    it('should be able to reduce', function(){
      list.add(3);
      list.add(4);
      list.add(5);
      list.add(6);
      var sum = list.reduce(function(sum, num){
        return sum + num;
      }, 0);
      expect(sum).to.equal(18);
    });

  });
});
