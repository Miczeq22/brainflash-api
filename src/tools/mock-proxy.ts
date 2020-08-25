export const createMockProxy = <T>() => {
  const cache = new Map();

  const handler: ProxyHandler<object> = {
    get: (_, name: string) => {
      if (name === 'mockClear') {
        return () => cache.clear();
      }

      if (!cache.get(name)) {
        cache.set(name, jest.fn());
      }

      return cache.get(name);
    },
  };

  return new Proxy({}, handler) as jest.Mocked<T> & { mockClear: () => void };
};
