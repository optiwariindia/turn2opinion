let optapi = [];
document.querySelectorAll("[data-options]").forEach(async e => {
    await FetchData(e);
    e.value = e.getAttribute("data-value");
});
async function DataUpdated(e) {
    console.log(e.getAttribute("dependents").split(" ").forEach(fld => {
        temp = document.querySelector(`[name=${fld}]`);
        if (temp != null)
            FetchData(temp);
    }));
}
async function FetchData(e) {
    let params = JSON.parse(e.getAttribute("data-params"));
    let inputs = {};
    await params.forEach(fld => {
        temp = document.querySelector(`[name=${fld}]`);
        if ("value" in temp)
            inputs[fld] = temp.value;
        if (inputs[fld] == "")
            inputs[fld] = temp.getAttribute("data-value");
        temp.setAttribute("onchange", "DataUpdated(this)");
        temp.setAttribute("dependents", temp.getAttribute("dependents") + " " + e.getAttribute("name"));
        temp.setAttribute("defined", "true");
    })
    api = {
        path: e.getAttribute("data-options"),
        method: e.getAttribute("data-method"),
        value: e.getAttribute("data-value")
    };
    switch (api.method) {
        case "GET":
            try {
                let response = await fetch(api.path + "/" + api.value);
                let data = await response.json();
                let opthtml = "";

                let selected = `<option value="" selected disabled> -- Please Select -- </option>`;
                await data.data.forEach(info => {
                    opthtml += `<option value="${info._id}">${info.label}</option>`;
                })
                e.innerHTML = selected + opthtml;
            }
            catch (err) { console.log(err); }
            break;
        case "POST":
            let response = await fetch(api.path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(inputs)
            })
            let data = await response.json();
            console.log(data);
            e.innerHTML = `<option value="" selected disabled> -- Please Select -- </option>`;
            data.data.forEach(info => {
                e.innerHTML += `<option value="${info._id}">${info.label}</option>`;
            })

            break
        default:
            break;
    }

}
document.querySelector("form").addEventListener("submit", async e => {
    e.preventDefault();
    let inputs = {};
    let form = e.target;
    await form.querySelectorAll("[name]").forEach(elm => {
        inputs[elm.name] = elm.value;
    });
    let response = await fetch(location.href, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(inputs)
    })
    let data = await response.json();
    switch (data.status) {
        case "success":
            popup.autohide(`<h2>Successfully Saved</h2> <p>Thanks for your submission</p>`,3000);
            setTimeout(() => {
                location.reload();
            }, 3000);
            break;
        case "error":
            popup.autohide(`<h2>Error</h2><p>${data.message}</p>`,5000);
            break;
    }
});
popup={
    show:function(e){
        document.querySelector(".forced-popup").style.display="block";
        document.querySelector(".popup-body").innerHTML=e;
    },
    hide:function(e){
        document.querySelector(".forced-popup").style.display="none";
        document.querySelector(".popup-body").innerHTML="";
    },
    autohide:function(e,timeOut){
        popup.show(e);
        setTimeout(() => {
            popup.hide();
        }, timeOut);
    }
}

// document.querySelector("[name=country]").focus();   