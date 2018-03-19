var dataAll = require("./langs.json");
var template = require("./template.marko");
var render = require("./../../scripts/render.js");

module.exports = function(req, res) {
    render(req, res, dataAll, template, "/team");
};
