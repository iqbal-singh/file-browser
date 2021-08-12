export interface Directory {
  name: string;
  sizeKb: number;
  type: string;
  size?: number;
  path?: string;
  url?: string;
  mode?: string;
  sha?: string;
  items?: Directory[];
}
