const getSandbox = require('../support/sandbox');
const {process, mockConfig, contentFor} = require('hexo-test-utils');
const sandbox = getSandbox();

const originalContent =
`function test() {
  return { a: 5 }
}

test()`

test('minifies JavaScript code', async () => {
  const ctx = await sandbox({fixtureName: 'js'});
  mockConfig(ctx, 'asset_pipeline', {uglify_js: {enable: true}});

  await process(ctx);

  const content1 = await contentFor(ctx, 'mycode.js');

  expect(content1.toString().trim()).toBe('function test(){return{a:5}}test();');
});

test('preserves original content when disabled', async () => {
  const ctx = await sandbox({fixtureName: 'js'});
  mockConfig(ctx, 'asset_pipeline', {uglify_js: {enable: false}});

  await process(ctx);

  const content = await contentFor(ctx, 'mycode.js');

  expect(content.toString().trim()).toBe(originalContent);
});


test('respects the exclude option', async () => {
  const ctx = await sandbox({fixtureName: 'js'});
  mockConfig(ctx, 'asset_pipeline', {uglify_js: {enable: true, exclude: ['**/mycode.js']}});

  await process(ctx);

  const content = await contentFor(ctx, 'mycode.js');

  expect(content.toString().trim()).toBe(originalContent);
});
