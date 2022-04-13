callAPI = async function (url, method, info) {
    let options = {
        method: method.toUpperCase(),
        headers: {
            "Content-Type": "application/json"
        }
    }
    if (method.toUpperCase() !== "GET")
        options.body = JSON.stringify(info);
    resp = await fetch(url, options);
    data = await resp.json();
    return data;
}
const inputCheckbox = {
    add: function (e) {
        p = e.parentElement.parentElement;
        inp = p.querySelector("input");
        vals = [];
        val = inp.value;
        if (val !== "") {
            vals = JSON.parse(val);
        }
        if (vals.indexOf(e.innerText) === -1) {
            vals.push(e.innerText.trim());
            p.querySelector(".input").innerHTML = p.querySelector(".input").innerHTML + `<span><i onclick=inputCheckbox.remove(this) class="fa fa-times"></i> ${e.innerText}</span>`;
            e.classList.add("disabled");
        }
        inp.value = JSON.stringify(vals);
        inp.dispatchEvent(new Event('change'));
    },
    remove: function (e) {
        vals = [];
        val = e.closest(".options").querySelector("input").value;
        if (val !== "") {
            vals = JSON.parse(val);
        }
        index = vals.indexOf(e.parentElement.innerText.trim());
        vals.splice(index, 1);
        e.closest(".options").querySelector("input").value = JSON.stringify(vals);
        e.closest(".options").querySelector("input").dispatchEvent(new Event('change'));
        e.closest(".options").querySelectorAll("button").forEach(b => {
            if (b.innerText === e.parentElement.innerText) {
                b.classList.remove("disabled");
            }
        });
        e.parentElement.remove();
    },
    init: function (e) {
        inpgrp = e.closest(".options");
        if(inpgrp==null)return ;
        inp = inpgrp.querySelector("input");
        vals = inp.value;
        if (vals == "") return;
        val = JSON.parse(inp.value);
        if(inpgrp.querySelector(".input").innerText !== vals){
            for (let index = 0; index < val.length; index++) {
                const element = val[index];
                inpgrp.querySelector(".input").innerHTML = inpgrp.querySelector(".input").innerHTML + `<span><i onclick=inputCheckbox.remove(this) class="fa fa-times"></i> ${element}</span>`;
            }
        }
    }
}

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
            elm = fields[0].closest(".form-group").querySelector("label");
            alert(`${elm.innerText} Seems to be invalid. Please check`);
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
        await document.querySelectorAll("[name]").forEach(e => {
            switch (e.type) {
                case "radio":
                    if (!e.checked) break;
                default:
                    inputs[e.name] = e.value;
            }
            if(inputs[e.name]=="")inputs[e.name]="N/A"
        });
        let response = await fetch(location.href, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(inputs)
        });
        let data = await response.json();
        switch (data.status) {
            case "success":
                popup.show(`${data.message}`);
                setTimeout(() => {
                    location.href = "/user/dashboard"
                }, 3000);
                break;
            case "error":
                popup.autohide(`<h2>Error</h2><p>${data.message}</p>`, 5000);
                break;
        }
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

progress.show();


loadData = function () {
    let apireq = document.querySelectorAll("[data-api]");
    apireq.forEach(async e => {
        if (["country", "state", "city"].indexOf(e.name) != -1) return;
        JSON.parse(e.getAttribute("data-depends")).forEach(fld => {
            inp = document.querySelector(`[name=${fld}]`)
            if (inp == null) return;
            inp.addEventListener("change", async function (c) {
                if(e.tagName=="SELECT"){
                    e.innerHTML = "<option>...</option>";
                }
                info = {};
                await JSON.parse(e.getAttribute("data-depends")).forEach(fld => {
                    info[fld] = document.querySelector(`[name=${fld}]`).value
                });
                data = await callAPI(e.getAttribute("data-api"), "post", info);
                if ("zip" in data) {
                    let z = document.querySelector("[name=zipcode]");
                    console.log(data.zip['zip']);
                    z.setAttribute("pattern", data.zip['zip']);
                    z.removeAttribute("disabled");
                    if (!z.validity.valid) z.value = "";
                }
                if (data.length == 0) return;
                i = document.querySelector(`[name=${data.data[0].name}]`);
                options = `<option selected value='' disabled>Select</option>`;
                await data.data.forEach(e => {
                    options += `<option value="${e._id}">${e.label}</option>`;
                });
                options = currency.localize(options);
                i.innerHTML = options;
                showSelect();
            })
        })
        if (e.getAttribute("data-depends") == "[]") {
            data = await callAPI(e.getAttribute("data-api"), "get", {});
            if (data.data[0] !== undefined) {
                i = document.querySelector(`[name=${data.data[0].name}]`);
                if (i == null)
                    i = e;
                switch (i.tagName.toLowerCase()) {
                    case "select":
                        options = `<option value="" diabled selected>Select</option>`;
                        await data.data.forEach(e => {
                            options += `<option value="${e._id}">${e.label}</option>`;
                        });
                        i.innerHTML = currency.localize(options);
                        showSelect();
                        break;
                    case "input":
                        options = "";
                        await data.data.forEach(e => {
                            options += `<button class='custom-checkbox' type=button onclick=inputCheckbox.add(this)> ${e.label}</button>`;
                        });
                        i.parentElement.querySelector(".option-values").innerHTML = options;
                }
            }
        }
    });
}

function showSelect() {

    document.querySelectorAll("select").forEach(e => {
        if (["city", "state", "country"].indexOf(e.name) != -1) return;
        element = e.closest(".col-sm-6") || e.closest(".col-sm-12");
        element.style.display = "none";
        e.removeAttribute("required");
        // console.table({fld:e.name,options:e.querySelectorAll("option").length})
        if (e.querySelectorAll("option").length > 1) {
            element.style.display = "block";
            e.setAttribute("required", "true");
        }

    });
}

params = new URLSearchParams(location.search);
progress.value = params.get("page") || 1;

progress.show();

(() => {
    document.querySelectorAll("[name]").forEach(e => {
        e.addEventListener("change", async function (event) {
            info = {};
            info[e.name] = e.value;
            resp = await fetch("/api/v1/save/" + e.name, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(info)
            })
            data = await resp.json();
            options = {};
            if ("options" in data) {
                await data.options.forEach(option => {
                    if (options[option.name] == undefined)
                        options[option.name] = `<option value="">Select </option>`
                    // options[option.name] = `<option value="${option._id}">${option.label}</option>`;
                    // else
                    options[option.name] += `<option value="${option._id}">${option.label}</option>`;
                })
                Object.keys(options).forEach(fld => {
                    document.querySelector(`[name=${fld}]`).innerHTML = options[fld];
                })
            }
        });
    })
})();
// (() => {
//     elms = document.querySelectorAll("[type=hidden]");
//     elms.forEach(e => {
//         inputCheckbox.init(e)
//     })
// })();
showFields = {
    country: () => {
        cntry = document.querySelector("[name=country]");
        cntry.setAttribute("disabled",true)
        if (cntry == null) return;
        callAPI("/api/v1/country", "get", {}).then(data => {
            if (Object.keys(data).indexOf("name") == - 1) {
                console.log(Object.keys(data))
                options = `<option value="" disabled selected>Select</option>`;
                Object.keys(data).forEach(k => {
                    e = data[k];
                    options += `<option value="${e.codes.iso2}">${e.name}</option>`;
                });
                cntry.innerHTML = options;
            }
            else {
                console.log(data);
                cntry.innerHTML = `<option value="${data.codes.iso2}" selected>${data.name}</option>`;
                showFields.state();
            }
        });
        cntry.addEventListener("change", showFields.state);
    },
    state: () => {
        state = document.querySelector("[name=state]");
        if (state == null) return;
        callAPI("/api/v1/zipcode", "post", {
            cn: document.querySelector("[name=country]").value
        }).then(i => {
            if (i.options.zip != null) {
                let z = document.querySelector("[name=zipcode]");
                z.setAttribute("pattern", i.options.zip);
                z.removeAttribute("disabled");
                if (!z.validity.valid) z.value = "";
            }

        })
        callAPI("/api/v1/country", "get", {}).then(data => {
            info = data;
            if (Object.keys(data).indexOf("name") == - 1) {
                cn = document.querySelector("[name=country]").value;
                info = data[cn];
            }
            options = `<option value="" disabled selected>Select</option>`;
            Object.keys(info.states).forEach(k => {
                e = info.states[k];
                options += `<option value="${e.code}">${e.name}</option>`;
            })
            state.innerHTML = options;
            state.addEventListener("change", showFields.city);
        });
    },
    city: () => {
        console.log("city");
        city = document.querySelector("[name=city]");
        if (city == null) return;
        callAPI("/api/v1/country", "get", {}).then(data => {
            cn = document.querySelector("[name=country]").value;
            st = document.querySelector("[name=state]").value;
            if (Object.keys(data).indexOf("name") == - 1)
                info = data[cn].states[st];
            else
                info = data.states[st];
            options = `<option value="" disabled selected>Select</option>`;
            info.cities.forEach(e => {
                options += `<option value="${e}">${e}</option>`;
            });
            city.innerHTML = options;
        });
    }
}
showFields.country();
let currency = {
    local: {
        code: "",
        symbol: "",
        rate: 1
    },
    localize: function (mystring) {
        // return mystring.replace(/\$/g,currency.local.symbol);

        data = mystring.match(/\$[\.\d\,]+/g);
        if (data == null) return mystring;
        data = data.map(e => e.replace(/[\$\,]/g, ""));
        mystring = mystring.replace(/\$[\.\d\,]+/g, "$");
        mystring = mystring.replace(/\$/g, "###");
        mystring = mystring.split("###");
        // console.log(mystring);
        output = "";
        for (i = 0; i < mystring.length; i++) {
            output += mystring[i];
            if (data[i] != null) {
                oldval = Number(data[i]);
                extradigit = currency.local.rate.toFixed(0).toString().length;
                unitdigit = oldval % 10;
                output += currency.local.symbol;
                output += oldval.toFixed(0);
                for (j = 0; j < extradigit; j++)
                    output += unitdigit;
            }
        }
        return output;
    },
    init: async function () {
        let mycur = await callAPI("/api/v1/getCurrency", "get", {})
        currency.local.symbol = mycur.symbol;
        currency.local.code = mycur.code;
        let rate = await callAPI(`/api/v1/exrate/USD/${mycur.code}`, "get", {});
        currency.local.rate = rate.rate;
        console.log(currency.local);
        loadData();
    }
}

country = {
    info: {},
    init: async function () {
        let cntry = await callAPI("/api/v1/country", "get", {});
        country.info = cntry;
        country.updateQuestions();
    },
    updateQuestions: function () {
        que = document.querySelectorAll("label");
        que.forEach(e => {
            e.innerText = e.innerText.replace("###country###", country.info.adj);
        })

    }
}

country.init();
currency.init();