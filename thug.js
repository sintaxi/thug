var sift      = require("./lib/flow/sift")
var validate  = require("./lib/flow/validate")

// http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object
var clone = function(obj){
  if(obj == null || typeof(obj) != 'object') return obj
  var temp = obj.constructor(); // changed
  for(var key in obj) temp[key] = clone(obj[key]);
  return temp;
}

module.exports = function(config){
  var config      = config || {} 
  var filters     = config.filters || {}
  var validations = config.validations || {}
  var locals      = config.locals || {}  
  
  var Int = function(l){
    this.locals = l
    return this
  }
  
  // private
  Int.prototype._valid = function(record, callback){
    var that = this
    // we need to run before filters before we can run validations
    sift.call(that, record, filters.beforeValidate, function(filtered_object){
      var errors = { messages: [], details: {} }
      var count = 0
      var total = Object.keys(validations).length
      
      // validations are done (because there are none)
      if(total == 0)
        return callback(null, filtered_object)
        
      // validate each field
      for(var field in validations)(function(field){
        
        validate.call(that, field, filtered_object, validations[field], function(field_errors){
          count ++
          
          // we have field errrors
          // lets add them to the errors object
          if(field_errors && field_errors.length > 0){
            errors.messages.push(field + " " + field_errors[0])
            errors.details[field] = field_errors[0]
          }

          // validations are done
          if(total == count)
            return callback(errors.messages.length > 0 ? errors : null, filtered_object)

        })
      })(field)
      
    })
  }
  
  // public
  Int.prototype.validate = function(identifier, record, callback){
    if(!callback){
      callback    = record
      record      = identifier
      identifier  = null
    }
    var that = this;
    
    var locals = this.locals
    sift.call(that, record, filters.in, function(filtered_record){
      if(identifier){
        that.read(identifier, function(record){
          if(record && (record).constructor == Object){
            // set the new values to the existing object
            for(var prop in filtered_record)(function(prop){
              record[prop] = filtered_record[prop]  
            })(prop)
          }else{
            // new value to object
            record = filtered_record
          }
          that._valid(record, callback)
        })
      }else{
        that._valid(filtered_record, callback)
      }
    })
  }
  
  // public
  Int.prototype.get = function(identifier, callback){
    var that = this
    that.read(identifier, function(record){
      that.out(record, function(filtered_record){
        callback(filtered_record)
      })
    })
  }

  // public
  Int.prototype.del = function(identifier, callback){
    var that = this
    that.read(identifier, function(record){
      that.remove(identifier, record, function(errors){
        callback(errors)
      })
    })
  }
  
  // public
  Int.prototype.set = function(identifier, record, callback){
    if(!callback){
      callback    = record
      record      = identifier
      identifier  = null
    }
    var that = this
    that.validate(identifier, record, function(errors, record){
      if(errors){
        callback(errors, null)
      }else{
        sift.call(that, record, filters.beforeWrite, function(filtered_record){
          that.write(identifier, filtered_record, function(saved_record){
            that.out(saved_record, function(record){
              callback(null, record)
            })
          })
        })
      }
    })
  }
  
  // private
  Int.prototype.out = function(record, callback){
    if(record){
      sift.call(this, record, filters.out, function(filtered_record){
        callback(filtered_record)
      })
    }else{
      callback(null)
    }
  }
  
  // public (experimental)
  Int.prototype.with = function(locals){
    var l = clone(this.locals)    
    for(var local in locals){
      l[local] = locals[local]
    }
    return new Int(l)
  }
  
  // overwrite me
  Int.prototype.write = function(identifier, record, callback){
    callback(record)
  }
  
  // overwrite me
  Int.prototype.read = function(identifier, callback){
    callback(null)
  }
  
  return new Int(config.locals || {})
}
