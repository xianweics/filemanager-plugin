import { async } from './demo';

export const show = (msg) => {
  console.info(msg);
  async();
};
