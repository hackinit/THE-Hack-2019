require("marko/express");
require("marko/node-require").install();

var express = require("express");
var app = express();

// app.get(["/ambassador", "/:lang/ambassador"], require("./src/pages/ambassador"));
// app.get(["/login", "/:lang/login"], require("./src/pages/login"));
// app.get(["/reset", "/:lang/reset"], require("./src/pages/reset"));
// app.get(["/register", "/:lang/register"], require("./src/pages/register"));
// app.get(["/apply", "/:lang/apply"], require("./src/pages/apply"));
// app.get(["/dashboard", "/:lang/dashboard"], require("./src/pages/dashboard"));
// app.get(["/confirm", "/:lang/confirm"], require("./src/pages/confirm"));
// app.get(["/team", "/:lang/team"], require("./src/pages/team"));
// app.get(["/sponsor", "/:lang/sponsor"], require("./src/pages/sponsor"));
app.get(["/:lang", "*"], require("./src/pages/home"));

app.listen(8080);
