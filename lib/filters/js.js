const minimatch = require('minimatch');
const UglifyJS = require('uglify-js');
let enable;
let exclude;


function run(str, data) {
  const hexo = this;
  const options = hexo.config.asset_pipeline.uglifyjf;
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
   * Return if there is no hexo-asset-pipeline.uglifyjs in config.
   */
  if (!enable) {
    log.info('Filter(asset_pipeline.uglifyjs) is not enabled.Skipping it.')
    return Promise.resolve('Skipping asset_pipeline.uglifyjs.');
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
