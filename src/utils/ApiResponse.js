class ApiResponse {
  
  constructor(statusCode, data, message = "Success", success) {
    console.log("success ----------->", success);
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = success? false :statusCode < 400;
  }
}

export { ApiResponse };
