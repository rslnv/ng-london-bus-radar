export type SearchInput =
  | SearchInputEmpty
  | SearchInputName
  | SearchInputSmsCode
  | SearchInputLocation;

export type SearchInputEmpty = {
  type: 'empty';
};

export type SearchInputName = {
  type: 'name';
  name: string;
};

export type SearchInputSmsCode = {
  type: 'smsCode';
  smsCode: string;
};

export type SearchInputLocation = {
  type: 'location';
  latitude: number;
  longitude: number;
};
