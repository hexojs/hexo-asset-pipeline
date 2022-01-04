'use strict';

const path = require('path');
const micromatch = require('micromatch');
const Promise = require('bluebird');
const hasha = require('hasha');
const revPath = require('rev-path');
const streamToArray = require('stream-to-array');
const streamToArrayAsync = Promise.promisify(streamToArray);
const extname = path.extname;
const Soup = require('soup');
let exclude;

//TODO: Check the implementation with relative, absolute reltive....
//Check options
//Add option of selector

/**
 * Function to check if path is a local path.
 */
function isLocalPath(filePath) {
  return typeof filePath === 'string' &&
    filePath.length &&
    filePath.indexOf('//') === -1 &&
    filePath.indexOf('data:') !== 0;
}

/**
 * Get filename from path
 * @param path
 * @returns {*|void|string} filename
 */
function getFileName(path) {
  var fileName = path.match(/(\/)*[^/]+$/)[0];
  return fileName.replace(/(\/)*([^/?]+)(\?.+)*$/, '$2');
}

function run() {
  const hexo = this;
  const route = hexo.route;
  const options = hexo.config.asset_pipeline.revisioning;
  const revIndex = hexo.assetPipeline.revIndex;
  const selectors = options.selectors;
  const routes = route.list();
  const keep = options.keep;
  const root = hexo.config.root;
  exclude = exclude || options.exclude;
  delete options.exclude;

  return Promise.mapSeries(routes, function(path){
    // console.log("--------------------------------------------------------------------------------------");
    // console.log("[revision] path: " + path);

    const stream = route.get(path);
    return streamToArrayAsync(stream)
    .then(function(arr) {
      if(typeof arr[0] === 'string'){
        return Buffer.from(arr[0]);
      }else{
        return Buffer.concat(arr);
      }
    }).then(function(buffer) {

      const ext = extname(path);

      /**
       * Skip excluded files.
       * */
      if (path && exclude && exclude.length) {
        if (micromatch.isMatch(path, exclude, { basename: true })) {
          // console.log('[revision]Ignoring '+ path)
          return false;
        }
      }

    // Assumption font,images are compiled first
    // If its a html file just update the URLs used in it
    if(ext.match(/(\.html|\.htm)/)){
      const htmlObj = new Soup(buffer.toString());
      let fileUpdated = false;
      for(let selector in selectors){
        const attr = selectors[selector];
        if(attr){
          htmlObj.setAttribute(selector, attr, function(oldValue){
            if(isLocalPath(oldValue)){
              // Remove first / or \, if its there as paths in tmpCache are without first /
              // Remove root path, and support post_asset_folder
              const newValue = revIndex[oldValue.replace(/\\/g, '/').replace(root, '')]
                  || revIndex[path.replace(/(.+\/).+$/, '$1') + oldValue];
              // Don't change Ignored file
              if (! newValue) return oldValue;
              // console.log('[revision] ' + oldValue + ' >>>>>>>>>>>>>>>>>> ' + newValue);
              fileUpdated = true;
              // Add root to path
              return root + newValue;
            } else {
              return oldValue;
            }
          })
        }
      }

      if(fileUpdated){
        return hexo.route.set(path, htmlObj.toString());
      }else{
        return true;
      }
    }

    // If its a js or css file, first replace linked assets then mode forward
    if(ext.match(/(\.js|\.css)/)){
      for(let key in revIndex){
        if(buffer.toString().match(root + key)){
          buffer = Buffer.from(buffer.toString().replace(key, revIndex[key]));
          // console.log('[revision] ' + key + ' >>>>>>>>>>>>>>>>>> ' + revIndex[key]);
        } else if (buffer.toString().match(getFileName(key))) {
          // Match and replace filename instead of path
          buffer = Buffer.from(buffer.toString().replace(getFileName(key), getFileName(revIndex[key])));
          // console.log('[revision] ' + getFileName(key) + ' >>>>>>>>>>>>>>>>>> ' + getFileName(revIndex[key]));
        }
      }
    }

    // Generate hash for the file and update its name.
    const hash = hasha(buffer, {algorithm: 'md5'});
    const revisedPath = revPath(path, hash).replace(/\\/g, '\/');   // unify path to slash

    revIndex[path] = revisedPath;
    //TODO: Check if you want to give an option to remove old assets
    if(! keep){
      hexo.route.remove(path);
    }
    // console.log('[revision] ' + revisedPath);
    return hexo.route.set(revisedPath, buffer);
  })
});
}


module.exports = run;
