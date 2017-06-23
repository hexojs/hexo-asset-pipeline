
const filter = require('lib/filters');

hexo.filter.register('after_render:html', filters.html);
hexo.filter.register('after_render:css', filters.css);
hexo.filter.register('after_render:js', filters.js);
hexo.filter.register('after_generate', filters.image);
hexo.filter.register('after_generate', filters.fonts);
