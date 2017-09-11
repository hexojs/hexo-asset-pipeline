'use strict';

const path = require('path');
const minimatch = require('minimatch');
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

function run() {
  const hexo = this;
  const route = hexo.route;
  const options = hexo.config.asset_pipeline.revisioning;
  const revIndex = hexo.assetPipeline.revIndex;
  const selectors = options.selectors;
  const routes = route.list();
  const keep = options.keep;
  exclude = exclude || options.exclude;
  delete options.exclude;

  return Promise.mapSeries(routes, function(path){
    const stream = route.get(path);
    return streamToArrayAsync(stream)
    .then(function(arr) {
      if(typeof arr[0] === 'string'){
        return arr[0];
      }else{
        return Buffer.concat(arr);
      }
    }).then(function(buffer) {

      const ext = extname(path);

      /**
       * Skip excluded files.
       * */
      if (exclude && !Array.isArray(exclude)) exclude = [exclude];

      if (path && exclude && exclude.length) {
        for (let i = 0, len = exclude.length; i < len; i++) {
          if (minimatch(path, exclude[i])){
            // console.log('Ignoring '+path+' files')
            return false;
          }
        }
      }

    // Assumption font,images are compiled first
    // If its a html file just update the URLs used in it
    if(ext.match(/(\.html|\.htm)/)){
      const htmlObj = new Soup(buffer);
      let fileUpdated = false;
      for(let selector in selectors){
        const attr = selectors[selector];
        if(attr){
          htmlObj.setAttribute(selector, attr, function(oldValue){
            if(isLocalPath(oldValue)){
              // Remove first /, if its there as paths in tmpCache are without first /
              oldValue = oldValue.replace(/^\//, '');
              const newValue = revIndex[oldValue];
              fileUpdated = true;
              return '/'+newValue;
            }else{
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
        if(buffer.match(key)){
          buffer = buffer.replace(key, revIndex[key]);
        }
      }
    }

    // Generate hash for the file and update its name.
    const hash = hasha(buffer, {algorithm: 'md5'});
    const revisedPath = revPath(path, hash);
    revIndex[path] = revisedPath;

    //TODO: Check if you want to give an option to remove old assets
    if(! keep){
      hexo.route.remove(path);
    }
    return hexo.route.set(revisedPath, buffer);
  })
});
}


module.exports = run;
