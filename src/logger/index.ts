export const Logp = (s: string) => {
  return (...args: any[]) => {
    console.log(s, ...args);
  };
};
