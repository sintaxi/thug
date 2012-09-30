module.exports = function(field, record, stack, callback){
  var errors  = [];
  var index   = 0;
  var that    = this
  
  function next(){
    var layer = stack[index++]
    if(!layer) return callback(errors)
    layer.call(that, field, record, errors, next)
  }
  
  next()
}