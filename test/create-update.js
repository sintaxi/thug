var should  = require("should")
var Thug    = require("../thug")

// Tests
describe("object store with filters", function(){

  var delUUID = function(record, next){
    delete record.uuid
    next(record)
  }
  
  var genUUID = function(record, next){
    if(!record.uuid){
      record.uuid = Math.floor(Math.random()*999)
    }
    next(record)
  }

  var store = new Thug({
    filters: {
      in:     [delUUID],
      before: [genUUID],
      after:  [],
      out:    []
    }
  })

  // Write
  store.constructor.prototype.write = function(identifier, record, callback){
    global[record.uuid] = record
    callback(record)
  }

  // Read
  store.constructor.prototype.read = function(identifier, callback){
    callback(global[identifier])
  }
  
  var uuid;

  it("should create", function(done) {
    store.set({ "name" : "Brock" }, function(errors, record){
      uuid = record.uuid
      record.should.have.property("uuid")
      record.should.have.property("name")
      should.not.exist(errors)
      done()
    })
  })
  
  it("should get", function(done) {
    store.get(uuid, function(record){
      record.should.have.property("uuid", uuid)
      record.should.have.property("name", "Brock")
      done()
    })
  })
  
  it("should update", function(done) {
    store.set(uuid, { "name" : "Brock Whitten" }, function(errors, record){
      record.should.have.property("uuid")
      record.should.have.property("name", "Brock Whitten")
      should.not.exist(errors)
      done()
    })
  })
  
  it("should get", function(done) {
    store.get(uuid, function(record){
      record.should.have.property("uuid")
      record.should.have.property("name", "Brock Whitten")
      done()
    })
  })
  
  it("should not allow uuid to be set", function(done) {
    store.set(uuid, { uuid: "5678" }, function(errors, record){
      record.should.have.property("uuid", uuid)
      record.should.have.property("name", "Brock Whitten")
      done()
    })
  })

})