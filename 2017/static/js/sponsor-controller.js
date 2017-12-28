/**
 * MAINTAINER: Yuchong Pan
 * EMAIL:      panyuchong@gmail.com
 */

var portal = new Vue({
    el: "#portal",
    data: {
        resumes: []
    },
    computed: {
        lang: function() {
            if (/^\/+sponsor\/*$/.test(location.pathname)) {
                return "en";
            } else if (/^\/+zh\/+sponsor\/*$/.test(location.pathname)) {
                return "zh";
            }
        }
    },
    mounted: function() {
        var _this = this;
        Vue.http.get("/api/sponsor/resumes/?token=" + _this.getParam("token")).then(response => {
            _this.resumes = response.body.resumes;
        }, response => {
            _this.goToHomepage();
        });
    },
    methods: {
        getParam: function(key) {
            var url = window.location.href;
            key = key.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + key + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },
        goToHomepage: function() {
            if (this.lang === "en") {
                window.location = "/";
            } else if (this.lang === "zh") {
                window.location = "/zh";
            }
        }
    }
});

var navbar = new Vue({
    el: "#navbar-container",
    methods: {
        exportCsv: function() {
            var _this = this;
            Vue.http.post("/api/sponsor/csv/", {
                "resumes": portal.resumes.map(x => {
                    return {
                        "name": x.name,
                        "resume": location.origin + x.resume
                    };
                })
            }).then(response => {
                _this.saveByteArray([_this.base64ToArrayBuffer(response.body.base64)], "hackinit-participant-resumes-" + Date.now() + ".csv", "text/csv");
            });
        },
        base64ToArrayBuffer: function(base64) {
            var binaryString = window.atob(base64);
            var binaryLen = binaryString.length;
            var bytes = new Uint8Array(binaryLen);
            for (var i = 0; i < binaryLen; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes;
        },
        saveByteArray: function(data, name, type) {
            var blob = new Blob(data, { type: type }),
                url = window.URL.createObjectURL(blob),
                a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
});
