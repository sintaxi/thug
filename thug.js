var sift      = require("./lib/flow/sift")
var validate  = require("./lib/flow/validate")

module.exports = function(config){
  var config      = config || {} 
  var filters     = config.filters || {}
  var validations = config.validations || {}
    
  // locals
  for(var local in config.locals)(function(local){
    this[local] = config.locals[local]
  })(local)
  
  var Int = function(local){
    this.local = local
  }
  
  Int.prototype._valid = function(record, callback){

    // we need to run before filters before we can run validations
    sift(record, filters.before, function(filtered_object){
      var errors = { messages: [], details: {} }
      var count = 0
      var total = Object.keys(validations).length
      
      // validations are done (because there are none)
      if(total == 0)
        return callback(null, filtered_object)
        
      // validate each field
      for(var field in validations)(function(field){

        validate(field, filtered_object, validations[field], function(field_errors){
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
  Int.prototype.valid = function(identifier, record, callback){
    if(!callback){
      callback    = record
      record      = identifier
      identifier  = null
    }
    var that = this;
    sift(record, filters.in, function(filtered_record){
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

  // experimental
  Int.prototype.with = function(sp){
    return new Int(sp)
  }
  
  Int.prototype.out = function(record, callback){
    if(record){
      sift(record, filters.out, function(filtered_record){
        callback(filtered_record)
      })
    }else{
      callback(null)
    }
  }
  
  Int.prototype.get = function(identifier, callback){
    var that = this
    that.read(identifier, function(record){
      that.out(record, function(filtered_record){
        callback(filtered_record)
      })
    })
  }
  
  Int.prototype.set = function(identifier, record, callback){
    var that = this
    that.valid(identifier, record, function(errors, record){
      if(errors){
        callback(errors, null)
      }else{
        sift(record, filters.after, function(filtered_record){
          that.write(identifier, filtered_record, function(saved_record){
            that.out(saved_record, function(record){
              callback(null, record)
            })
          })
        })
      }
    })
  }
  
  return new Int()
}
