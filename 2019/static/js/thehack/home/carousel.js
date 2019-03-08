let carouselController = new Vue({
    el: "#buttons",

    methods: {
        clickHackInit: function() {
            $("#carouselHackathons").carousel(1);
        },
        clickHackShanghai: function() {
            $("#carouselHackathons").carousel(2);
        }
    }
});
