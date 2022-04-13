externalScripts = {
    list: [
        "hotjar",
        "tawkto"
    ],
    load: async function (e) {
        var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = `/js/${e}.js`;
        s0.parentNode.insertBefore(s1, s0);
    },
    init: function () {
        externalScripts.list.forEach(externalScripts.load);
    }
};


(function (h, o, t, j, a, r) {
    h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
    h._hjSettings = { hjid: 2911935, hjsv: 6 };
    a = o.getElementsByTagName('head')[0];
    r = o.createElement('script'); r.async = 1;
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    a.appendChild(r);
})(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
window.onload = function () {
    var loader = document.querySelector('.loader');
    loader.style.display = 'none';
};