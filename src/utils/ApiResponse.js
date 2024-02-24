class ApiResponse {
  constructor(
    statusCode,
    message = "Success ",
    data,
    success = statusCode < 400
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success;
  }
}

export default ApiResponse;
