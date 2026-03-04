const sift = require("./lib/flow/sift")
const validate = require("./lib/flow/validate")

function clone(obj) {
  if (obj === null || typeof obj !== "object") return obj
  const temp = obj.constructor()
  for (const key in obj) temp[key] = clone(obj[key])
  return temp
}

module.exports = function (config) {
  config = config || {}
  const filters = config.filters || {}
  const validations = config.validations || {}
  const methods = config.methods || {}

  const Int = function (l) {
    const that = this
    this.locals = l

    // custom methods
    for (const method of Object.keys(methods)) {
      that[method] = function () {
        methods[method].apply(that, arguments)
      }
    }

    // public
    this.validate = function (identifier, record, callback) {
      if (!callback) {
        callback = record
        record = identifier
        identifier = null
      }
      that.in(clone(record), function (filtered_record) {
        if (identifier) {
          that.read(identifier, function (record) {
            if (record && record.constructor === Object) {
              // set the new values to the existing object
              for (const prop of Object.keys(filtered_record)) {
                record[prop] = filtered_record[prop]
              }
            } else {
              // new value to object
              record = filtered_record
            }
            that._valid(record, callback)
          })
        } else {
          that._valid(filtered_record, callback)
        }
      })
    }

    // public
    this.get = function (identifier, callback) {
      that.read(identifier, function (record) {
        that.out(record, function (filtered_record) {
          callback(filtered_record)
        })
      })
    }

    // public
    this.del = function (identifier, callback) {
      that.read(identifier, function (record) {
        that.remove(identifier, record, function (errors) {
          callback(errors)
        })
      })
    }

    // public
    this.set = function (identifier, record, callback) {
      if (!callback) {
        callback = record
        record = identifier
        identifier = null
      }
      that.validate(identifier, record, function (errors, record) {
        if (errors) {
          callback(errors, null)
        } else {
          that.beforeWrite(record, function (filtered_record) {
            that.write(identifier, filtered_record, function (saved_record) {
              that.out(saved_record, function (record) {
                callback(null, record)
              })
            })
          })
        }
      })
    }

    // public (experimental)
    this.with = function (locals) {
      const l = clone(that.locals)
      for (const local in locals) {
        l[local] = locals[local]
      }
      return new Int(l)
    }

    return this
  }

  // private
  Int.prototype._valid = function (record, callback) {
    const that = this
    // we need to run before filters before we can run validations
    that.beforeValidate(record, function (filtered_object) {
      const errors = { messages: [], details: {} }
      let count = 0
      const total = Object.keys(validations).length

      // validations are done (because there are none)
      if (total === 0) return callback(null, filtered_object)

      // validate each field
      for (const field of Object.keys(validations)) {
        validate.call(that, field, filtered_object, validations[field], function (field_errors) {
          count++

          // we have field errors
          // lets add them to the errors object
          if (field_errors && field_errors.length > 0) {
            errors.messages.push(field + " " + field_errors[0])
            errors.details[field] = field_errors[0]
          }

          // validations are done
          if (total === count) {
            return callback(errors.messages.length > 0 ? errors : null, filtered_object)
          }
        })
      }
    })
  }

  // semi-public
  Int.prototype.in = function (record, callback) {
    if (record) {
      sift.call(this, record, filters.in, function (filtered_record) {
        callback(filtered_record)
      })
    } else {
      callback(null)
    }
  }

  // semi-public
  Int.prototype.beforeValidate = function (record, callback) {
    if (record) {
      sift.call(this, record, filters.beforeValidate, function (filtered_record) {
        callback(filtered_record)
      })
    } else {
      callback(null)
    }
  }

  // semi-public
  Int.prototype.beforeWrite = function (record, callback) {
    if (record) {
      sift.call(this, record, filters.beforeWrite, function (filtered_record) {
        callback(filtered_record)
      })
    } else {
      callback(null)
    }
  }

  // semi-public
  Int.prototype.out = function (record, callback) {
    if (record) {
      sift.call(this, record, filters.out, function (filtered_record) {
        callback(filtered_record)
      })
    } else {
      callback(null)
    }
  }

  // semi-public (overwrite me)
  Int.prototype.write = function (identifier, record, callback) {
    callback(record)
  }

  // semi-public (overwrite me)
  Int.prototype.read = function (identifier, callback) {
    callback(null)
  }

  // semi-public (overwrite me)
  Int.prototype.remove = function (identifier, callback) {
    callback(null)
  }

  return new Int(config.locals || {})
}
