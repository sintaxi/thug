module.exports = function(field, record, stack, callback){
  var errors = [];
  
  var index = 0;
  function next(){
    var layer = stack[index++]
    if(!layer) return callback(errors)
    layer(field, record, errors, next)
  }
  
  next()
}