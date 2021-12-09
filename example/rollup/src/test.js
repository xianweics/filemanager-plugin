const sync = () => {
  console.log('sync');
};

const async = () => {
  setTimeout(() => {
    console.log('async');
  });
};

export {
  sync,
  async
};
