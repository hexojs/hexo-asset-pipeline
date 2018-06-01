'use strict';

const CleanCSS = require('clean-css');
const minimatch = require('minimatch');
const Promise = require('bluebird');
const cloneDeep = require('lodash.clonedeep');

function run(str, data) {
  const hexo = this;
  const options = cloneDeep(hexo.config.asset_pipeline.clean_css);
  const path = data.path;
  const log = hexo.log || console;

  /**
   * Cache enable and exclude then delete from options as they are not clean_css options.
   */
  let enable = options.enable;
  delete options.enable;
  let exclude = options.exclude;
  delete options.exclude;

  /**
   * Return if there is no hexo-asset-pipeline.clean_css in config.
   */
  if (!enable) {
    log.info('Filter(asset_pipeline.clean_css) is not enabled.Skipping it.')
    return str;
  }

  if (exclude && !Array.isArray(exclude)) exclude = [exclude];

  if (path && exclude && exclude.length) {
    for (let i = 0, len = exclude.length; i < len; i++) {
      if (minimatch(path, exclude[i])) return str;
    }
  }

  return new Promise(function(resolve, reject) {
    new CleanCSS(options).minify(str, function(err, result) {
      if (err) return reject(err);
      resolve(result.styles);
    });
  });
}


module.exports = run;
