class MyVue {
    constructor(options) {
        this.vm = this;
        this.data = options.data;
        this.methods = options.methods;

        Object.keys(this.data).forEach(key => this.proxyKeys(key));
        Observer.observe(this.data);

        new Compile(options.el, this.vm);

        // 所有事情处理好后执行mounted函数
        options.mounted.call(this);
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
