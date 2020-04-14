const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
const { rollup } = require('rollup');
const { rollupFilemanager } = require('../../lib/index.js');

async function buildBundle(type, mockPathStart, mockPathEnd) {
  const bundle = await rollup({
    input: 'test/rollupPlugin/fixtures/index.js',
    plugins: [rollupFilemanager({
      events: {
        start: {
          [type]: {
            items: [mockPathStart]
          }
        },
        end: {
          [type]: {
            items: [mockPathEnd]
          }
        }
      }
    })]
  });
  return bundle;
}

describe('test rollupPlugin', () => {
  const testPath = 'test/rollupPlugin/fixtures';
  fs.ensureFileSync(`${testPath}/index.js`);

  it('test rollupPlugin del', async () => {
    const mockPath = `${testPath}/del.js`;
    const mockPath1 = `${testPath}/del1.js`;
    fs.ensureFileSync(mockPath);
    fs.ensureFileSync(mockPath1);
    expect(fs.pathExistsSync(mockPath)).equals(true);
    expect(fs.pathExistsSync(mockPath1)).equals(true);
    const bundle = await buildBundle('del', mockPath, mockPath1);
    await bundle.generate({ format: 'cjs' });
    expect(fs.pathExistsSync(mockPath)).equals(false);
    expect(fs.pathExistsSync(mockPath1)).equals(false);
  });

  it('test rollupPlugin copy', async () => {
    const mockPath = { source: `${testPath}/copy.js`, destination: `${testPath}/copy/copy.js` };
    const mockPath1 = { source: `${testPath}/copy1.js`, destination: `${testPath}/copy/copy1.js` };
    fs.ensureFileSync(mockPath.source);
    fs.ensureFileSync(mockPath1.source);
    expect(fs.pathExistsSync(mockPath.destination)).equals(false);
    expect(fs.pathExistsSync(mockPath1.destination)).equals(false);
    const bundle = await buildBundle('copy', mockPath, mockPath1);
    await bundle.generate({ format: 'cjs' });
    expect(fs.pathExistsSync(mockPath.destination)).equals(true);
    expect(fs.pathExistsSync(mockPath1.destination)).equals(true);
  });

  it('test rollupPlugin rename', async () => {
    fs.ensureFileSync(`${testPath}/a.js`);
    fs.ensureFileSync(`${testPath}/b.js`);
    const mockPath =  { path: `${testPath}`, oldName: 'a.js', newName: 'a1.js' };
    const mockPath1 = { path: `${testPath}`, oldName: 'b.js', newName: 'b1.js' };
    expect(fs.pathExistsSync(`${testPath}/${mockPath.newName}`)).equals(false);
    expect(fs.pathExistsSync(`${testPath}/${mockPath.newName}`)).equals(false);
    const bundle = await buildBundle('rename', mockPath, mockPath1);
    await bundle.generate({ format: 'cjs' });
    expect(fs.pathExistsSync(`${testPath}/${mockPath.newName}`)).equals(true);
    expect(fs.pathExistsSync(`${testPath}/${mockPath.newName}`)).equals(true);
  });

  it('test rollupPlugin move', async () => {
    fs.ensureFileSync(`${testPath}/m.js`);
    fs.ensureFileSync(`${testPath}/v.js`);
    const mockPath =  { source: `${testPath}/m.js`, destination: `${testPath}/move/m.js` };
    const mockPath1 = { source: `${testPath}/v.js`, destination: `${testPath}/move/v.js` };
    expect(fs.pathExistsSync(mockPath.destination)).equals(false);
    expect(fs.pathExistsSync(mockPath.destination)).equals(false);
    const bundle = await buildBundle('move', mockPath, mockPath1);
    await bundle.generate({ format: 'cjs' });
    expect(fs.pathExistsSync(mockPath.destination)).equals(true);
    expect(fs.pathExistsSync(mockPath.destination)).equals(true);
  });

  it('test rollupPlugin unzip', async () => {
    fs.ensureFileSync(`${testPath}/u.js.zip`);
    fs.ensureFileSync(`${testPath}/n.js.gzip`);
    const mockPath =  { source: `${testPath}/u.js.zip`, destination: `${testPath}/unzip/u.js` };
    const mockPath1 = { source: `${testPath}/n.js.gzip`, destination: `${testPath}/unzip/n.js`, type: 'gzip' };
    expect(fs.pathExistsSync(mockPath.destination)).equals(false);
    expect(fs.pathExistsSync(mockPath.destination)).equals(false);
    const bundle = await buildBundle('unzip', mockPath, mockPath1);
    await bundle.generate({ format: 'cjs' });
    expect(fs.pathExistsSync(mockPath.destination)).equals(true);
    expect(fs.pathExistsSync(mockPath.destination)).equals(true);
  });

  it('test rollupPlugin zip', async () => {
    fs.ensureFileSync(`${testPath}/z.js`);
    fs.ensureFileSync(`${testPath}/i.js`);
    const mockPath =  { source: `${testPath}/z.js`, destination: `${testPath}/zip/z.js.zip` };
    const mockPath1 = { source: `${testPath}/i.js`, destination: `${testPath}/zip/i.js.tar`, type: 'tar' };
    expect(fs.pathExistsSync(mockPath.destination)).equals(false);
    expect(fs.pathExistsSync(mockPath.destination)).equals(false);
    const bundle = await buildBundle('zip', mockPath, mockPath1);
    await bundle.generate({ format: 'cjs' });
    expect(fs.pathExistsSync(mockPath.destination)).equals(true);
    expect(fs.pathExistsSync(mockPath.destination)).equals(true);
  });

  it('test rollupPlugin customHooks ', async () => {
    const mockPath = `${testPath}/c.js`;
    fs.ensureFileSync(mockPath);
    expect(fs.pathExistsSync(mockPath)).equals(true);
    const bundle = await rollup({
      input: 'test/rollupPlugin/fixtures/index.js',
      plugins: [rollupFilemanager({
        events: { format: 'cjs' },
        customHooks: [
          {
            hookName: 'buildEnd',
            commands: {
              del: {
                items: [mockPath]
              }
            }
          }
        ]
      })]
    });
    await bundle.generate({ format: 'cjs' });
    expect(fs.pathExistsSync(mockPath)).equals(false);
  });

  it('test rollupPlugin customHooks ', async () => {
    const mockPath = `${testPath}/c.js`;
    fs.ensureFileSync(mockPath);
    expect(fs.pathExistsSync(mockPath)).equals(true);
    const bundle = await rollup({
      input: 'test/rollupPlugin/fixtures/index.js',
      plugins: [rollupFilemanager({
        events: {},
        customHooks: [
          {
            hookName: 'buildEnd',
            commands: {
              del: {
                items: [mockPath]
              }
            }
          }
        ]
      })]
    });
    await bundle.generate({ format: 'cjs' });
    expect(fs.pathExistsSync(mockPath)).equals(false);
  });

  it('test rollupPlugin: custom hook is prior than event hook', async () => {
    const mockPathStart = `${testPath}/start.js`;
    const mockPathEnd = `${testPath}/end.js`;
    const mockPathCust1 = `${testPath}/cust1.js`;
    const mockPathCust2 = `${testPath}/cust2.js`;
    fs.ensureFileSync(mockPathStart);
    fs.ensureFileSync(mockPathEnd);
    fs.ensureFileSync(mockPathCust1);
    fs.ensureFileSync(mockPathCust2);
    expect(fs.pathExistsSync(mockPathStart)).equals(true);
    expect(fs.pathExistsSync(mockPathEnd)).equals(true);
    expect(fs.pathExistsSync(mockPathCust1)).equals(true);
    expect(fs.pathExistsSync(mockPathCust2)).equals(true);
    const bundle = await rollup({
      input: 'test/rollupPlugin/fixtures/index.js',
      plugins: [rollupFilemanager({
        events: {
          start: {
            del: {
              items: [mockPathStart]
            }
          },
          end: {
            del: {
              items: [mockPathEnd]
            }
          }
        },
        customHooks: [
          {
            hookName: 'generateBundle',
            commands: {
              del: {
                items: [mockPathCust1]
              }
            }
          },
          {
            hookName: 'buildStart',
            commands: {
              del: {
                items: [mockPathCust2]
              }
            }
          }
        ]
      })]
    });
    await bundle.generate({ format: 'cjs' });
    expect(fs.pathExistsSync(mockPathStart)).equals(true);
    expect(fs.pathExistsSync(mockPathEnd)).equals(true);
    expect(fs.pathExistsSync(mockPathCust1)).equals(false);
    expect(fs.pathExistsSync(mockPathCust2)).equals(false);
  });

  after(() => {
    fs.removeSync(testPath);
  });
});

