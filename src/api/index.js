export function fetchItem() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { name: 'foo' },
        { name: 'bar' },
        { name: 'baz' }
      ])
    }, 1000);
  });
}