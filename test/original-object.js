const should = require("should")
const Thug = require("../thug")

describe("original object", function () {

  it("should not be modified by the filters", function (done) {

    const changeName = function (obj, next) {
      obj.name = "Thom"
      next(obj)
    }

    const t = new Thug({
      filters: {
        in: [changeName]
      }
    })

    const person = { name: "Bob" }

    t.set(person, function (errors, record) {
      person.should.have.property("name", "Bob")
      done()
    })
  })

})
