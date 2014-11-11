var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(GLOBAL.process.env.PWD + "/../")).listen(8080);
