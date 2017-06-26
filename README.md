# hexo-asset-pipeline
[![Dependency Status](https://david-dm.org/bhaskarmelkani/hexo-asset-pipeline/status.svg?style=flat)](https://david-dm.org/bhaskarmelkani/hexo-asset-pipeline) [![npm version](https://badge.fury.io/js/hexo-asset-pipeline.svg)](https://badge.fury.io/js/hexo-asset-pipeline)    [![GitHub issues](https://img.shields.io/github/issues/bhaskarmelkani/hexo-asset-pipeline.svg)](https://github.com/bhaskarmelkani/hexo-asset-pipeline/issues)

Asset pipeline for [Hexo](https://hexo.io/) to support minification and optimization of HTML, CSS, JS and images.
- Hexo 3.x.x

## Installation
``` bash
$ npm install hexo-asset-pipeline --save
```
## Configuration
Add the following snippet in `_config.yml`.

Minimal config to enable filters for HTML, CSS, Js and images.
```yaml
asset_pipeline:
  revisioning:
    enable: true
  clean_css:
    enable: true
  uglify_js:
    enable: true
  imagemin:
    enable: true
  html_minifier:
    enable: true
```
- **revisioning** - Enabling revisioning of assets..
- **clean_css** - Adding options for [clean-css](https://www.npmjs.com/package/clean-css).
- **uglify_js** - Adding options for [uglify-js](https://www.npmjs.com/package/uglify-js).
- **imagemin** - Adding options for [imagemin](https://www.npmjs.com/package/imagemin).
- **html_minifier** - Adding options for [html-minifier](https://www.npmjs.com/package/html-minifier).

## Components
Following are the modules that are being used to process differnet types of assets.

### HTML (html_minifier)
[html-minifier](https://www.npmjs.com/package/html-minifier) is used to minify the HTML files.

Following is the config for html-minifier.

#### Options
``` yaml
html_minifier:
  enable: true
  ignore_error: false
  exclude:
```
- **enable** - Enable the plugin. Defaults to `false`.
- **ignore_error** - Ignore the error occurred on parsing html
- **exclude**: Exclude files

#### html_minifier defaults
```yaml
html_minifier
  ignoreCustomComments: [/^\s*more/]
  removeComments: true
  removeCommentsFromCDATA: true
  collapseWhitespace: true
  collapseBooleanAttributes: true
  removeEmptyAttributes: true
  minifyJS: true
  minifyCSS: true
```

**Note**: Check [html-minifier](https://www.npmjs.com/package/html-minifier#options-quick-reference) for more options.

### Javascripts (uglify_js)
[uglify-js](https://www.npmjs.com/package/uglify-js) is used to minify javascripts.

Following is the config for uglify-js.
#### Options
``` yaml
uglify_js:
  enable: true
  mangle: true
  output:
  compress:
  exclude: 
    - '*.min.js'
```
- **enable** - Enable the plugin. Defaults to `false`.
- **mangle**: Mangle file names
- **output**: Output options
- **compress**: Compress options
- **exclude**: Exclude files

#### uglify-js defaults
```yaml
uglify_js:
  mangle: true
  exclude: ['*.min.js']
```

**Note**: Check [uglify-js](https://www.npmjs.com/package/uglify-js#minify-options) for more options.

### Stylesheets (clean_css)
[clean-css](https://www.npmjs.com/package/clean-css) is used to minify stylesheets.

Following is the config for clean-css.
#### Options
``` yaml
clean_css:
  enable: true
  exclude: 
    - '*.min.css'
```
- **enable** - Enable the plugin. Defaults to `false`.
- **exclude**: Exclude files

#### clean-css defaults
```yaml
clean_css:
  exclude: ['*.min.css']
```

**Note**: Check [clean-css](https://www.npmjs.com/package/clean-css#use) for more options.

### Images (imagemin)
[imagemin](https://www.npmjs.com/package/clean-css) is used to optimize images.

Following is the config for imagemin.
#### Options
```yaml
imagemin:
  enable: true
  interlaced: false
  multipass: false
  optimizationLevel: 2
  pngquant: false
  progressive: false
```
- **enable** - Enable the plugin. Defaults to `false`.
- **interlaced** - Interlace gif for progressive rendering. Defaults to `false`.
- **multipass** - Optimize svg multiple times until it’s fully optimized. Defaults to `false`.
- **optimizationLevel** - Select an optimization level between 0 and 7. Defaults to `2`.
- **pngquant** - Enable [imagemin-pngquant](https://github.com/imagemin/imagemin-pngquant) plugin. Defaults to `false`.
- **progressive** - Lossless conversion to progressive. Defaults to `false`.
- **exclude** - Exclude specific types of image files, the input value could be `gif`,`jpg`, `png`, or `svg`. Default to null.

#### imagemin defaults
```yaml
imagemin:
  interlaced: false
  multipass: false
  optimizationLevel: 3
  pngquant: false
  progressive: false
```

**Note**: Check [imagemin](https://www.npmjs.com/package/clean-css#use) for more options.

### Revisioning
```yaml
revisioning:
  enable: true
  keep: true
  selectors:
    'img[data-orign]':  data-orign
    'img[data-src]': 'data-src'
    'img[src]': 'src'
```
- **enable** - Enable the revisioning of assets. Defaults to `false`.
- **keep** - Keep original assets. Defaults to `false`.
- **selectors** - It is used so that custom implementations can be processed. Any attribute matching the key should have the asset url in the value. For instance in above example any element matching to `img[data-orign]` will have the URL for asset in `data-origin` attribute, this specific case can be helpful for [jquery lazyload](https://github.com/tuupola/jquery_lazyload) implementations.

#### Defaults for selectors;
```yaml
  selectors:
    'img[data-src]': 'data-src'
    'img[src]': 'src'
    'link[rel="apple-touch-icon"]': 'href'
    'link[rel="icon"]': 'href'
    'link[rel="shortcut icon"]': 'href'
    'link[rel="stylesheet"]': 'href'
    'script[src]': 'src'
    'source[src]': 'src'
    'video[poster]': 'poster'
```

###TODO
* Add tests
* Eslint and other configs
* Test plugin for relative paths
* Add option to add CDN
