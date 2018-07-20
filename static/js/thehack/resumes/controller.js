let controller = new Vue({
  el: "#sponsor-portal",
  data: {
    currentUsers: [],
    hackinit: [],
    hackshanghai: []
  },
  mounted: function () {
    let that = this;
    that.$http.get("https://api.thehack.org.cn/resumes/all")
    .then(response => {
      console.log(response);
      that.hackinit = response.body.hackinit;
      that.hackshanghai = response.body.hackshanghai;
    });
    $(".hide").removeClass("hide");
  },
  methods: {
    switchTo: function(group) {
      let that = this;
      if (group == 'hackinit') {
        that.currentUsers = that.hackinit;
      } else if (group == 'hackshanghai') {
        that.currentUsers = that.hackshanghai;
      }
    }
  }
});
