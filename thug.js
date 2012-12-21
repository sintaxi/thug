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
  var config      = config              || {} 
  var filters     = config.filters      || {}
  var validations = config.validations  || {}
  var locals      = config.locals       || {}
  var methods     = config.methods      || {}
  
  var Int = function(l){
    var that = this
    this.locals = l
    
    // custom methods
    for(var method in methods)(function(method){
      that[method] = function(){
        methods[method].apply(that, arguments)
      }      
    })(method)

    // public
    this.validate = function(identifier, record, callback){
      if(!callback){
        callback    = record
        record      = identifier
        identifier  = null
      }
      var locals = that.locals
      that.in(clone(record), function(filtered_record){
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
    this.get = function(identifier, callback){
      that.read(identifier, function(record){
        that.out(record, function(filtered_record){
          callback(filtered_record)
        })
      })
    }

    // public
    this.del = function(identifier, callback){
      that.read(identifier, function(record){
        that.remove(identifier, record, function(errors){
          callback(errors)
        })
      })
    }

    // public
    this.set = function(identifier, record, callback){
      if(!callback){
        callback    = record
        record      = identifier
        identifier  = null
      }
      that.validate(identifier, record, function(errors, record){
        if(errors){
          callback(errors, null)
        }else{
          that.beforeWrite(record, function(filtered_record){
            that.write(identifier, filtered_record, function(saved_record){
              that.out(saved_record, function(record){
                callback(null, record)
              })
            })            
          })
        }
      })
    }
    
    // public (experimental)
    this.with = function(locals){
      var l = clone(that.locals)    
      for(var local in locals){
        l[local] = locals[local]
      }
      return new Int(l)
    }
    
    return this
  }
  
  
  // private
  Int.prototype._valid = function(record, callback){
    var that = this
    // we need to run before filters before we can run validations
    that.beforeValidate(record, function(filtered_object){
      // TODO: make this into a separate lib
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
          if(total == count){
            return callback(errors.messages.length > 0 ? errors : null, filtered_object)
          }
        })
      })(field)
      
    })
  }
  
  // semi-public
  Int.prototype.in = function(record, callback){
    if(record){
      sift.call(this, record, filters.in, function(filtered_record){
        callback(filtered_record)
      })
    }else{
      callback(null)
    }
  }
  
  // semi-public
  Int.prototype.beforeValidate = function(record, callback){
    if(record){
      sift.call(this, record, filters.beforeValidate, function(filtered_record){
        callback(filtered_record)
      })
    }else{
      callback(null)
    }
  }
  
  // semi-public
  Int.prototype.beforeWrite = function(record, callback){
    if(record){
      sift.call(this, record, filters.beforeWrite, function(filtered_record){
        callback(filtered_record)
      })
    }else{
      callback(null)
    }
  }
  
  // semi-public
  Int.prototype.out = function(record, callback){
    if(record){
      sift.call(this, record, filters.out, function(filtered_record){
        callback(filtered_record)
      })
    }else{
      callback(null)
    }
  }
  
  // semi-public (overwrite me)
  Int.prototype.write = function(identifier, record, callback){
    callback(record)
  }
  
  // semi-public (overwrite me)
  Int.prototype.read = function(identifier, callback){
    callback(null)
  }
  
  // semi-public (overwrite me)
  Int.prototype.remove = function(identifier, callback){
    callback(null)
  }
  
  return new Int(config.locals || {})
}
