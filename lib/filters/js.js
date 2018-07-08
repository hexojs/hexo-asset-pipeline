'use strict';

const minimatch = require('minimatch');
const UglifyJS = require('uglify-js');
const cloneDeep = require('lodash.clonedeep');



function run(str, data) {
  const hexo = this;
  const options = cloneDeep(hexo.config.asset_pipeline.uglify_js);
  const path = data.path;
  const log = hexo.log || console;

  /**
   * Cache enable and exclude then delete from options as they are not clean_css options.
   */
  const enable = options.enable;
  delete options.enable;
  const exclude = options.exclude;
  delete options.exclude;

  /**
   * Return if there is no hexo-asset-pipeline.uglify-js in config.
   */
  if (!enable) {
    log.info('Filter(asset_pipeline.uglify_js) is not enabled.Skipping it.')
    return str;
  }

  if (exclude && !Array.isArray(exclude)) exclude = [exclude];

  if (path && exclude && exclude.length) {
    for (let i = 0, len = exclude.length; i < len; i++) {
      if (minimatch(path, exclude[i])) return str;
    }
  }

  const result = UglifyJS.minify(str, options);

  return result.code;
}


module.exports = run;
