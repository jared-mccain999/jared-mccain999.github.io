var CURSOR;

Math.lerp = (a, b, n) => (1 - n) * a + n * b;

const getStyle = (el, attr) => {
    try {
        return window.getComputedStyle
            ? window.getComputedStyle(el)[attr]
            : el.currentStyle[attr];
    } catch (e) {}
    return "";
};

class Cursor {
    constructor() {
        this.pos = { curr: null, prev: null };
        this.cursor = null;
        this.scr = null;
        this.canvas = null;
        this.ctx = null;
        this.handleClick = (e) => {};  // 不再处理点击事件
        this.create();
        this.init();
        this.render();
    }

    move(left, top) {
        this.cursor.style["left"] = `${left}px`;
        this.cursor.style["top"] = `${top}px`;
    }

    create() {
        if (!this.cursor) {
            this.cursor = document.createElement("div");
            this.cursor.id = "cursor";
            this.cursor.classList.add("hidden");
            document.body.append(this.cursor);
        }

        if (!this.scr) {
            this.scr = document.createElement("style");
            document.body.appendChild(this.scr);
            this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='8px' height='8px'><circle cx='4' cy='4' r='4' opacity='.5'/></svg>") 4 4, auto}`;
        }
    }

    refresh() {
        if (this.canvas && this.canvas.parentNode) {
            document.body.removeChild(this.canvas);
        }
        if (this.scr && this.scr.parentNode) {
            document.body.removeChild(this.scr);
        }
        if (this.cursor && this.cursor.parentNode) {
            document.body.removeChild(this.cursor);
        }
        this.pos = { curr: null, prev: null };
        this.create();
        this.init();
        this.render();
    }

    init() {
        // 移除旧 Canvas
        if (this.canvas && this.canvas.parentNode) {
            document.body.removeChild(this.canvas);
        }

        // 创建新 Canvas
        this.canvas = document.createElement("canvas");
        this.canvas.style.position = "fixed";
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        this.canvas.style.pointerEvents = "none";
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // 实时检测 cursor 样式
        document.onmouseover = e => {
            if (getStyle(e.target, 'cursor') === 'pointer') this.cursor.classList.add("hover");
        };
        document.onmouseout = e => {
            if (getStyle(e.target, 'cursor') === 'pointer') this.cursor.classList.remove("hover");
        };

        // 窗口调整
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });

        // 鼠标移动
        document.onmousemove = e => {
            if (this.pos.curr == null) this.move(e.clientX - 10, e.clientY - 10);
            this.pos.curr = { x: e.clientX - 10, y: e.clientY - 10 };
            this.cursor.classList.remove("hidden");
        };

        // 鼠标进入/离开页面
        document.onmouseenter = e => this.cursor.classList.remove("hidden");
        document.onmouseleave = e => this.cursor.classList.add("hidden");

        // 鼠标点击
        document.onmousedown = e => this.cursor.classList.add("active");
        document.onmouseup = e => this.cursor.classList.remove("active");

        // 点击事件处理
        document.removeEventListener('click', this.handleClick);
        document.addEventListener('click', this.handleClick);
    }

    render() {
        if (this.pos.prev) {
            this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, 0.15);
            this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, 0.15);
            this.move(this.pos.prev.x, this.pos.prev.y);
        } else {
            this.pos.prev = this.pos.curr;
        }
        requestAnimationFrame(() => this.render());
    }
}

(() => {
    CURSOR = new Cursor();
})();

