module.exports = function(record, stack, callback){
  if(!stack) stack = []
  
  var that  = this;
  var index = 0;
  
  function next(record){
    var layer = stack[index++]
    if(!layer) return callback(record)
    layer.call(that, record, next)
  }
  
  next(record)
}