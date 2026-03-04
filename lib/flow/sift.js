module.exports = function (record, stack, callback) {
  if (!stack) stack = []

  const that = this
  let index = 0

  function next(record) {
    const layer = stack[index++]
    if (!layer) return callback(record)
    layer.call(that, record, next)
  }

  next(record)
}
