const getSandbox = require('../support/sandbox');
const {process, mockConfig, contentFor} = require('hexo-test-utils');
const sandbox = getSandbox();

const originalContent =
`<html>
  <body>
    <h2>Hello</h2>
  </body>
</html>`


test('minifies HTML code', async () => {
  const ctx = await sandbox({fixtureName: 'html'});
  mockConfig(ctx, 'asset_pipeline', {html_minifier: {enable: true}});

  await process(ctx);

  const content1 = await contentFor(ctx, 'test.html');
  const content2 = await contentFor(ctx, 'test2.html');

  expect(content1.toString().trim()).toBe('<html><body><h2>Hello</h2></body></html>');
  expect(content2.toString().trim()).toBe('<html><body><h2>Hello too</h2></body></html>');
});

test('preserves original content when disabled', async () => {
  const ctx = await sandbox({fixtureName: 'html'});
  mockConfig(ctx, 'asset_pipeline', {html_minifier: {enable: false}});

  await process(ctx);

  const content = await contentFor(ctx, 'test.html');

  expect(content.toString().trim()).toBe(originalContent);
});
