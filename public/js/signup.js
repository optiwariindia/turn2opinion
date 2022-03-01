// Load only when Authentication (Sign up and login) form is loaded 
if (pagename==="signup") {
    (() => {
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
                initialCountry: "auto",
                geoIpLookup: function (callback) {
                    fetch("http://ipinfo.io/?token=192c83fcdac0ea", { crossorigin: 1 }).then(resp => resp.json()).then(info => {
                        let cnt = window.intlTelInputGlobals.getCountryData().find(c => {
                            return (c.iso2 == info.country.toLowerCase())
                        });
                        document.querySelector("[name=cn]").value = cnt.name;
                        callback(info.country);
                    });
                },
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
            fetch(location.origin + "/user/validate/email", {
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
    })();
}