const should = require("should")
const Thug = require("../thug")

const sub = function (record, next) {
  record = record.replace("bar", "baz")
  next(record)
}

const db = {}

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

describe("basic store with filter", function () {

  it("should set", function (done) {
    store.set("foo", "bar", function (errors, record) {
      record.should.eql("baz")
      done()
    })
  })

  it("should get filtered value", function (done) {
    store.get("foo", function (record) {
      record.should.eql("baz")
      done()
    })
  })

})
