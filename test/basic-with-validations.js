var should  = require("should")
var Thug    = require("../thug")

var nobob = function(field, record, errors, next){
  if(record == "bob") errors.push("cannot be bar")
  next()
}

var store = new Thug({
  validations: {
    "value": [nobob]
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

describe("basic store with validations", function(){

  it("should be invalid", function(done) {
    store.set("name" , "bob", function(errors, record){
      errors.should.have.property("messages")
      errors.should.have.property("details")
      should.not.exist(record)
      done()
    })
  })
  
  it("should not return value", function(done) {
    store.get("name", function(value){
      should.not.exist(value)
      done()
    })
  })
  
  it("should be valid", function(done) {
    store.set("name" , "fred", function(errors, record){
      should.not.exist(errors)
      record.should.eql("fred")
      done()
    })
  })
  
  it("should get saved record", function(done) {
    store.get("name", function(value){
      value.should.eql("fred")
      done()
    })
  })

})