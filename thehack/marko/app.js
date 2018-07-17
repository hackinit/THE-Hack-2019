require("marko/express");
require("marko/node-require").install();

var express = require("express");
var app = express();

//app.get(["/:lang", "*"], require("./src/pages/coming-soon"));
app.get(["/checkin"], require("./src/pages/checkin"));
app.get(["/:lang", "*"], require("./src/pages/home"));

app.listen(8080);
