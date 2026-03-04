const should = require("should")
const Thug = require("../thug")

// Tests
describe("object store with filters", function () {

  const db = {}

  const sub = function (record, next) {
    record.name = record.name.replace("Brock", "Fred")
    next(record)
  }

  const store = new Thug({
    filters: {
      in: [sub]
    }
  })

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
      record.should.eql({ "name": "Fred" })
      done()
    })
  })

})
