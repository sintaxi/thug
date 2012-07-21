
//var flow = require("./flow")

var Flow = {
  
  validate: function(field, obj, stack, cb){
    var index = 0;
    var errors = [];  

    function next(){
      var layer = stack[index++]
      if(!layer){
        cb(errors)
        return
      }
      layer(field, obj, errors, next)
    }
    next()
  },
  
  filter: function(obj, stack, cb){
    var index = 0;

    function next(){
      var layer = stack[index++]
      if(!layer){
        cb(obj)
        return
      }
      layer(obj, next)
    }
    next()
  }    
}


module.exports = function(config){
  
  // make locals available  
  for(var local in config.locals)(function(local){
    this[local] = config.locals[local]
  })(local)
  
  var validations = config.validations
  var filters     = config.filters

  var Int = function(local){
    this.local = local
  }
  
  Int.prototype._valid = function(obj, cb){
    var errors = {
      messages: [],
      details: {}
    }
    var count = 0
    var total = Object.keys(validations).length

    // we need to filter first
    Flow.filter(obj, filters.before, function(filtered_object){
      // validate!
      for(var field in validations)(function(field){  
        Flow.validate(field, filtered_object, validations[field], function(field_errors){
          count ++
          
          if(field_errors && field_errors.length > 0){
            errors.messages.push(field + " " + field_errors[0])
            errors.details[field] = field_errors[0]
          }

          // validations are done
          if(total == count){
            cb(errors.messages.length > 0 ? errors : null, filtered_object) 
          }
          
        })
      })(field)    
    })
    
  }
  
  Int.prototype.valid = function(q, obj, cb){
    if(!cb){
      cb  = obj
      obj = q
      q  = null
    }
    var that = this;
    Flow.filter(obj, filters.in, function(filtered_object){
      console.log(filtered_object)
      if(q){
        that.read(q, function(record){
          
          if(record){
            for(var prop in filtered_object)(function(prop){
              record[prop] = filtered_object[prop]  
            })(prop)
            
          }
          that._valid(record, cb)

        })
      }else{
        that._valid(obj, cb)
      }
    })
  }
  
  Int.prototype.save = function(q, obj, cb){
    delete obj.id
    var that = this;

    that.valid(q, obj, function(errors, obj){
      if(errors){
        cb(errors, null)        
      }else{
        Flow.filter(obj, filters.after, function(record){
          if(that.write){
            that.write(record, function(err, obj){
              if(!err){
                that.out(obj, function(record){
                  cb(null, record)
                })
              }
            })  
          }else{
            console.log("must create a write() method.")
            process.exit()
          }
        })          
      }
    })  
  }

  Int.prototype.with = function(sp){
    return new Int(sp)
  }
  
  Int.prototype.out = function(record, cb){
    if(record){
      Flow.filter(record, filters.out, function(filtered_record){
        cb(filtered_record)
      })
    }else{
      cb(null)
    }
  }
  
  Int.prototype.get = function(id, cb){
    var that = this
    that.read(id, function(record){
      that.out(record, function(record){
        cb(record)
      })
    })
  }
  
  Int.prototype.set = function(key, obj, cb){
    this.save(key, obj, cb)
  }
  
  Int.prototype.create = function(obj, cb){
    this.save(null, obj, cb)
  }
  
  Int.prototype.update = function(q, obj, cb){
    this.save(q, obj, cb)
  }
  
  return new Int()
}
