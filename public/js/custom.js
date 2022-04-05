const expand = function (e) {
    elm = e.parentElement.parentElement;
    elm.classList.toggle("active");
}
const form = {
    show: function (e) {
        elmt = document.querySelector(".login-html");
        if (getComputedStyle(elmt)['display'] == "none")
            elmt.style.display = "block";
        elm = document.querySelector(`.${e}`);
        if (e == "signup") {
            navigator.geolocation.getCurrentPosition(function (position) {
                $("[name=lat]").val(position.coords.latitude);
                $("[name=lng]").val(position.coords.longitude);
            });
        }
        if (elm == null) {
            location.href = "/?frm=" + e;
            return false;
        }
        switch (elm.tagName.toLowerCase()) {
            case "input":
                if (elm.type == "radio") elm.checked = true;
                break;
        }
    },
    hide: function () {
        elmt = document.querySelector(".login-html");
        elmt.style = ""
    }
}
url = new URL(location.href);
if (url.searchParams.get("frm")) {
    form.show(url.searchParams.get("frm"));
}