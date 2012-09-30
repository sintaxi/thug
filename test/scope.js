var should  = require("should")
var Thug    = require("../thug")

describe("validations", function(){

  it("should have access to locals", function(done) {    
    var myValidation = function(){
      this.locals.should.have.property("foo")
      done()
    }
    var t = new Thug({
      locals: { foo: "bar" },
      validations: {
        name: [myValidation]
      }
    })
    t.set("doesnt", "matter", function(errors, record){
      done()
    })
  })

})

describe("filters", function(){

  it("should have access to locals", function(done) {
    
    var myFilter = function(record, next){
      this.locals.should.have.property("foo")
      next(record)
    }
    
    var t = new Thug({
      locals: { foo: "bar" },
      filters: {
        in: [myFilter]
      }
    })
    
    t.set("doesnt", "matter", function(errors, record){
      done()
    })
  })

})