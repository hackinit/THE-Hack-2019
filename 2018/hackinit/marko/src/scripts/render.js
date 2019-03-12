var langs = require("./langs.json");
var shared = require("./shared.json");

function getLang(req, res, path) {
    if (req.params.lang && langs.supported.indexOf(req.params.lang) != -1) {
        return req.params.lang;
    } else if (req.path === path) {
        return langs.default;
    } else {
        res.redirect(path);
        return null;
    }
}

function render(req, res, dataAll, template, path) {
    var lang = getLang(req, res, path);
    if (lang === null) {
        return;
    }
    var data = {};
    for (var key in shared) {
        if (shared[key][lang] !== undefined) {
            data[key] = shared[key][lang];
        } else {
            data[key] = shared[key]["default"];
        }
    }
    for (var key in dataAll) {
        if (dataAll[key][lang] !== undefined) {
            data[key] = dataAll[key][lang];
        } else {
            data[key] = dataAll[key]["default"];
        }
    }
    res.marko(template, data);
}

module.exports = render;
