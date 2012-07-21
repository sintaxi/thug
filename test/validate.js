var should    = require("should")
var validate  = require("../lib/flow/validate")


// basic validations

var nobob = function(field, obj, errors, next){
  if(obj[field] == "bob") errors.push("can't be bob")
  next()
}

var large = function(field, obj, errors, next){
  if(obj[field].length < 10) errors.push("must be larger than 10")
  next()
}

var greater = function(size){
  return function(field, obj, errors, next){
    if(obj[field].length < size) errors.push("must be larger than " + size)
    next()
  }  
}



// tests

describe("validate", function(){

  it("return empty array if valid", function(done) {
    var person = { name: "jay" }
    validate("name", person, [nobob], function(errors){
      errors.should.eql([])
      done()
    })
  })
  
  it("return errors if invalid", function(done) {
    var person = { name: "bob" }
    validate("name", person, [nobob], function(errors){
      errors.should.eql(["can't be bob"])
      done()
    })
  })
  
  it("return multiple errors", function(done) {
    var person = { name: "bob" }
    validate("name", person, [nobob, large], function(errors){
      errors.should.eql(["can't be bob", "must be larger than 10"])
      done()
    })
  })
  
  it("should be able to return function as validation", function(done) {
    var person = { name: "bob" }
    validate("name", person, [nobob, large, greater(5)], function(errors){
      errors.should.eql(["can't be bob", "must be larger than 10", "must be larger than 5"])
      done()
    })
  })
  
})