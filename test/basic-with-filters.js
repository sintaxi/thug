var should  = require("should")
var Thug    = require("../thug")

var sub = function(record, next){
  record = record.replace("bar", "baz")
  next(record)
}

var store = new Thug({
  filters: {
    in: [sub]
  }
})

// Write
store.constructor.prototype.write = function(identifier, record, callback){
  global[identifier] = record
  callback(record)
}

// Read
store.constructor.prototype.read = function(identifier, callback){
  callback(global[identifier])
}

describe("basic store with filter", function(){

  it("should set", function(done) {
    store.set("foo", "bar", function(errors, record){
      record.should.eql("baz")
      done()
    })
  })
  
  it("should get filtered value", function(done) {
    store.get("foo", function(errors, record){
      record.should.eql("baz")
      done()
    })
  })

})