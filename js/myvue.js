class MyVue {
    constructor(options) {
        this.vm = this;
        this.data = options.data;
        Object.keys(this.data).forEach(key => this.proxyKeys(key));
        Observer.observe(this.data);

        new Compile(options.el, this.vm);
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
