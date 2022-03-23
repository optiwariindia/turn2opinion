const visitor = {
    country: "",
    ip: "",
    loc: "",
    region: "",
    city: "",
    timezone: ""
}
async function getVisitor() {
    resp = await fetch("//ipinfo.io/json?token=b3293fdc622fe6")
    data = await resp.json()
    visitor.ip = data.ip
    visitor.country = data.country.toLowerCase()
    visitor.loc = data.loc
    visitor.region = data.region
    visitor.city = data.city
    visitor.timezone = data.timezone
    document.querySelector("[name=cn]").value = visitor.country;
    cn = window.intlTelInputGlobals.getCountryData().filter(c => c.iso2 == visitor.country.toLocaleLowerCase())[0];
    document.querySelector("[data-country]").innerText = cn.name;
}

if (pagename === "signup") {
    setTimeout(async () => {
        await getVisitor();
        // Detecting VPN
        if (visitor.timezone != "" && visitor.timezone != "undefined") {
            today=new Date();
            // console.log(today.getTimezoneOffset())
            // console.log(luxon.DateTime.fromObject({}, { zone: visitor.timezone }).offset)
            if (luxon.DateTime.fromObject({}, { zone: visitor.timezone }).offset != - today.getTimezoneOffset())
                alert("Are you using a VPN? If so, please disable it and try again.");
        }
        navigator.geolocation.getCurrentPosition(function (position) {
            $("[name=lat]").val(position.coords.latitude);
            $("[name=lng]").val(position.coords.longitude);
        });

        var input = document.querySelector("[type=tel]");
        errorMap = [
            "Invalid number",
            "Invalid country code",
            "Too short",
            "Too long",
            "Invalid number"
        ];
        if (input != null) {

            iti = window.intlTelInput(input, {
                hiddenInput: "phone_full",
                initialCountry: visitor.country,
                onlyCountries: [visitor.country],
                utilsScript: "/js/utils.js"
            });

            var reset = function () {
                input.classList.remove("error");
                errorMsg = document.querySelector("#error-msg");
                validMsg = document.querySelector("#valid-msg");
                errorMsg.innerHTML = "";
                errorMsg.classList.add("hide");
                validMsg.classList.add("hide");
            };

            // on blur: validate
            input.addEventListener('blur', function () {
                reset();
                if (input.value.trim()) {
                    errorMsg = document.querySelector("#error-msg");
                    validMsg = document.querySelector("#valid-msg");
                    if (iti.isValidNumber()) {
                        validMsg.classList.remove("hide");
                    } else {
                        input.classList.add("error");
                        var errorCode = iti.getValidationError();
                        errorMsg.innerHTML = errorMap[errorCode];
                        errorMsg.classList.remove("hide");
                    }
                }
            });

            // on keyup / change flag: reset
            input.addEventListener('change', reset);
            input.addEventListener('keyup', reset);
        }
        $(function () {
            $("[name=cn]").autocomplete({
                source: window.intlTelInputGlobals.getCountryData().map(c => { return c.name; })
            });
        });
        $("[name=email]").on("change", function (e) {
            let email = $(this).val();
            fetch("/user/validate/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email })
            }).then(res => res.json()).then(r => {
                if (r.status === "error") {
                    e.target.setCustomValidity(r.message);
                }
            });
        })
        $("[name=phone]").on("change", function (e) {
            let phone = iti.getNumber();
            fetch(location.origin + "/user/validate/phone", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ phone: phone })
            }).then(res => res.json()).then(r => {
                if (r.status === "error") {
                    e.target.setCustomValidity(r.message);
                }
            });
        })
    }, 1000)
}