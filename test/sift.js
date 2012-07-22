var should  = require("should")
var sift = require("../lib/flow/sift")


// basic filters

var upcaseName = function(record, next){
  record.name = record.name.toUpperCase()
  next(record)
}

var reverseName = function(record, next){
  record.name = record.name.split("").reverse().join("")
  next(record)
}

// advanced filters

var upcase = function(field){
  return function(record, next){
    record[field] = record[field].toUpperCase()
    next(record)
  }
}

// tests

describe("sift", function(){

  it("return object when empty stack", function(done) {
    sift("foo", [], function(p){
      p.should.eql("foo")
      done()
    })
  })
  
  it("return object when empty stack", function(done) {
    sift("foo", [
    function(obj, cb){ cb(obj.replace("foo", "bar")) }], function(val){
      val.should.eql("bar")
      done()
    })
  })
  
})

describe("sift object", function(){

  it("return object when empty stack", function(done) {
    var person = { name: "jay" }
    sift(person, [], function(p){
      p.should.have.property("name", "jay")
      done()
    })
  })
  
  it("return be able to modify object", function(done) {
    var person = { name: "jay" }
    sift(person, [upcaseName], function(filtered_object){
      filtered_object.should.have.property("name", "JAY")
      done()
    })
  })
  
  it("return be able to modify object twice", function(done) {
    var person = { name: "jay" }
    sift(person, [upcaseName, reverseName], function(filtered_object){
      filtered_object.should.have.property("name", "YAJ")
      done()
    })
  })
  
  it("return be able to return function for a filter", function(done) {
    var person = { name: "jay" }
    sift(person, [upcase("name"), reverseName], function(filtered_object){
      filtered_object.should.have.property("name", "YAJ")
      done()
    })
  })
  
})

