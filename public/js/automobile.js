Array.prototype.generate = function (from, to) {
    temp = [];
    if (from > to) {
        for (let i = from; i >= to; i--)
            temp.push(i);
        return temp;
    }
    for (let i = from; i <= to; i++)
        temp.push(i);
    return temp;
}
const api = {
    endpoint: "/api/v1/automobile/",
    get: async function (url) {
        try {
            let response = await fetch(api.endpoint + url);
            let data = await response.json();
            return data;

        } catch (error) {
            return { status: "error", error: error };
        }
    },
    post: async function (url, data) {
        try {
            let response = await fetch(api.endpoint + url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            let data = await response.json();
            return data;

        } catch (error) {
            return { status: "error", error: error };
        }
    },
    put: async function (url, data) {
        try {
            let response = await fetch(api.endpoint + url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            let data = await response.json();
            return data;

        } catch (error) {
            return { status: "error", error: error };
        }
    },
    patch: async function (url, data) {
        try {
            let response = await fetch(api.endpoint + url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            let data = await response.json();
            return data;

        } catch (error) {
            return { status: "error", error: error };
        }
    },
    delete: async function (url, data) {
        try {
            let response = await fetch(api.endpoint + url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            let data = await response.json();
            return data;

        } catch (error) {
            return { status: "error", error: error };
        }
    }
}

function showQuestion(e) {
    nextq = e.closest(".que-group").nextElementSibling;
    if (nextq.classList.contains("not-hide")) return;
    nextq.classList.add("hidden");
    if (e.value == "Yes") {
        nextq.classList.remove("hidden");
    }
}
async function showQgrid(e) {
    choice = { gadi: e.name.split("-")[0], kitni: !isNaN(e.value) ? Number(e.value) : 5 };
    gadi = await api.get(choice.gadi);
    info = {};
    if (!("options" in gadi))
        return false;
    if (!("seq" in gadi)) return false;
    let html = "";
    for (let i = 0; i < gadi.seq.length; i++) {
        const seq = gadi.seq[i];
        switch (choice.gadi) {
            case "truck":
                if (typeof gadi.options[seq][0] == "object") {
                    options = await Array.from(new Set(gadi.options[seq].map(e => `<option value="${e.category}" data-name='type' data-option='${JSON.stringify(e.type)}'>${e.category}</option>`))).join("");
                } else
                    options = await Array.from(new Set(gadi.options[seq].map(e => `<option value="${e}">${e}</option>`))).join("");
                break;
            case "rv":
                if (typeof gadi.options[seq][0] == "object") {
                    options = await Array.from(new Set(gadi.options[seq].map(e => `<option value="${e.type}" data-name='brand' data-option='${JSON.stringify(e.brand)}'>${e.type}</option>`))).join("");
                } else
                    options = await Array.from(new Set(gadi.options[seq].map(e => `<option value="${e}">${e}</option>`))).join("");
                break;
            default:
                options = await Array.from(new Set(gadi.options[seq].map(e => `<option value="${e}">${e}</option>`))).join("");
                break;
        }
        // console.log(options);
        html += `<div class="que-group"><select name="${choice.gadi}-${seq}[]" onchange="fieldUpdated(this)" class="form-control"><option value="">Select ${seq}</option>${options}</select></div>`;
    }
    if (choice.gadi != "bicycle") {
        num = [];
        dt = new Date();
        num = num.generate(dt.getFullYear(), 1990);
        console.log(num);
        seq = "year";
        options = await Array.from(new Set(num.map(e => `<option value="${e}">${e}</option>`))).join("");
        html += `<div class="que-group"><select name="${choice.gadi}-${seq}[]" onchange="fieldUpdated(this)" class="form-control"><option value="">Select ${seq}</option>${options}</select></div>`;
    }
    opts = e.closest(".questions").nextElementSibling;
    opts.classList.remove("hidden");
    elm = e.closest(".questions").nextElementSibling.querySelector(".qgridoptions");
    elm.innerHTML = "";
    for (let j = 0; j < choice.kitni; j++) {
        elm.innerHTML += `<div class="qgridoption">${html}</div>`;
    }
    elm.classList.remove("hidden");
    return false;
}

const gaadi = {
    showOptions: async (gadi) => {
        let resp = await api.get(gadi);
        info = {};
        if (!("options" in resp)) return;
        domelm = document.querySelector(`[for=${gadi}]`).parentElement;
        domOptSection = domelm.querySelector(".qgridoptions");
        info = {};
        if ("forEach" in resp.options) {
            keys = Object.keys(resp.options[0]);
            options = resp.options;
            for (let i = 0; i < keys.length; i++) {
                curfield = domOptSection.querySelector(`[name=${gadi}-${keys[i]}]`);
                if (curfield != null)
                    info[curfield.name.split("-")[1]] = curfield.value;
                if (Object.keys(info).length == i) {
                    temp = options.filter(elm => {
                        k = Object.keys(info);
                        if (k.length == 0)
                            return true;
                        for (let j = 0; j < k.length; j++) {
                            if (elm[k[j]] != info[k[j]])
                                return false;
                        }
                        return true;
                    });
                    html = `<option disabled selected value="">Select ${keys[i]}</option>` + Array.from(new Set(temp.map(elm => `<option value="${elm[keys[i]]}">${elm[keys[i]]}</option>`))).join("");
                    domOptSection.innerHTML += `<select class="form-control" data-field="${keys[i]}" name="${gadi}-${keys[i]}" onchange="valueChanged(this)">${html}</select>`;
                }
            }
            return;
        }
    }
};

const progress = {
    value: 1,
    max: document.querySelectorAll("[page]").length,
    dom: {
        ui: document.querySelector("[data-survey-progress]"),
        page: document.querySelector("[data-pageno]"),
        total: document.querySelector("[data-totalpages]"),
        buttons: {
            prev: document.querySelector("[data-prev]"),
            next: document.querySelector("[data-next]"),
            submit: document.querySelector("[data-submit]")
        }
    },
    getCurrentPage: function () {
        let page = null;
        pages = document.querySelectorAll("[page]");
        for (let index = 0; index < pages.length; index++) {
            const element = pages[index];
            if (element.getAttribute("page") == progress.value) return element;
        }
    },
    validate: async function () {
        let page = await progress.getCurrentPage();
        let fields = page.querySelectorAll("[name]:invalid");
        if (fields.length !== 0) {
            fields[0].focus();
            elm = fields[0].closest(".gadi").querySelector("label");
            alert(`${elm.innerText} section seems to be incomplete. Please click the plus sign to complete.`);
            console.log({ invalid: fields[0].name });
            return false;
        }
        // survey categories 
        field = page.querySelector("[name=surveycategories]") || page.querySelector("[name=interest]");
        if (field == null) return true;
        val = field.value;
        if (val == "") {
            alert("Please select at least 5");
            return false;
        }
        let vals = JSON.parse(val);
        if (vals.length < 5) {
            alert("Please select at least 5");
            return false;
        }
        return true;
    },
    next: async function () {
        isValid = await progress.validate();
        if (!isValid)
            return false;
        progress.value++;
        if (progress.value >= progress.max) {
            progress.value = progress.max;
        }
        progress.show();
    },
    previous: async function () {
        progress.value--;
        if (progress.value <= 0) {
            progress.value = 0;
        }
        progress.show();
    },
    show: async function () {
        if (progress.max == 0) {
            location.href = location.href + "?edit=1";
        }
        progress.dom.total.innerText = progress.max;
        progress.dom.page.innerText = progress.value;
        await document.querySelectorAll("[page]").forEach(e => {
            e.style.display = "none";
            if (e.getAttribute("page") == progress.value)
                e.style.display = "block";
        });
        progress.dom.ui.style.width = `${progress.value / progress.max * 100}%`;
        progress.dom.page.innerText = progress.value;
        switch (progress.value) {
            case 1:
                progress.dom.buttons.prev.style.display = "none";
                progress.dom.buttons.next.style.display = "block";
                if (location.pathname.startsWith("/user/survey")) {
                    progress.dom.buttons.next.innerText = "Start";
                }
                progress.dom.buttons.submit.style.display = "none";
                break;
            case (progress.max):
                progress.dom.buttons.prev.style.display = "block";
                progress.dom.buttons.next.style.display = "none";
                progress.dom.buttons.submit.style.display = "block";
                break;
            default:
                progress.dom.buttons.prev.style.display = "block";
                progress.dom.buttons.next.style.display = "block";
                progress.dom.buttons.next.innerText = "Next";
                progress.dom.buttons.submit.style.display = "none";
        }
    },
    submit: async function () {
        let inputs = {};
        let inpform = document.querySelector(".gadi-form")
        await inpform.querySelectorAll("[name]").forEach(e => {
            switch (e.type) {
                case "radio":
                    if (!e.checked) break;
                default:
                    inputs[e.name] = e.value;
            }
        });
        invalid = inpform.querySelectorAll("[name]:invalid");
        if (invalid.length != 0) {
            for (let index = 0; index < invalid.length; index++) {
                const inv = invalid[index];
                if ([null,undefined].indexOf(inv.closest(".hidden")) !== -1) 
                    continue;
                return;
            }
        }
        if(invalid.length ==0)inpform.submit();

        // let response = await fetch(location.href, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(inputs)
        // });
        // let data = await response.json();
        // switch (data.status) {
        //     case "success":
        //         popup.show(`<h2>Thank you</h2> <p>${data.message}</p>`);
        //         // setTimeout(() => {
        //         //     location.href = "/user/dashboard"
        //         // }, 30000);
        //         break;
        //     case "error":
        //         popup.autohide(`<h2>Error</h2><p>${data.message}</p>`, 5000);
        //         break;
        // }
    },
    go: function (e) {
        if (progress.max > e) return;
        progress.value = e;
        progress.show();
    },
    skip: function () {
        if (progress.max <= progress.value) return;
        progress.value++;
        progress.show();
    }
}
const fieldUpdated = function (e) {
    e.querySelectorAll("option").forEach(o => {
        if (!o.selected) return;
        let el1 = o;
        let opts = el1.getAttribute("data-option");
        if (opts == null) return;
        opts = JSON.parse(opts);
        let name = el1.getAttribute("data-name");
        options = Array.from(new Set(opts.map(e => `<option value="${e}">${e}</option>`))).join("");
        let html = `<div class="que-group"><select name="${choice.gadi}-${name}[]" onchange="fieldUpdated(this)" class="form-control"><option value="">Select ${name}</option>${options}</select></div>`;
        e.parentElement.parentElement.insertAdjacentHTML("beforeend", html);
    })
}
progress.show();

popup = {
    show: function (e) {
        document.querySelector(".forced-popup").style.display = "block";
        document.querySelector(".popup-body").innerHTML = e;
    },
    hide: function (e) {
        document.querySelector(".forced-popup").style.display = "none";
        document.querySelector(".popup-body").innerHTML = "";
    },
    autohide: function (e, timeOut) {
        popup.show(e);
        setTimeout(() => {
            popup.hide();
        }, 300);
    }
}