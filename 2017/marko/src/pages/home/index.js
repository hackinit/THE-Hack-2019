var template = require("./template.marko");

var supportLangs = ["zh"];

function getLang(req, res) {
  if (req.params.lang && supportLangs.indexOf(req.params.lang) != -1) {
    return req.params.lang;
  } else if (req.path === "/") {
    return "en";
  } else {
    return null;
  }
}

module.exports = function (req, res) {
  var lang = getLang(req, res);
  // If language is not supported, redirect to root (English)
  if (lang === null) {
    res.redirect("/");
    // return to avoid res.marko() be executed
    return;
  }
  res.marko(template, {
    lang: lang,
  });
};
