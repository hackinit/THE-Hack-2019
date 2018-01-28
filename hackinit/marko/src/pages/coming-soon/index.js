var dataAll = require("./langs.json");
var template = require("./template.marko");

var langs = ["zh"];

function getLang(req, res) {
    if (req.params.lang && langs.indexOf(req.params.lang) != -1) {
        return req.params.lang;
    } else if (req.path === "/") {
        return "en";
    } else {
        res.redirect("/");
    }
}

module.exports = function(req, res) {
    var lang = getLang(req, res);
    var data = {};
    for (var key in dataAll) {
        data[key] = dataAll[key][lang];
    }
    res.marko(template, data);
};
