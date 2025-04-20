window.addEventListener('scroll', percent);

function percent() {
    let a = window.pageYOffset, // 卷去高度
        b = document.documentElement.scrollHeight - document.documentElement.clientHeight, // 整个网页高度
        result = Math.round(a / b * 100), // 计算百分比
        up = document.querySelector("#go-up"); // 获取按钮

    if (up) {
        if (result <= 95) {
            up.children[0].style.display = 'none';
            up.children[1].style.display = 'block';
            up.children[1].children[0].innerHTML = result;
        } else {
            up.children[1].style.display = 'none';
            up.children[0].style.display = 'block';
        }
    }
}