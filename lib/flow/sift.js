module.exports = function(record, stack, callback){
  if(!stack) stack = []

  var index = 0;
  function next(record){
    var layer = stack[index++]
    if(!layer) return callback(record)
    layer(record, next)
  }
  
  next(record)
}