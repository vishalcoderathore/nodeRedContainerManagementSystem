const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(proxy("/api/*", { target: "http://localhost:5000" }));
  app.use(
    proxy("/socket.io/*", {
      target: "http://localhost/Target_test/nodered/dashboard"
    })
  );
  app.use(
    proxy("/css/*", {
      target: "http://localhost/Target_test/nodered/dashboard"
    })
  );
  app.use(
    proxy("/js/*", {
      target: "http://localhost/Target_test/nodered/dashboard"
    })
  );
};
