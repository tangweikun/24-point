const formatTime = createdAt => {
  const date = new Date(createdAt)
  return (
    date.getMonth() +
    1 +
    '-' +
    date.getDate() +
    ' ' +
    date.getHours() +
    ':' +
    date.getMinutes()
  )
}

module.exports = {
  formatTime,
}
