let controller = new Vue({
  el: "#sponsor-portal",
  data: {
    currentUsers: [],
    hackinit: [],
    hackshanghai: []
  },
  mounted: function () {
    this.$http.get("https://api.thehack.org.cn/resumes/all")
    .then(response => {
      hackinit = response.body.hackinit;
      hackshanghai = response.body.hackshanghai;
    });
  },
  methods: {
    switchTo: function(group) {
      currentUsers = group;
    }
  }
});
