require("marko/express");
require("marko/node-require").install();

var express = require("express");
var app = express();

// app.get(["/coming-soon", "/:lang/coming-soon"], require("./src/pages/coming-soon"));
app.get(["/home", "/:lang/home"], require("./src/pages/home"));
app.get(["/team", "/:lang/team"], require("./src/pages/team"));
app.get(["/:lang", "*"], require("./src/pages/coming-soon"));

app.listen(8080);
