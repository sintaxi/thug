var should  = require("should")
var Thug    = require("../thug")

// Tests
describe("store with no read or write", function(){

  var store = new Thug()

  // Write
  // store.constructor.prototype.write = function(identifier, record, callback){
  //   global[record.uuid] = record
  //   callback(record)
  // }

  // Read
  // store.constructor.prototype.read = function(identifier, callback){
  //   callback(global[identifier])
  // }

  it("should create", function(done) {
    store.set({ "name" : "Brock" }, function(errors, record){
      should.not.exist(errors)
      record.should.have.property("name")
      done()
    })
  })
  
  // it("should get", function(done) {
  //   store.get(uuid, function(record){
  //     record.should.have.property("uuid", uuid)
  //     record.should.have.property("name", "Brock")
  //     done()
  //   })
  // })
  // 
  // it("should update", function(done) {
  //   store.set(uuid, { "name" : "Brock Whitten" }, function(errors, record){
  //     record.should.have.property("uuid")
  //     record.should.have.property("name", "Brock Whitten")
  //     should.not.exist(errors)
  //     done()
  //   })
  // })
  // 
  // it("should get", function(done) {
  //   store.get(uuid, function(record){
  //     record.should.have.property("uuid")
  //     record.should.have.property("name", "Brock Whitten")
  //     done()
  //   })
  // })
  // 
  // it("should not allow uuid to be set", function(done) {
  //   store.set(uuid, { uuid: "5678" }, function(errors, record){
  //     record.should.have.property("uuid", uuid)
  //     record.should.have.property("name", "Brock Whitten")
  //     done()
  //   })
  // })

})