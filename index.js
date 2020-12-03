const myVue = new MyVue({
    el: '#app',
    data: {
        title: "hello world",
        sub: ":",
        name: ''
    },
    methods: {
        clickMe: function () {
            this.title = "hello world";
        }
    },
    mounted: function () {
        window.setTimeout(() => {
            this.title = 'hi';
        }, 2000);

        window.setTimeout(() => {
            this.name = 'jack';
        }, 2000);
    }
});
