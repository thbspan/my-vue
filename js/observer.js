class Observer {
    constructor(data) {
        this.data = data;
        this.walk(data);
    }

    walk(data) {
        Object.keys(data).forEach(key => this.defineReactive(data, key, data[key]));
    }

    defineReactive(data, key, value) {
        const dep = new Dep();

        Observer.observe(value);
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: () => {
                if (Dep.target) {
                    dep.addSub(Dep.target);
                }
                return value;
            },
            set: (newVal) => {
                if (newVal === value) {
                    return;
                }
                value = newVal;
                dep.notify();
            }
        });
    }

    static observe(value) {
        if (!value || typeof value !== 'object') {
            return;
        }
        return new Observer(value);
    }
}
