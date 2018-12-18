'use strict';

const path = require('path');
const Promise = require('bluebird');
const hasha = require('hasha');
const revPath = require('rev-path');
const streamToArray = require('stream-to-array');
const streamToArrayAsync = Promise.promisify(streamToArray);
const extname = path.extname;
const Soup = require('soup');
const { bufferFromParts, getPaths, checkFileIgnore } = require('./utils');
const isBinaryBuffer = require('is-binary-buffer');

//TODO:Check options
//Add option of selector

/**
 * Function to check if path is a local path.
 * @param {String} filePath
 */
function isLocalPath(filePath) {
  return (
    typeof filePath === 'string' &&
    filePath.length &&
    filePath.indexOf('//') === -1 &&
    filePath.indexOf('data:') !== 0
  );
}

/**
 * Add revisioning hash to all available files
 */
function hashFiles() {
  const route = hexo.route;
  const options = hexo.config.asset_pipeline.revisioning;
  const revIndex = hexo.assetPipeline.revIndex;
  const routes = route.list();
  const keep = options.keep;
  const exclude = Array.isArray(options.exclude) ? options.exclude : [exclude];

  return Promise.mapSeries(routes, function(path) {
    const stream = route.get(path);

    return streamToArrayAsync(stream).then(function(parts) {
      if (checkFileIgnore(path, exclude) || path.match(/(\.html|\.htm)/)) {
        return false;
      }

      const buffer = bufferFromParts(parts);
      const hash = hasha(buffer, { algorithm: 'md5' });
      const revisedPath = revPath(path, hash).replace(/\\/g, '/'); // unify path to slash

      revIndex[path] = revisedPath;
      //TODO: Check if you want to give an option to remove old assets
      if (!keep) {
        hexo.route.remove(path);
      }
      // console.log('[revision] ' + revisedPath);
      return hexo.route.set(revisedPath, buffer);
    });
  });
}

/**
 * Replace original links inside of html, js and css files to revisioned files
 */
function replaceLinks() {
  const route = hexo.route;
  const options = hexo.config.asset_pipeline.revisioning;
  const revIndex = hexo.assetPipeline.revIndex;
  const selectors = options.selectors;
  const routes = route.list();
  const root = hexo.config.root;
  const exclude = Array.isArray(options.exclude) ? options.exclude : [exclude];
  const replaceInIgnored = options.replace_in_ignored;
  const relativeDirs = options.relative_dirs;

  return Promise.mapSeries(routes, function(path) {
    if (!replaceInIgnored && checkFileIgnore(path, exclude)) {
      return path;
    }

    const stream = route.get(path);

    return streamToArrayAsync(stream).then(function(parts) {
      const ext = extname(path);
      let buffer = bufferFromParts(parts);

      if (isBinaryBuffer(buffer)) {
        return path;
      }

      let stringBuffer = buffer.toString();
      const hash = hasha(buffer, { algorithm: 'md5' });
      const allowReplace = path.match(hash) || (!replaceInIgnored && checkFileIgnore(path, exclude));
      // Assumption font,images are compiled first
      // If its a html file just update the URLs used in it
      if (ext.match(/(\.html|\.htm)/)) {
        const htmlObj = new Soup(stringBuffer);
        let fileUpdated = false;

        for (let selector in selectors) {
          const attr = selectors[selector];

          if (attr) {
            htmlObj.setAttribute(selector, attr, function(oldValue) {
              if (isLocalPath(oldValue)) {
                // Remove first / or \, if its there as paths in tmpCache are without first /
                // Remove root path, and support post_asset_folder
                const newValue =
                  revIndex[oldValue.replace(/\\/g, '/').replace(root, '')] ||
                  revIndex[path.replace(/(.+\/).+$/, '$1') + oldValue];
                // Don't change Ignored file
                if (!newValue) return oldValue;
                // console.log('[revision] ' + oldValue + ' >>>>>>>>>>>>>>>>>> ' + newValue);
                fileUpdated = true;
                // Add root to path
                return root + newValue;
              } else {
                return oldValue;
              }
            });
          }
        }

        if (fileUpdated) {
          return hexo.route.set(path, Buffer.from(htmlObj.toString()));
        } else {
          return true;
        }
      }

      // If its a js or css file, replacing linked assets
      if (ext.match(/(\.js|\.css)/) && allowReplace) {
        for (let key in revIndex) {
          const paths = getPaths(root, key, relativeDirs);
          const target = new RegExp(`${paths.absolute}|/?${paths.relative}`);

          stringBuffer = stringBuffer.replace(target, root + revIndex[key]);
        }
      }

      buffer = Buffer.from(stringBuffer);

      return hexo.route.set(path, buffer);
    });
  });
}
module.exports = { hashFiles, replaceLinks };
