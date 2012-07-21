module.exports = function(field, obj, stack, cb){
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
}