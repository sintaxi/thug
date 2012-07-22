var should  = require("should")
var Thug    = require("../thug")

// Tests
describe("basic", function(){
  
  var basic = new Thug()

  // Write
  basic.constructor.prototype.write = function(identifier, record, callback){
    global[identifier] = record
    callback(record)
  }

  // Read
  basic.constructor.prototype.read = function(identifier, callback){
    callback(global[identifier])
  }

  it("should set", function(done) {
    basic.set("foo", "bar", function(errors, record){
      record.should.eql("bar")
      done()
    })
  })
  
  it("should get", function(done) {
    basic.get("foo", function(record){
      record.should.eql("bar")
      done()
    })
  })

})


