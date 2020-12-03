class Watcher {
    constructor(vm, attr, callback) {
        this.vm = vm;
        this.attr = attr;
        this.callback = callback;
        // 将自己添加到订阅器
        this.value = this.get();
    }

    get() {
        Dep.target = this;
        const value = this.vm.data[this.attr];
        Dep.target = null;
        return value;
    }

    update() {
        this.run();
    }

    run() {
        const newVal = this.vm.data[this.attr];
        const oldVal = this.value;
        if (newVal !== oldVal) {
            this.value = newVal;
            this.callback.call(this.vm, newVal, oldVal);
        }
    }
}
