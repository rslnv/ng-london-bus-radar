export type ViewStateDone<T> = {
  state: 'done';
  data: T;
};

export type ViewStateLoading = {
  state: 'loading';
};

export type ViewStateIdle = {
  state: 'idle';
};

export type ViewStateError = {
  state: 'error';
  message: string | undefined;
};
