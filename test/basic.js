var should  = require("should")
var Thug    = require("../thug")

var person = new Thug({
  locals: {},
  filters: {
    in     : [],
    before : [],
    after  : [],
    out    : []
  },
  validations: {}
})

// Write
person.constructor.prototype.write = function(obj, callback){
  global["foo"] = obj
  callback(null, obj)
}

// Read
person.constructor.prototype.read = function(query, callback){
  callback(global[query])
}

describe("basic-keyval", function(){

  before(function(done){
    done()
  })

  it("should set person", function(done) {
    person.set("foo", "bar", function(errors, obj){
      obj.should.eql("bar")
      done()
    })
  })
  
  it("should get person", function(done) {
    person.get("foo", function(errors, obj){
      obj.should.eql("bar")
      done()
    })
  })

  after(function(done){
    done()
  })

})

