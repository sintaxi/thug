var should  = require("should")
var Thug    = require("../thug")

// Tests
describe("object store with filters", function(){
  
  var sub = function(record, next){
    record.name = record.name.replace("Brock", "Fred")
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

  it("should set", function(done) {
    store.set("user", { "name" : "Brock" }, function(errors, record){
      should.not.exist(errors)
      done()
    })
  })
  
  it("should get", function(done) {
    store.get("user", function(record){
      record.should.eql({ "name" : "Fred" })
      done()
    })
  })

})