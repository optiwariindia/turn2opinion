let optapi = [];
document.querySelectorAll("[data-options]").forEach(e => {
FetchData(e);
    // e.addEventListener("focus", async (event) => {
    //     let data = {};
    //     let params = JSON.parse(e.getAttribute("data-params"));
    //     await params.forEach(fld => {
    //         temp = document.querySelector(`[name=${fld}]`);
    //         if ("value" in temp)
    //             data[fld] = temp.value;
    //     })
    //     api = {
    //         path: e.getAttribute("data-options"),
    //         method: e.getAttribute("data-method")
    //     };
    //     switch (api.method) {
    //         case "GET":
    //             fetch(api.path)
    //                 .then(response => response.json())
    //                 .then(data => {
    //                     console.log(data);
    //                     e.innerHTML = `<option value="" selected disabled> -- Please Select -- </option>`;
    //                     data.data.forEach(info => {
    //                         e.innerHTML += `<option value="${info._id}">${info.label}</option>`;
    //                     })
    //                 })
    //                 .catch(err => console.log(err));
    //             break;
    //         case "POST":
    //             fetch(api.path, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json"
    //                 },
    //                 data: JSON.stringify(data)
    //             })
    //                 .then(response => response.json())
    //                 .then(data => {
    //                     console.log(data);
    //                     e.innerHTML = `<option value="" selected disabled> -- Please Select -- </option>`;
    //                     data.data.forEach(info => {
    //                         e.innerHTML += `<option value="${info._id}">${info.label}</option>`;
    //                     })
    //                 })
    //                 .catch(err => console.log(err));
    //             break
    //         default:
    //             break;
    //     }
    // })

});
async function DataUpdated(e) {
    console.log(e.getAttribute("dependents").split(" ").forEach(fld => {
        temp = document.querySelector(`[name=${fld}]`);
        if ( temp != null )
            FetchData(temp);
    }));
}
async function FetchData(e) {
    let params = JSON.parse(e.getAttribute("data-params"));
    let data = {};
    await params.forEach(fld => {
        temp = document.querySelector(`[name=${fld}]`);
        if ("value" in temp)
            data[fld] = temp.value;
            console.log(temp.getAttribute("name"));
            temp.setAttribute("onchange","DataUpdated(this)");
            temp.setAttribute("dependents",temp.getAttribute("dependents") + " " + e.getAttribute("name"));
        temp.setAttribute("defined","true");
    })
    console.log(data);
    api = {
        path: e.getAttribute("data-options"),
        method: e.getAttribute("data-method")
    };
    console.log(api);
    switch (api.method) {
        case "GET":
            fetch(api.path)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    e.innerHTML = `<option value="" selected disabled> -- Please Select -- </option>`;
                    data.data.forEach(info => {
                        e.innerHTML += `<option value="${info._id}">${info.label}</option>`;
                    })
                })
                .catch(err => console.log(err));
            break;
        case "POST":
            fetch(api.path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    e.innerHTML = `<option value="" selected disabled> -- Please Select -- </option>`;
                    data.data.forEach(info => {
                        e.innerHTML += `<option value="${info._id}">${info.label}</option>`;
                    })
                })
                .catch(err => console.log(err));
            break
        default:
            break;
    }
}
// document.querySelector("[name=country]").focus();   