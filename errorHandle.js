function errorHandle(response, errorMessage) {
  const headers = {
    "Content-Type": "text/plain",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
  };
  response.writeHead(400, headers);
  response.write(JSON.stringify({ status: "false", data: errorMessage }));
  response.end();
}
module.exports = errorHandle;
