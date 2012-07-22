module.exports = function(field, record, stack, callback){
  var index = 0;
  var errors = [];

  function next(){
    var layer = stack[index++]
    if(!layer) return callback(errors)
    layer(field, record, errors, next)
  }
  
  next()
}