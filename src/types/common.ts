export type Id = number | string;

export type ApiList<T> = {
  items: T[];
  total: number;
};
