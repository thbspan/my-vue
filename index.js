const el = document.querySelector('#name');

const myVue = new MyVue({name:"hello world"}, el, "name");

window.setTimeout(() => {
    console.log('name值改变了');
    myVue.name = 'test foo';
}, 2000);
