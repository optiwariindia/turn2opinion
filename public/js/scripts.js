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
}
