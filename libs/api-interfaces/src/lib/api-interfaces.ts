export interface Directory {
  name: string;
  sizeKb: number;
  type: 'dir' | 'file';
  items?: Directory[];
}
