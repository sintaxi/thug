module.exports = function(obj, stack, cb){
  var index = 0;

  function next(){
    var layer = stack[index++]
    if(!layer){
      return cb(obj)
    }
    layer(obj, next)
  }
  next()
}