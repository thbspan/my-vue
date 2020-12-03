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
            }
            if (node.childNodes && node.childNodes.length) {
                // 递归处理子节点
                this.compileElement(node);
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

    static isTextNode(node) {
        return node.nodeType === 3;
    }
}
