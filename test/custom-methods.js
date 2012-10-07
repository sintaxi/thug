var should  = require("should")
var Thug    = require("../thug")

// Tests
describe("custom methods", function(){
  
  var basic = new Thug({
    locals:{
      "hello": "world"
    },
    methods: {
      foo: function(callback){
        return callback(this.locals)
      }
    }
  })
  
  it("should have method foo", function(done) {
    basic.foo(function(reply){
      reply["hello"].should.eql("world")
      done()
    })
  })
  
})