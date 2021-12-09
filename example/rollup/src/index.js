import { async } from "./test";

export const show = (msg) => {
  console.info(msg);
  async();
};

show('haha');
