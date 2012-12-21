var should  = require("should")
var Thug    = require("../thug")

describe("original object", function(){

  it("should not be modified by the filters", function(done) {
    
    var changeName = function(obj, next){
      obj.name = "Thom"
      next(obj)
    }
    
    var t = new Thug({
      filters: {
        in: [changeName]
      }
    })
    
    var person = { name: "Bob" }
    
    t.set(person, function(errors, record){
      person.should.have.property("name", "Bob")
      done()
    })
  })

})
