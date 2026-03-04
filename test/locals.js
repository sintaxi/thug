const should = require("should")
const Thug = require("../thug")

// Tests
describe("locals", function () {

  const t = new Thug({
    locals: {
      foo: "food"
    }
  })

  // Write
  t.constructor.prototype.write = function (identifier, record, callback) {
    callback(this.locals)
  }

  it("should be available to the write function", function (done) {
    t.set("doesnt", "matter", function (errors, record) {
      record.should.have.property("foo", "food")
      done()
    })
  })

  it("should not be global", function (done) {
    const locals = null
    should.not.exist(locals)
    done()
  })

})

// Tests
describe("with", function () {

  const t = new Thug({
    locals: {
      bar: "baz"
    }
  })

  // Write
  t.constructor.prototype.write = function (identifier, record, callback) {
    callback(this.locals)
  }

  it("should be available to the write function", function (done) {
    t.with({ hello: "world" }).set("doesnt", "matter", function (errors, record) {
      record.should.have.property("bar", "baz")
      record.should.have.property("hello", "world")
      done()
    })
  })

  it("should still retain normal scope", function (done) {
    t.set("doesnt", "matter", function (errors, record) {
      record.should.not.have.property("hello")
      done()
    })
  })

  it("should not be global", function (done) {
    const locals = null
    should.not.exist(locals)
    done()
  })

})

// Tests
describe("double with", function () {

  const t = new Thug({
    locals: {
      bar: "baz"
    }
  })

  // Write
  t.constructor.prototype.write = function (identifier, record, callback) {
    callback(this.locals)
  }

  it("should be available to the write function", function (done) {
    t.with({ hello: "world" }).with({ goodbye: "brazil" }).set("doesnt", "matter", function (errors, record) {
      record.should.have.property("bar", "baz")
      record.should.have.property("hello", "world")
      record.should.have.property("goodbye", "brazil")
      done()
    })
  })

  it("should not be global", function (done) {
    const locals = null
    should.not.exist(locals)
    done()
  })

})

// Tests
describe("overwrite using with", function () {

  const t = new Thug({
    locals: {
      bar: "baz"
    }
  })

  // Write
  t.constructor.prototype.write = function (identifier, record, callback) {
    callback(this.locals)
  }

  it("should be available to the write function", function (done) {
    t.with({ bar: "bart" }).set("doesnt", "matter", function (errors, record) {
      record.should.have.property("bar", "bart")
      done()
    })
  })

})
