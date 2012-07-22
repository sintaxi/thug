var sift      = require("./lib/flow/sift")
var validate  = require("./lib/flow/validate")


module.exports = function(config){
  
  // locals
  for(var local in config.locals)(function(local){
    this[local] = config.locals[local]
  })(local)
  
  // validations
  var validations = config.validations
  
  // filters
  var filters     = config.filters || {}

  var Int = function(local){
    this.local = local
  }
  
  //Int.prototype.end = function()
  
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
    var that = this;
    
    // run in filters
    sift(record, filters.in, function(filtered_record){
      that._valid(filtered_record, callback)
      // if(identifier){
      //   that.read(identifier, function(record){
      //     if(record){
      //       for(var prop in filtered_record)(function(prop){
      //         record[prop] = filtered_record[prop]  
      //       })(prop)
      //     }
      //     that._valid(record, callback)
      //   })
      // }else{
      //   that._valid(record, callback)
      // }
    })
  }
  
  // Int.prototype.save = function(q, obj, cb){
  //   delete obj.id
  //   var that = this;
  // 
  //   that.valid(q, obj, function(errors, obj){
  //     if(errors){
  //       cb(errors, null)        
  //     }else{
  //       sift(obj, filters.after, function(record){
  //         if(that.write){
  //           that.write(record, function(err, obj){
  //             if(!err){
  //               that.out(obj, function(record){
  //                 cb(null, record)
  //               })
  //             }
  //           })  
  //         }else{
  //           console.log("must create a write() method.")
  //           process.exit()
  //         }
  //       })          
  //     }
  //   })  
  // }

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
  
  // Int.prototype.create = function(obj, cb){
  //   this.save(null, obj, cb)
  // }
  // 
  // Int.prototype.update = function(q, obj, cb){
  //   this.save(q, obj, cb)
  // }
  
  return new Int()
}
