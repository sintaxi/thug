const should = require("should")
const Thug = require("../thug")

// Tests
describe("store with no read or write", function () {

  const store = new Thug()

  it("should create", function (done) {
    store.set({ "name": "Brock" }, function (errors, record) {
      should.not.exist(errors)
      record.should.have.property("name")
      done()
    })
  })

})
