module.exports = function(record, stack, cb){
  if(!stack) stack = []

  var index = 0;

  function next(record){
    var layer = stack[index++]
    if(!layer) return cb(record)
    layer(record, next)
  }
  
  next(record)
}