# hexo-asset-pipeline

Asset pipeline for [Hexo](https://hexo.io/) to support minification and optimization of HTML, CSS, JS and images.

Supports hexo 3.x.x.

## Installation
``` bash
$ npm install hexo-asset-pipeline --save
```

## Configuration


Add the following snippet in `_config.yml`. 

Minimal config to enable filters for HTML, CSS, Js and images.
```yaml
asset_pipeline:
  clean_css:
    enable: true
  uglify:
    enable: true
  imagemin:
    enable: true
  html_minifier:
    enable: true
```


## Components
Following are the modules that are being used to process differnet types of assets.

### HTML (html_minifier)

[html-minifier](https://www.npmjs.com/package/html-minifier) is used to minify the HTML files.

#### Options
``` yaml
html_minifier:
  enable: true
  ignore_error: false
  exclude:
```
- **enable** - Enable the plugin. Defaults to `true`.
- **ignore_error** - Ignore the error occurred on parsing html
- **exclude**: Exclude files

**Note**: Check [html_minifier](https://www.npmjs.com/package/html-minifier#options-quick-reference) for more options.

### Javascripts (uglifyjs)
[https://www.npmjs.com/package/uglifyjs](uglifyjs) is used to minify javascripts.

#### Options
``` yaml
uglifyjs:
  enable: true
  mangle: true
  output:
  compress:
  exclude: 
    - '*.min.js'
```
- **enable** - Enable the plugin. Defaults to `true`.
- **mangle**: Mangle file names
- **output**: Output options
- **compress**: Compress options
- **exclude**: Exclude files


**Note**: Check [uglifyjs](https://www.npmjs.com/package/uglifyjs#usage) for more options.

### Stylesheets (clean_css)
[https://www.npmjs.com/package/clean-css](clean-css) is used to minify stylesheets.

#### Options
``` yaml
clean_css:
  enable: true
  exclude: 
    - '*.min.css'
```
- **enable** - Enable the plugin. Defaults to `true`.
- **exclude**: Exclude files


**Note**: Check [clean-css](https://www.npmjs.com/package/clean-css#use) for more options.


### Images (imagemin)
[https://www.npmjs.com/package/clean-css](imagemin) is used to optimize images.

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
- **enable** - Enable the plugin. Defaults to `true`.
- **interlaced** - Interlace gif for progressive rendering. Defaults to `false`.
- **multipass** - Optimize svg multiple times until it’s fully optimized. Defaults to `false`.
- **optimizationLevel** - Select an optimization level between 0 and 7. Defaults to `2`.
- **pngquant** - Enable [imagemin-pngquant](https://github.com/imagemin/imagemin-pngquant) plugin. Defaults to `false`.
- **progressive** - Lossless conversion to progressive. Defaults to `false`.
- **exclude** - Exclude specific types of image files, the input value could be `gif`,`jpg`, `png`, or `svg`. Default to null.

**Note**: Check [imagemin](https://www.npmjs.com/package/clean-css#use) for more options.


## TODO

* Versioning of assets.
* Add fonts for versioning.

