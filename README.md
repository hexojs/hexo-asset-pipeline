# hexo-asset-pipeline

asset_pipeline:
  clean_css:
    enable: true
  uglify:
    enable: true
    mangle: true
  imagemin:
    enable: true
    interlaced : false
    multipass  : false
    optimizationLevel: 2
    pngquant   : false
    progressive: false
  html_minifier:
    enable: true
    ignore_error: false
    exclude:
