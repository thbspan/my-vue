const myVue = new MyVue({
    el: '#app',
    data: {
        title: "hello world",
        sub: ":",
        name: ''
    }
});

window.setTimeout(() => {
    myVue.title = 'hi';
}, 2000);

window.setTimeout(() => {
    myVue.name = 'jack';
}, 2000);
