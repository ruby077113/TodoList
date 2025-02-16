const http = require("http");
const errorHandle = require("./errorHandle");
const { v4: uuidv4 } = require("uuid");

const todos = [];

const requestListener = (req, response) => {
  const headers = {
    "Content-Type": "text/plain",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
  };
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  if (req.url === "/todos" && req.method === "GET") {
    response.writeHead(200, headers);
    response.write(JSON.stringify({ status: "success", data: todos }));
    response.end();
  } else if (req.url === "/todos" && req.method === "POST") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        if (!title) throw new Error();
        response.writeHead(200, headers);
        const item = { id: uuidv4(), title };
        todos.push(item);
        response.write(JSON.stringify({ status: "success", data: item }));
      } catch (error) {
        errorHandle(response, "欄位錯誤");
      } finally {
        response.end();
      }
    });
  } else if (req.url === "/todos/all" && req.method === "DELETE") {
    // 全部刪除
    todos.length = 0;
    response.writeHead(200, headers);
    response.write(JSON.stringify({ status: "success", data: "delete all" }));
    response.end();
  } else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    try {
      response.writeHead(200, headers);
      const id = req.url.split("/")[2];
      const index = todos.findIndex((todo) => todo.id === id);
      if (index === -1) throw new Error();
      todos.splice(index, 1);
      response.write(
        JSON.stringify({ status: "success", data: `delete ${id}` })
      );
    } catch (error) {
      errorHandle(response, "id錯誤");
    } finally {
      response.end();
    }
  } else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        const id = req.url.split("/").pop();
        const index = todos.findIndex((todo) => todo.id === id);
        if (index === -1 || !title) throw new Error();
        todos[index].title = title;
        response.write(
          JSON.stringify({ status: "success", data: `update ${id}` })
        );
      } catch (error) {
        errorHandle(response, "欄位錯誤");
      } finally {
        response.end();
      }
    });
  } else {
    response.writeHead(404, headers);
    response.write(JSON.stringify({ status: "false", data: "go away" }));
    response.end();
  }
};

const server = http.createServer(requestListener);

server.listen(process.env.PORT || 8080);
