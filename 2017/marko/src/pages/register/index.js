var template = require("./template.marko");

var supportLangs = ["zh"];

function getLang(req, res) {
    if (req.params.lang && supportLangs.indexOf(req.params.lang) != -1) {
        return req.params.lang;
    } else if (req.path === "/register") {
        return "en";
    } else {
        res.redirect("/register");
    }
}

module.exports = function(req, res) {
    res.marko(template, {
        lang: getLang(req, res)
    });
};
