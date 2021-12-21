import { WebpackFilemanager, RollupFilemanager } from "../src";
import { join } from "path";
import fs from "fs-extra";
import webpack from "webpack";
import { rollup } from "rollup";
import { webpackRunner } from "./__mock__/utils";

describe("test index file", () => {
  const mockRoot = join(__dirname, "../test/.cache");
  
  let mockDelPath1 = "";
  let mockDelPath2 = "";
  let mockCopySource = "";
  let mockCopyDestination = "";
  let mockMoveSource = "";
  let mockMoveDestination = "";
  let mockOldName = "";
  let mockNewName = "";
  let mockRenameSource = "";
  let mockRenamePath = "";
  let mockRenameDestination = "";
  let mockUnZipSource1 = "";
  let mockUnZipSource2 = "";
  let mockUnZipSource3 = "";
  let mockUnZipDestination = "";
  let mockZipSource1 = "";
  let mockZipSource2 = "";
  let mockZipSource3 = "";
  let mockZipDestination1 = "";
  let mockZipDestination2 = "";
  let mockZipDestination3 = "";
  let webpackCompiler = null;
  
  beforeEach(() => {
    fs.removeSync(mockRoot);
    
    mockDelPath1 = join(mockRoot, "del", "index1.html");
    fs.ensureFileSync(mockDelPath1);
    
    mockDelPath2 = join(mockRoot, "del", "index2.html");
    fs.ensureFileSync(mockDelPath2);
    
    mockCopySource = join(mockRoot, "copy", "index.html");
    fs.ensureFileSync(mockCopySource);
    mockCopyDestination = join(mockRoot, "copy", "dist");
    
    mockMoveSource = join(mockRoot, "move", "index.html");
    fs.ensureFileSync(mockMoveSource);
    mockMoveDestination = join(mockRoot, "move", "dist");
    
    mockOldName = "index.html";
    mockNewName = "index1.html";
    mockRenameSource = join(mockRoot, "rename", mockOldName);
    fs.ensureFileSync(mockRenameSource);
    mockRenamePath = join(mockRoot, "rename");
    mockRenameDestination = join(mockRoot, "rename", mockNewName);
    
    mockUnZipDestination = join(mockRoot, "unzip");
    fs.emptyDirSync(mockUnZipDestination);
    mockUnZipSource1 = join(__dirname, "__mock__/unzip/a.tar");
    mockUnZipSource2 = join(__dirname, "__mock__/unzip/b.zip");
    mockUnZipSource3 = join(__dirname, "__mock__/unzip/c.tar.gz");
    
    mockZipSource1 = join(mockRoot, "zip", "index.html");
    fs.ensureFileSync(mockZipSource1);
    mockZipDestination1 = join(mockRoot, "zip", "a.gz");
  
    mockZipSource2 = join(mockRoot, "zip", "index.html");
    fs.ensureFileSync(mockZipSource2);
    mockZipDestination2 = join(mockRoot, "zip", "b.tgz");
  
    mockZipSource3 = join(mockRoot, "zip", "index.html");
    fs.ensureFileSync(mockZipSource3);
    mockZipDestination3 = join(mockRoot, "zip", "c.zip");
    
    webpackCompiler = webpack({
      mode: "production",
      entry: join(__dirname, "__mock__/index.js")
    });
  });
  
  afterEach(() => {
    fs.removeSync(mockRoot);
  });
  
  it("test webpack with normal", async () => {
    expect(fs.pathExistsSync(mockMoveSource)).toBeTruthy();
    expect(fs.pathExistsSync(mockMoveDestination)).toBeFalsy();
    
    const fileManger = new WebpackFilemanager({
      events: {
        end: {
          move: {
            items: [
              {
                source: mockMoveSource,
                destination: mockMoveDestination
              }
            ]
          }
        },
        start: {
          unzip: {
            items: [
              {
                source: mockUnZipSource1,
                destination: mockUnZipDestination,
                type: "tar"
              },
              {
                source: mockUnZipSource2,
                destination: mockUnZipDestination
              },
              {
                source: mockUnZipSource3,
                destination: mockUnZipDestination,
                type: "tgz"
              }
            ]
          }
        }
      },
      options: {
        log: "error",
        cache: false
      }
    });
    
    fileManger.apply(webpackCompiler);
    await webpackRunner(webpackCompiler);
    
    expect(fs.pathExistsSync(mockMoveSource)).toBeFalsy();
    expect(fs.pathExistsSync(join(mockMoveDestination, "index.html")))
      .toBeTruthy();
    expect(fs.pathExistsSync(join(mockUnZipDestination, "a/index.html")))
      .toBeTruthy();
    expect(fs.pathExistsSync(join(mockUnZipDestination, "b/bb/index.html")))
      .toBeTruthy();
    expect(fs.pathExistsSync(join(mockUnZipDestination, "c/c.css")))
      .toBeTruthy();
  });
  
  it("test webpack with parallel", async () => {
    expect(fs.pathExistsSync(mockDelPath1)).toBeTruthy();
    expect(fs.pathExistsSync(mockCopySource)).toBeTruthy();
    expect(fs.pathExistsSync(mockCopyDestination)).toBeFalsy();
    
    const fileManger = new WebpackFilemanager({
      customHooks: [
        {
          hookType: "tapAsync",
          hookName: "beforeCompile",
          commands: {
            del: {
              items: [mockDelPath1]
            }
          }
        },
        {
          hookName: "compilation",
          hookType: "tap",
          commands: {
            copy: {
              items: [
                {
                  source: mockCopySource,
                  destination: mockCopyDestination
                }
              ]
            },
            del: {
              items: []
            },
            rename: {},
            otherOption: {}
          }
        },
        {
          hookName: "invalid hook name",
          hookType: "invalid hook type",
          commands: {
            del: {
              items: [mockDelPath2]
            }
          }
        }
      ],
      options: {
        parallel: 4,
        log: "all",
        cache: false
      }
    });
    
    fileManger.apply(webpackCompiler);
    await webpackRunner(webpackCompiler);
    
    expect(fs.pathExistsSync(mockDelPath1)).toBeFalsy();
    expect(fs.pathExistsSync(mockDelPath2)).toBeTruthy();
    expect(fs.pathExistsSync(mockCopyDestination)).toBeTruthy();
  });
  
  it("test rollup with empty, did not crash", async () => {
    try {
      await rollup({
        input: join(__dirname, "__mock__/index.js"),
        plugins: [
          RollupFilemanager({})
        ]
      });
      await rollup({
        input: join(__dirname, "__mock__/index.js"),
        plugins: [
          RollupFilemanager(null)
        ]
      });
      expect(true).toBeTruthy();
    } catch {
      expect(true).toBeFalsy();
    }
  });
  
  it("test rollup with normal", async () => {
    expect(fs.pathExistsSync(mockDelPath1)).toBeTruthy();
    expect(fs.pathExistsSync(mockCopySource)).toBeTruthy();
    expect(fs.pathExistsSync(mockCopyDestination)).toBeFalsy();
    expect(fs.pathExistsSync(mockRenameDestination)).toBeFalsy();
    expect(fs.pathExistsSync(mockRenameSource)).toBeTruthy();
    
    await rollup({
      input: join(__dirname, "__mock__/index.js"),
      plugins: [
        RollupFilemanager({
          customHooks: [
            {
              hookName: "buildEnd",
              commands: {
                del: {
                  items: [mockDelPath1]
                },
                zip: {
                  items: [
                    {
                      source: mockZipSource1,
                      destination: mockZipDestination1,
                      type: 'gzip'
                    },
                    {
                      source: mockZipSource2,
                      destination: mockZipDestination2,
                      type: 'tgz'
                    },
                    {
                      source: mockZipSource3,
                      destination: mockZipDestination3,
                    }
                  ]
                }
              }
            },
            {
              hookName: "buildStart",
              commands: {
                copy: {
                  items: [
                    {
                      source: mockCopySource,
                      destination: mockCopyDestination
                    }
                  ]
                },
                rename: {
                  items: [
                    {
                      path: mockRenamePath,
                      oldName: mockOldName,
                      newName: mockNewName
                    }
                  ]
                }
              }
            }
          ],
          options: {
            cache: false
          }
        })
      ]
    });
    expect(fs.pathExistsSync(mockDelPath1)).toBeFalsy();
    expect(fs.pathExistsSync(mockCopyDestination)).toBeTruthy();
    expect(fs.pathExistsSync(mockRenameSource)).toBeFalsy();
    expect(fs.pathExistsSync(mockRenameDestination)).toBeTruthy();
  
    expect(fs.pathExistsSync(mockZipDestination1)).toBeTruthy();
    expect(fs.pathExistsSync(mockZipDestination2)).toBeTruthy();
    expect(fs.pathExistsSync(mockZipDestination3)).toBeTruthy();
  });
  
  it("test rollup with parallel", async () => {
    expect(fs.pathExistsSync(mockDelPath1)).toBeTruthy();
    expect(fs.pathExistsSync(mockDelPath2)).toBeTruthy();
    
    await rollup({
      input: join(__dirname, "__mock__/index.js"),
      plugins: [
        RollupFilemanager({
          events: {
            start: {
              del: {
                items: [mockDelPath1, mockDelPath2]
              },
              otherOption: null
            },
            invalidEvents: {},
            nullEvents: null
          },
          options: {
            parallel: 1
          }
        })
      ]
    });
    
    expect(fs.pathExistsSync(mockDelPath1)).toBeFalsy();
    expect(fs.pathExistsSync(mockDelPath2)).toBeFalsy();
  });
});
