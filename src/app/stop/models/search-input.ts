export type SearchInput =
  | SearchInputEmpty
  | SearchInputName
  | SearchInputSmsCode
  | SearchInputPostcode
  | SearchInputCoordinates
  | SearchInputCurrentPosition;

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

export type SearchInputPostcode = {
  type: 'postcode';
  postcode: string;
};

export type SearchInputCoordinates = {
  type: 'coordinates';
  latitude: number;
  longitude: number;
};

export type SearchInputCurrentPosition = {
  type: 'currentPosition';
};
