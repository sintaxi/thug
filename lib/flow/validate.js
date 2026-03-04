module.exports = function (field, record, stack, callback) {
  const errors = []
  let index = 0
  const that = this

  function next() {
    const layer = stack[index++]
    if (!layer) return callback(errors)
    layer.call(that, field, record, errors, next)
  }

  next()
}
