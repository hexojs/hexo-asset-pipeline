'use strict';

const Htmlminifier = require('html-minifier').minify;
const minimatch = require('minimatch');
let enable;
let exclude;


function run(str, data) {
  const hexo = this;
  const options = hexo.config.asset_pipeline.html_minifier;
  const path = data.path;
  const log = hexo.log || console;

  /**
   * Cache enable and exclude then delete from options as they are not clean_css options.
   */
  enable = enable || options.enable;
  delete options.enable;
  exclude = exclude || options.exclude;
  delete options.exclude;

  /**
   * Return if there is no hexo-asset-pipeline.html_minifier in config.
   */
  if (!enable) {
    log.info('Filter(asset_pipeline.html_minifier) is not enabled.Skipping it.')
    return Promise.resolve('Skipping asset_pipeline.html_minifier.');
  }

  if (exclude && !Array.isArray(exclude)) exclude = [exclude];

  if (path && exclude && exclude.length) {
    for (let i = 0, len = exclude.length; i < len; i++) {
      if (minimatch(path, exclude[i])) return str;
    }
  }

  let result = str;
  try {
    result = Htmlminifier(str, options);
    const saved = ((str.length - result.length) / str.length * 100).toFixed(2);
    //TODO: Make it nice, using log option in config.
    // log.log('update Optimize HTML: %s [ %s saved]', path, saved + '%');
  } catch (e) {
    if (options.ignore_error) {
      log.log('----------------------------------------');
      log.log('ignore the parse error: %s \n%s', path, e);
      log.log('----------------------------------------');
    } else {
      throw e;
    }
  }

  return result;

}

module.exports = run;
