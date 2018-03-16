var langs = require("./langs.json")

function getLang(req, res) {
    if (req.params.lang && langs.supported.indexOf(req.params.lang) != -1) {
        return req.params.lang;
    } else if (req.path === "/") {
        return langs.default;
    } else {
        res.redirect("/");
        return null;
    }
}

function render(req, res, dataAll, template) {
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
}

module.exports = render;
