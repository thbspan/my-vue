class Watcher {
    constructor(vm, exp, callback) {
        this.vm = vm;
        this.exp = exp;
        this.callback = callback;
        // 将自己添加到订阅器
        this.value = this.get();
    }

    get() {
        Dep.target = this;
        const value = this.vm.data[this.exp];
        Dep.target = null;
        return value;
    }

    update() {
        this.run();
    }

    run() {
        const newVal = this.vm.data[this.exp];
        const oldVal = this.value;
        if (newVal !== oldVal) {
            this.value = newVal;
            this.callback.call(this.vm, newVal, oldVal);
        }
    }
}
