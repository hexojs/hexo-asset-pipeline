const filters = require('./lib/filters');
const revision = require('./lib/revision');


/**
 * CSS config.
 */
const cleanCssDefaults = {};

const cssConfig = {
  exclude: ['*.min.css']
};

hexo.config.asset_pipeline.clean_css = Object.assign(cleanCssDefaults, cssConfig, hexo.config.asset_pipeline.clean_css);

hexo.extend.filter.register('after_render:css', filters.css);


/**
 * Js config.
 */
const uglifyjsDefaults = {
  mangle: true
};

const jsConfig = {
  exclude: ['*.min.js']
};

hexo.config.asset_pipeline.uglify_js = Object.assign(uglifyjsDefaults, jsConfig, hexo.config.asset_pipeline.uglify_js);

hexo.extend.filter.register('after_render:js', filters.js);


/**
 * HTML config.
 */
const htmlMinifierDefaults = {
  ignoreCustomComments: [/^\s*more/],
  removeComments: true,
  removeCommentsFromCDATA: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  removeEmptyAttributes: true,
  minifyJS: true,
  minifyCSS: true
};

const htmlConfig = {
  exclude: []
}

hexo.config.asset_pipeline.html_minifier = Object.assign(htmlMinifierDefaults, htmlConfig, hexo.config.asset_pipeline.html_minifier);

hexo.extend.filter.register('after_render:html', filters.html);


/**
 * Image config.
 */
const imageminDefaults = {
  interlaced: false,
  multipass: false,
  optimizationLevel: 3,
  pngquant: false,
  progressive: false
}

const imageConfig = {};
hexo.config.asset_pipeline.imagemin = Object.assign(imageminDefaults, imageConfig, hexo.config.asset_pipeline.imagemin);

hexo.extend.filter.register('after_generate', filters.image);


/**
 * Hook to enable revisioning.
 */
const revisioningDefaults = {};
const soupConfig = {
  selectors: {
    'img[data-src]': 'data-src',
    'img[src]': 'src',
    'link[rel="apple-touch-icon"]': 'href',
    'link[rel="icon"]': 'href',
    'link[rel="shortcut icon"]': 'href',
    'link[rel="stylesheet"]': 'href',
    'script[src]': 'src',
    'source[src]': 'src',
    'video[poster]': 'poster'
  }
};
hexo.config.asset_pipeline.revisioning= Object.assign(revisioningDefaults, soupConfig, hexo.config.asset_pipeline.revisioning);

if(hexo.config.asset_pipeline.revisioning.enable){
  hexo.extend.filter.register('after_generate', revision);
}
hexo.extend.filter.register('after_init', function(){
  // Setup assetPipeline for caching data
  hexo.assetPipeline = {
    revIndex: {}
  }
});
hexo.extend.filter.register('before_exit', function(){
  //Cleanup
  delete hexo.assetPipeline;
});
