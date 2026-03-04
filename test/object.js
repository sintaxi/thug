const should = require("should")
const Thug = require("../thug")

// Tests
describe("object store", function () {

  const db = {}
  const store = new Thug()

  // Write
  store.constructor.prototype.write = function (identifier, record, callback) {
    db[identifier] = record
    callback(record)
  }

  // Read
  store.constructor.prototype.read = function (identifier, callback) {
    callback(db[identifier])
  }

  it("should set", function (done) {
    store.set("user", { "name": "Brock" }, function (errors, record) {
      should.not.exist(errors)
      done()
    })
  })

  it("should get", function (done) {
    store.get("user", function (record) {
      record.should.eql({ "name": "Brock" })
      done()
    })
  })

})
