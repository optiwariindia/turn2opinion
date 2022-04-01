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
        e.closest(".options").querySelectorAll("button").forEach(b => {
            if (b.innerText === e.parentElement.innerText) {
                b.classList.remove("disabled");
            }
        });
        e.parentElement.remove();
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
        });
        console.log(inputs);
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
                popup.show(`<h2>Thank you</h2> <p>${data.message}</p>`);
                setTimeout(() => {
                    location.href = "/user/dashboard"
                }, 3000);
                break;
            case "error":
                popup.autohide(`<h2>Error</h2><p>${data.message}</p>`, 5000);
                break;
        }
    }

}

progress.show();


(function () {
    let apireq = document.querySelectorAll("[data-api]");
    // console.log(apireq);
    apireq.forEach(e => {
        // console.log(e);
        JSON.parse(e.getAttribute("data-depends")).forEach(fld => {
            inp = document.querySelector(`[name=${fld}]`)
            if (inp == null) return;
            inp.addEventListener("change", async function (c) {
                info = {};
                await JSON.parse(e.getAttribute("data-depends")).forEach(fld => { info[fld] = document.querySelector(`[name=${fld}]`).value });
                resp = await fetch(e.getAttribute("data-api"), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(info)
                });
                data = await resp.json();
                if ("zip" in data) {
                    let z = document.querySelector("[name=zipcode]");
                    console.log(data.zip['zip']);
                    z.setAttribute("pattern", data.zip['zip']);
                    if (!z.validity.valid) z.value = "";
                }
                if(data.length==0) return ;
                i = document.querySelector(`[name=${data.data[0].name}]`);
                options = `<option selected value='' disabled>Select</option>`;
                await data.data.forEach(e => {
                    options += `<option value="${e._id}">${e.label}</option>`;
                });
                i.innerHTML = options;
                // i.setAttribute("required");
                showSelect();
            })
        })
        if (e.getAttribute("data-depends") == "[]") {
            fetch(e.getAttribute("data-api"), {
                method: "GET"
            }).then(resp => resp.json()).then(async data => {
                if (data.data[0] !== undefined) {

                    i = document.querySelector(`[name=${data.data[0].name}]`);
                    switch (i.tagName.toLowerCase()) {
                        case "select":
                            options = `<option value="" diabled selected>Select</option>`;
                            await data.data.forEach(e => {
                                options += `<option value="${e._id}">${e.label}</option>`;
                            });
                            i.innerHTML = options;
                            showSelect();
                            console.log(i);
                            break;
                        case "input":
                            options = "";
                            await data.data.forEach(e => {
                                // options += `<span class='custom-checkbox'> <input type="checkbox" name="${i.name}[]" value="${e._id}" id="r-${e._id}"> <label for="r-${e._id}">${e.label}</label> </span>`;
                                options += `<button class='custom-checkbox' type=button onclick=inputCheckbox.add(this)> ${e.label}</button>`;
                            });
                            i.parentElement.querySelector(".option-values").innerHTML = options;
                    }
                }
            })
        }
    });
})()
function showSelect() {
    return ;
    document.querySelectorAll("select").forEach(e => {
        element = e.closest(".col-sm-6") || e.closest(".col-sm-12");
        //         // console.log({ element: e.name, bind: element.getAttribute("bind-field") });
        //         if ((e.querySelectorAll("option").length !== 1) && (element.getAttribute("bind-field") !== null)) {
        //             element.style.display = "block";
        //         } else {
        element.style.display = "none";
        //         }
        if(e.querySelectorAll("option").length>1){
            element.style.display = "block";
        }

    });
}

params = new URLSearchParams(location.search);
progress.value = params.get("page") || 1;

progress.show();

// const bindFields = {
//     list: document.querySelectorAll("[bind-field]"),
//     init: async function () {
//         // console.log(document.querySelectorAll("[data-options]"));
//         flds = [];
//         await bindFields.list.forEach(e => {
//             e.style.display = "none";
//             fld = e.getAttribute("bind-field");
//             if (flds.indexOf(fld) == -1)
//                 flds.push(fld);
//         });
//         flds.forEach(e => {
//             bindFields.bind(document.querySelector(`[name=${e}]`));
//         })
//     },
//     bind: function (params) {
//         params.addEventListener("change", (event) => {
//             bindFields.show(event.target.value);
//             console.log(event.target.value);
//         })
//     },
//     show: function (value) {
//         bindFields.list.forEach(f => {
//             f.style.display = "none";
//             if (JSON.parse(f.getAttribute("data-for")).indexOf(value) != -1) {
//                 f.style.display = "block";
//             }
//         })
//     }
// }
// bindFields.init();
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