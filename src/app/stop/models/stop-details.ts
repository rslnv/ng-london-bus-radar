export type StopDetails = {
  stopLetter?: string;
  towards?: string;
  commonName: string;
  lines: { id: string; name: string }[];
};
