export type StopDetails = {
  id: string;
  stopLetter?: string;
  towards?: string;
  commonName: string;
  lines: { id: string; name: string }[];
};
