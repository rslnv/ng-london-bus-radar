export type StopDetails = {
  id: string;
  commonName: string;
  stopLetter?: string;
  towards?: string;
  lines: { id: string; name: string }[];
};
