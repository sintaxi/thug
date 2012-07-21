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
person.constructor.prototype.write = function(identifier, record, callback){
  global[identifier] = record
  callback(record)
}

// Read
person.constructor.prototype.read = function(identifier, callback){
  callback(global[identifier])
}

describe("basic-keyval", function(){

  before(function(done){
    done()
  })

  it("should set person", function(done) {
    person.set("foo", "bar", function(errors, record){
      record.should.eql("bar")
      done()
    })
  })
  
  it("should get person", function(done) {
    person.get("foo", function(record){
      record.should.eql("bar")
      done()
    })
  })

  after(function(done){
    done()
  })

})

