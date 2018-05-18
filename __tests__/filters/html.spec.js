const getSandbox = require('../support/sandbox');
const {process, mockConfig, contentFor} = require('hexo-test-utils');
const sandbox = getSandbox();

const originalContent =
`<html>
  <body>
    <h2>Hello</h2>
  </body>
</html>`

test('preserves original content when disabled', async () => {
  const ctx = await sandbox({fixtureName: 'html'});
  mockConfig(ctx, 'asset_pipeline', {html_minifier: {enable: false}});

  await process(ctx);

  const content = await contentFor(ctx, 'test.html');

  expect(content.toString().trim()).toBe(originalContent);
});
