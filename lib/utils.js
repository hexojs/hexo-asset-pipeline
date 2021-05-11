/**
 * Consistent convert array to buffer
 * @params {Array|Buffer}
 * @return {Buffer}
 */
function bufferFromParts(parts) {
    const buffers = [];

    for (let i = 0, l = parts.length; i < l; ++i) {
        const part = parts[i]

        buffers.push((part instanceof Buffer) ? part : Buffer.from(part))
    }

    return Buffer.concat(buffers);
}

/**
 * Get available paths for absolute and relative assets import
 * @param {String} root
 * @param {String} path
 * @param {Array<String>} relativeDirs
 * @returns
 */
function getPaths(root, path, relativeDirs) {
    let relative = path;
    let absolute = root + path;

    for (let i = 0; i < relative.length; i++) {
      relative = relative.replace(new RegExp(`^${relativeDirs[i]}/`), '');
    }

    return { relative, absolute };
}

/**
 * Check file extension is ignored by user config
 * @param {String} path
 * @param {Array<String>} patterns
 * @returns {Boolean}
 */
function checkFileIgnore(path, patterns) {
    for (let i = 0, len = patterns.length; i < len; i++) {
      if (minimatch(path, patterns[i])) {

        return true;
      }
    }

    return false;
  }

module.exports = {
    bufferFromParts,
    getPaths,
    checkFileIgnore
};
