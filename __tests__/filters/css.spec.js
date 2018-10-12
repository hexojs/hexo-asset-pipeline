const getSandbox = require('../support/sandbox');
const {process, mockConfig, contentFor} = require('hexo-test-utils');
const sandbox = getSandbox();

const originalContent =
`body {
  background-color: red;
}`

test('minifies CSS code', async () => {
  const ctx = await sandbox({fixtureName: 'css'});
  mockConfig(ctx, 'asset_pipeline', {clean_css: {enable: true}});

  await process(ctx);

  const content1 = await contentFor(ctx, 'mystyle.css');
  const content2 = await contentFor(ctx, 'mystyle2.css');

  expect(content1.toString().trim()).toBe('body{background-color:red}');
  expect(content2.toString().trim()).toBe('body{background-color:#ff0}');
});

test('preserves original content when disabled', async () => {
  const ctx = await sandbox({fixtureName: 'css'});
  mockConfig(ctx, 'asset_pipeline', {clean_css: {enable: false}});

  await process(ctx);

  const content = await contentFor(ctx, 'mystyle.css');

  expect(content.toString().trim()).toBe(originalContent);
});

test('respects the exclude option', async () => {
  const ctx = await sandbox({fixtureName: 'css'});
  mockConfig(ctx, 'asset_pipeline', {clean_css: {enable: true, exclude: ['**/mystyle.css']}});

  await process(ctx);

  const content = await contentFor(ctx, 'mystyle.css');

  expect(content.toString().trim()).toBe(originalContent);
});
