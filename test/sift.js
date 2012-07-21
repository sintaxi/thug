var should  = require("should")
var sift = require("../lib/flow/sift")


// basic filters

var upcaseName = function(obj, next){
  obj.name = obj.name.toUpperCase()
  next()
}

var reverseName = function(obj, next){
  obj.name = obj.name.split("").reverse().join("")
  next()
}

// advanced filters

var upcase = function(field){
  return function(obj, next){
    obj[field] = obj[field].toUpperCase()
    next()
  }
}

// tests

describe("sift", function(){

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