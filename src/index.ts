import http, { IncomingMessage, ServerResponse } from "http";

const friends = [
  { id: 0, name: "Nikola Tesla" },
  { id: 1, name: "Isaac Newton" },
];
const onRequest = (req: IncomingMessage, res: ServerResponse) => {
  const { url, method } = req;
  const items = url?.split("/");
  switch (method) {
    case "GET": {
      if (items?.[1] === "friends") {
        if (items.length === 3) {
          const idx = Number(items[2]);
          const friend = friends[idx];
          if (friend) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(friend));
          } else {
            res.statusCode = 404;
            res.end();
          }
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(friends));
        }
      } else if (items?.[1] === "page") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.write("<html>");
        res.write("<body>");
        res.write("<ul>");
        res.write("<li>Hello!</li>");
        res.write("<li>What are your thoughts on astronomy</li>");
        res.write("</ul>");
        res.write("</body>");
        res.write("</html>");
        res.end();
      } else {
        res.statusCode = 404;
        res.end();
      }
      break;
    }
    case "POST": {
      if (items?.[1] === "friends") {
        req.on("data", (data: Buffer) => {
          friends.push(JSON.parse(data.toString("utf-8")));
        });
        // * echo data back
        req.pipe(res);
      }
      break;
    }
  }
};
const server = http.createServer();
server.on("request", onRequest);

server.listen(3000, () => console.log("Listening on port 3000"));
