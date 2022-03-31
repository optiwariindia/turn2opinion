const expand = function (e) {
    elm = e.parentElement.parentElement;
    elm.classList.toggle("active");
}
const form = {
    show: function (e) {
        elm = document.querySelector(`.${e}`);
        if (elm == null) {
            location.href = "/?frm=" + e;
            return false;
        }
        switch (elm.tagName.toLowerCase()) {
            case "input":
                if (elm.type == "radio") elm.checked = true;
                break;
        }
    }
}
url=new URL(location.href);
if(url.searchParams.get("frm")){
    form.show(url.searchParams.get("frm"));
}