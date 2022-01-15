
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./windows-iana.cjs.production.min.js')
} else {
  module.exports = require('./windows-iana.cjs.development.js')
}
