class MyVue {
    constructor(data, el, attr) {
        this.data = data;
        Object.keys(data).forEach(key => this.proxyKeys(key));
        Observer.observe(data);
        el.innerHTML = this.data[attr];
        new Watcher(this, attr, value => el.innerHTML = value);
    }
    proxyKeys(key) {
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: () => this.data[key],
            set: newVal => this.data[key] = newVal
        })
    }
}
