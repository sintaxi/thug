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

  // Remove
  basic.constructor.prototype.remove = function(identifier, record, callback){
    global[identifier] = null
    callback(null)
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
  
  it("should validate", function(done) {
    basic.valid("baz", "bar", function(errors, record){
      should.not.exist(errors)
      record.should.eql("bar")
      done()
    })
  })

  it("should delete", function(done) {
    basic.del("foo", function(errors){
      should.not.exist(errors)
      done()
    })
  })

  it("should be gone after delete", function(done) {
    basic.get("foo", function(errors, record){
      should.not.exist(record)
      done()
    })
  })

})


