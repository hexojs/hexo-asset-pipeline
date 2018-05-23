const Hexo = require('hexo')
const path = require('path')
const {createSandbox} = require('hexo-test-utils')

module.exports = function getSandbox() {
  return createSandbox(Hexo, {
    fixture_folder: path.join(__dirname, '..','fixtures'),
    plugins: [
      require.resolve('hexo-renderer-ejs'),
      require.resolve('../../index.js')
    ]
  })
}
