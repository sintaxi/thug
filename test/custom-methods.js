const should = require("should")
const Thug = require("../thug")

// Tests
describe("custom methods", function () {

  const basic = new Thug({
    locals: {
      "hello": "world"
    },
    methods: {
      foo: function (callback) {
        return callback(this.locals)
      }
    }
  })

  it("should have method foo", function (done) {
    basic.foo(function (reply) {
      reply["hello"].should.eql("world")
      done()
    })
  })

})
