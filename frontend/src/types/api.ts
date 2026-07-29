export type ApiResponse<T> = {
  status: "success";
  message: string;
  data: T;
};

export type ApiErrorResponse = Error & {
  status: "error";
  statusCode: number;
  message: string;
  data: null;
  stack?: string;
};
