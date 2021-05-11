'use strict';

const minimatch = require('minimatch');
const Promise = require('bluebird');
const Imagemin = require('imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const gifsicle = require('imagemin-gifsicle');
const jpegtran = require('imagemin-jpegtran');
const optipng = require('imagemin-optipng');
const svgo = require('imagemin-svgo');
const streamToArray = require('stream-to-array');
const streamToArrayAsync = Promise.promisify(streamToArray);
const { checkFileIgnore } = require('../utils');
let enable;
let exclude;

function run(str, data) {
  // Init.
  const hexo = this;
  const options = hexo.config.asset_pipeline.imagemin;
  const targetfile = ['gif', 'jpg', 'png', 'svg'];
  const route = hexo.route;
  const log = hexo.log || console;

  /**
   * Cache enable and exclude then delete from options as they are not clean_css options.
   */
  enable = enable || options.enable;
  delete options.enable;
  exclude = exclude || options.exclude;
  delete options.exclude;

  /**
   * Return if there is no hexo-asset-pipeline.imagemin in config.
   */
  if (!enable) {
    log.info('Filter(asset_pipeline.imagemin) is not enabled.Skipping it.')
    return Promise.resolve('Skipping asset_pipeline.imagemin.');
  }

  // Return if disabled.
  //
  //
  if (exclude && exclude.length) {
    for (let i = 0, len = exclude.length; i < len; ++i) {
      let idx = targetfile.indexOf(exclude[i]);
      if (idx != -1) {
        targetfile.splice(-1, 1);
      }
    }
  }

  // exclude image
  const routes = route.list().filter(function(path) {
    return minimatch(path, '**/*.{' + targetfile.join(',') + '}', {
      nocase: true
    }) && !checkFileIgnore(path, exclude);
  });

  // Filter routes to select all images.
  // Retrieve image contents, and minify it.
  return Promise.map(routes, function(path) {
    // Retrieve and concatenate buffers.
    const stream = route.get(path);
    return streamToArrayAsync(stream)
      .then(function(arr) {
        return Buffer.concat(arr);
      }).then(function(buffer) {
        // Create the Imagemin instance.
        const imageminOption = {
          plugins: [
            mozjpeg({
              progressive: options.progressive
            }),
            gifsicle({
              interlaced: options.interlaced
            }),
            jpegtran({
              progressive: options.progressive
            }),
            optipng({
              optimizationLevel: options.optimizationLevel
            }),
            svgo({
              multipass: options.multipass
            })
          ]
        };

        // Add additional plugins.
        if (options.pngquant) { // Lossy compression.
          imageminOption.plugins.push(pngquant());
        }

        return Imagemin.buffer(buffer, imageminOption)
          .then(function(newBuffer) {
            const length = buffer.length;
            if (newBuffer && length > newBuffer.length) {
              const saved = ((length - newBuffer.length) / length * 100).toFixed(2);
              //TODO: Make it nice, using log option in config.
              // log.log('update Optimize IMG: %s [ %s saved]', path, saved + '%');
              route.set(path, newBuffer); // Update the route.
            }
          });
      });
  });
}


module.exports = run;
