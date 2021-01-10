require("marko/node-require").install(); // Allow Node.js to require and load `.marko` files

const express = require("express");
const markoExpress = require("marko/express");

const app = express();
const port = 8080;

var template = require("../2018/thehack/marko/src/pages/home/template.marko");

app.use(markoExpress()); // enable res.marko(template, data)

var isProduction = process.env.NODE_ENV === "production";

// Configure lasso to control how JS/CSS/etc. is delivered to the browser
require("lasso").configure({
  plugins: [
    "lasso-marko", // Allow Marko templates to be compiled and transported to the browser
  ],
  outputDir: __dirname + "/static", // Place all generated JS/CSS/etc. files into the "static" dir
  bundlingEnabled: isProduction, // Only enable bundling in production
  minify: isProduction, // Only minify JS and CSS code in production
  fingerprintsEnabled: isProduction, // Only add fingerprints to URLs in production
});

app.use(require("lasso/middleware").serveStatic());

// Routing based on domain name

// hackinit.org/team
app.get(["/team", "/:lang/team"], function (req, res) {
  switch (req.headers.host) {
    default:
      // This page is only accessible for hackinit.org/:lang/team
      // hopefully Nginx can catch and re-write this 404 page
    case "2017.hackinit.org":
      require("./src/pages/2017-team")(req, res);
  }
});

// Since all routes are "/:lang", this is relatively straightforward
app.get(["/:lang", "*"], function (req, res) {
  switch (req.headers.host) {
    case "hackinit.org":
      require("./src/pages/2018-hackinit")(req, res);
      break;
    case "2017.hackinit.org":
      require("./src/pages/2017/")(req, res);
      break;
    case "2018.hackshanghai.com":
      require("../2018/hackshanghai/marko/src/pages/home")(req, res);
      break;
    // case not found
    default:
      // logging before fall-through to display thehack.org.cn
      console.log(
        "[",
        new Date().toISOString(),
        "] The request with following headers is recognized",
        req.headers
      );
    case "2018.thehack.org.cn":
      require("../2018/thehack/marko/src/pages/home")(req, res);
      break;
  }
});


app.listen(port, function () {
  console.log("Server started! Try it out:\nhttp://localhost:" + port + "/");

  if (process.send) {
    process.send("online");
  }
});
