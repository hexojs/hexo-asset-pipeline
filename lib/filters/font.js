let enable;
let exclude;

function run(str, data) {
  const hexo = this;
  const options = hexo.config.asset_pipeline.clean_css;
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
   * Return if there is no hexo-asset-pipeline.font in config.
   */
  if (!enable) {
    log.info('Filter(asset_pipeline.font) is not enabled.Skipping it.')
    return Promise.resolve('Skipping asset_pipeline.font.');
  }

  return Promise.resolve('Done');
}


module.exports = run;
