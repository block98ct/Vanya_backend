class ApiResponse {
  constructor(statusCode, data, message = "Success", success) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = success? false :statusCode < 400;
  }
}

module.exports =  ApiResponse ;
