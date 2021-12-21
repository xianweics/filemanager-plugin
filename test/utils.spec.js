import { flat, cacheSingle } from "../src/utils";

describe("test utils", () => {
  it("test flat method", () => {
    expect(flat([1, 2, [3, [4]]])).toMatchObject([1, 2, 3, 4]);
  });
  
  it(
    `test cacheSingle method: 'cacheSingle' should be the same as the previous one that created`,
    () => {
      const cs = cacheSingle();
      expect(cs).toMatchObject(cacheSingle());
    });
});


