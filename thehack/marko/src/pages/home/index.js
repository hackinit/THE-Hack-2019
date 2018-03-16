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
        return null;
    }
}

module.exports = function(req, res) {
    var lang = getLang(req, res);
    if (lang === null) {
        return;
    }
    var data = {};
    for (var key in dataAll) {
        if (dataAll[key][lang] !== undefined) {
            data[key] = dataAll[key][lang];
        } else {
            data[key] = dataAll[key]["default"];
        }
    }
    res.marko(template, data);
};
