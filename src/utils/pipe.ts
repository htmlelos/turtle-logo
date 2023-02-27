export const pipe =
  (...fns: any[]) =>
  (initial: any) =>
    fns.reduce((value, process) => process(value), initial);
