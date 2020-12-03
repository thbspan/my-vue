class Compile {
    static PROP_REG = /{{\s*([^{}]+)\s*}}/g;

    constructor(el, vm) {
        this.vm = vm;
        this.el = document.querySelector(el);
        this.fragment = null;
        this.init();
    }

    init() {
        if (this.el) {
            this.fragment = this.nodeToFragment(this.el);
            this.compileElement(this.fragment);
            this.el.appendChild(this.fragment);
        } else {
            console.warn("dom 元素不存在");
        }
    }

    nodeToFragment(el) {
        const fragment = document.createDocumentFragment();
        let child = el.firstChild;
        while (child) {
            // 将dom元素移入fragment中
            fragment.appendChild(child);
            child = el.firstChild;
        }
        return fragment;
    }

    compileElement(el) {
        const childNodes = el.childNodes;
        const reg = Compile.PROP_REG;
        // 将类数组对象转换为真正的数组对象
        [].slice.call(childNodes).forEach(node => {
            if (Compile.isTextNode(node)) {
                const text = node.textContent;
                if (reg.test(text)) {
                    this.compileText(node, text);
                }
            } else if (Compile.isElementNode(node)) {
                this.compileNode(node)
            }
            if (node.childNodes && node.childNodes.length) {
                // 递归处理子节点
                this.compileElement(node);
            }
        });
    }

    compileNode(node) {
        const nodeAttrs = node.attributes;
        Array.prototype.forEach.call(nodeAttrs, attr => {
            const attrName = attr.name;
            if (Compile.isDirective(attrName)) {
                const exp = attr.value;
                const dir = attrName.substring(2);
                if (Compile.isEventDirective(dir)) {  // 事件指令
                    this.compileEvent(node, exp, dir);
                } else {  // v-model 指令
                    this.compileModel(node, exp, dir);
                }
                node.removeAttribute(attrName);
            }
        });
    }

    compileText(node, text) {
        const initText = text.replace(Compile.PROP_REG, (expStr, exp) => {
            new Watcher(this.vm, exp, value => this.updateExpText(node, text, exp, value));
            const val = this.vm[exp];
            return typeof val === 'undefined' ? '' : val;
        });
        Compile.updateText(node, initText);
    }

    compileEvent(node, exp, dir) {
        const eventType = dir.split(':')[1];
        const callback = this.vm.methods && this.vm.methods[exp];

        if (eventType && callback) {
            node.addEventListener(eventType, callback.bind(this.vm), false);
        }
    }

    compileModel(node, exp, dir) {
        console.log(dir)
        let val = this.vm[exp];
        Compile.modelUpdater(node, val);
        new Watcher(this.vm, exp, value => {
            Compile.modelUpdater(node, value);
        });

        node.addEventListener('input', e => {
            const newValue = e.target.value;
            if (val === newValue) {
                return;
            }
            this.vm[exp] = newValue;
            val = newValue;
        })
    }

    updateExpText(node, text, updatedExp, value) {
        const initText = text.replace(Compile.PROP_REG, (expStr, exp) => {
            const val = exp === updatedExp ? value : this.vm[exp];
            return typeof val === 'undefined' ? '' : val;
        });
        Compile.updateText(node, initText);
    }

    static updateText(node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value;
    }

    static modelUpdater(node, value) {
        node.value = typeof value === 'undefined' ? '' : value;
    }

    static isDirective(attr) {
        return attr.indexOf('v-') === 0;
    }

    static isEventDirective(dir) {
        return dir.indexOf('on:') === 0;
    }

    static isTextNode(node) {
        return node.nodeType === 3;
    }

    static isElementNode(node) {
        return node.nodeType === 1;
    }
}
