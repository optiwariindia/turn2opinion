if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
$("form").submit(function (e) {
    e.preventDefault();
    if (this.classList.contains("sign-up-htm")) {
        if ($(this)[0].querySelector("[name=gender]:checked") === null) {
            popup.info("Select Gender");
            return false;
        }
        let flds = {};
        e.target.querySelectorAll("[name]").forEach(inp => {
            if (inp.type != "radio")
                flds[inp.name] = inp.value;
            else if (inp.checked)
                flds[inp.name] = inp.value;
        })
        flds['timezone'] = "UTC + " + new Date().getTimezoneOffset() / (-60);
        flds['cntry'] = iti.getSelectedCountryData();
        flds['phone'] = iti.getNumber();
        if ("g-recaptcha-response" in flds) {
            if (flds['g-recaptcha-response'] === "") { popup.info("Please verify you are not a robot"); return false; }
            else {
                e.target.innerHTML = `<div style='display:flex;flex-direction:column;align-item:center;justify-content: center;align-items: center;'><img src='/images/loader.gif'> <br> <p style='color:#fff'>Please Wait. We are processing your information.</p></div>`;
                p1=setTimeout(() => {
                    popup.show("<h2><i class='fa fa-exclamation-triangle'></i> Session Time out</h2><p>Your session has expired due to inactivity.Please try again after sometime</p><a href='/' class='btn btn-primary fr'>Ok</a>");
                }, 120000);
                fetch("/user/new", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(flds)
                }).then(res => res.json()).then(res => {
                    if (res.status === "ok") {
                        e.target.innerHTML = "";
                        clearTimeout(p1);
                        popup.show(`<h2>Thanks for Signing Up!</h2><p>Dear ${res.user.fn}, Your sign up request has been successfully submitted. Please open your email (${res.user.email}) and click the "verify" Link to setup your password and become our community member and start earning by your opinions.</p>`, "/");
                    }
                }).catch(err => {
                    console.log(err);
                    clearTimeout(p1)
                    popup.show(`<h2><i class='fa fa-exclamation-triangle'></i> Declined</h2><p>Your request to register is decliend due to some system error. Please try again after some time.</p>`);
                });
            }
        }
    } else if (e.target.getAttribute("name") === "setpass") {
        if (!strongPassword.test($("[name=pass]").val())) {
            popup.info("Password is not strong enough to continue");
            return false;
        }
        if ($("[name=pass]").val() !== $("[name=cpass]").val()) {
            popup.info("Passwords are not matching");
            return false;
        }
        let flds = {};
        e.target.querySelectorAll("[name]").forEach(inp => {
            flds[inp.name] = inp.value;
        });
        console.log(e.target.getAttribute("action"))
        fetch(e.target.getAttribute("action"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(flds)
        }).then(res => res.json()).then(resp => {
            if (resp.status === "ok") {
                if (location.pathname.startsWith("/user/verify")) {
                    popup.show(`<h2>Password Set Successfully</h2><p> Your password has been set. Please <a href='/'>Click here to Sign In</a> to your account.</p>`, "/");
                } else {

                    popup.show(`<h2>Password Changed Successfully</h2><p> Your password has been successfully changed. Please <a href='/'>Sign In</a> to your account.</p>`, "/");
                }
            } else {
                // document.querySelector("[data=autherror]").innerText = resp.message;
                popup.show(`<h2>Password Change Failed</h2><p>${resp.message}</p>`);
                setTimeout(() => {
                    popup.close();
                    document.querySelector("[data=autherror]").innerText = "";
                }, 5000);
            }
        }).catch(err => { console.log(err) })
    } else if (e.target.getAttribute("name") === "forgot") {
        email = e.target.querySelector("[name=email]").value;
        secans = e.target.querySelector("[name=security]").value;
        if (secans === "") {
            fetch("/user/securityquestion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email })
            }).then(res => res.json()).then(res => {
                if (res.status === "ok") {
                    secque = document.querySelector("[data=securityque]");
                    secque.innerText = res.question;
                    secque.parentElement.style.display = "block";
                    e.target.querySelector("[type=submit]").value = "Reset Password";
                }
                else {
                    popup.show(`<h2>${email} is not registered</h2> <p>Your email ${email} is not registered. Click on <a href='/?frm=sign-up'>sign up</a> to register with us or try other email alternatively.</p> `);
                    setTimeout(() => {
                        popup.hide();
                    }, 5000);
                }
            });
        } else {
            fetch("/user/forgot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email, security: secans })
            }).then(res => res.json()).then(res => {
                if (res.status === "ok") {
                    popup.show(`<p>Hi ${res.user.fn},</p>
                <p>Your request for password reset has been sent to your registered email address. Please check your email and follow the instructions to reset your password. If you have not received it in your inbox please check your spam/bulk mail  folder.</p>`, "/");
                } else {

                }
            });
        }
    } else {
        // Authentication
        let flds = {};
        e.target.querySelectorAll("[name]").forEach(inp => {
            switch (inp.type) {
                case "checkbox":
                    flds[inp.name] = inp.checked;
                    break;
                default:
                    flds[inp.name] = inp.value;
            }

        })
        if (("g-recaptcha-response" in flds) && (flds['g-recaptcha-response'] !== "")) {
            fetch(e.target.getAttribute("action"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(flds)
            }).then(res => res.json()).then(resp => {
                if (resp.status === "ok") {
                    let info = { user: resp.user.email, pass: resp.user.password, name: resp.user.name };
                    if (flds.staysignedin) localDB.store("auth", btoa(JSON.stringify(info)));
                    location.href = "/user/dashboard";
                } else {
                    popup.show(`<h2>Authentication Failed</h2><br><p>${resp.message}</p>`);
                    setTimeout(() => {
                        popup.close();
                    }, 5000);
                }
            }).catch(err => { console.log(err) })
        } else {
            popup.info("Please verify you are not a robot");
        }
    }
});

$("input").on("invalid", function (e) {
    if (e.target.validity.valueMissing) {
        e.target.setCustomValidity(e.target.getAttribute("placeholder") + " is required");
    }
    else if (e.target.validity.patternMismatch || e.target.validity.typeMismatch) {
        e.target.setCustomValidity(e.target.getAttribute("emismatched"));
    }
});
$("input").on('change', function (event) {
    event.target.setCustomValidity('');
})

matchpass = function (e) {
    if ($("[name=pass]").val() === "") { $(".pwstatus").html(""); }
    else if ($("[name=pass]").val() !== $("[name=cpass]").val()) {
        $(".pwstatus").html("Passwords are not matching");//.css("color", "red");
    } else {
        $(".pwstatus").html("Password Matched")
    }

}
$("[name=cpass").on("change", matchpass);
$("[name=pass").on("change", matchpass);
popup = {
    close: function () {
        document.querySelector(".forced-popup").remove();
    },
    show: function (message, closeTarget = null) {
        popupElement = document.createElement("div");
        if (closeTarget == null) let = href = ""; else href = `href="${closeTarget}"`;
        popupElement.innerHTML = `<div class='popup-body'>
                <a ${href} onclick=popup.close()><i class='fa fa-times fr'></i></a>
                <div class='logo-center'><img src='/assets/images/logo.png'></div>
                ${message}
                </div>`;
        popupElement.classList.add("forced-popup");
        document.body.appendChild(popupElement);
    },
    info: function (e) {
        popup.show(`<h2>${e}</h2>`);
        setTimeout(() => {
            popup.close();
        }, 3000);
    }
}
showPassword = function (e) {
    p = e.parentElement;
    console.log(p);
    if (p) {
        pass = p.querySelector("[type=password]");
        pass.setAttribute("type", "text");
        setTimeout(() => {
            pass.setAttribute("type", "password");
        }, 5000);
    }
};

cookiePopup = {
    open: function () {
        popupcookie = document.createElement("div");
        popupcookie.classList = "cookie-popup";
        popupcookie.innerHTML = `<p>Turn2Opinion uses cookies to improve your experience on this site. Before you continue, let us know if you’re happy to accept the use of cookies, in accordance with our Privacy Policy. This website stores cookies on your computer. These cookies are used to collect information about how you interact with our website and allow us to remember you. We use this information in order to improve and customize your browsing experience and for analytics and metrics about our visitors both on this website and other media. To find out more about the cookies we use, see our Privacy Policy. If you decline, your information won’t be tracked when you visit this website. A single cookie will be used in your browser to remember your preference not to be tracked.</p> <button onclick=cookiePopup.acceptAll() class='btn btn-primary fr'>Accept all cookies.</button> <button onclick=cookiePopup.acceptEssential() class='btn btn-primary fr'>Only Essential Cookies</button>`;
        document.body.appendChild(popupcookie);
    },
    acceptAll: function () {
        let store = window.localStorage;
        let status = store.setItem("cookie", "All");
        cookiePopup.close();
    },
    acceptEssential: function () {
        let store = window.localStorage;
        let status = store.setItem("cookie", "Essential Only");
        cookiePopup.close();
    },
    accepted: function () {
        let store = window.localStorage;
        let status = store.getItem("cookie");
        if (status == null) return false;
        return status;
    },
    close: function () {
        document.querySelector(".cookie-popup").remove();
    }
}

if (!cookiePopup.accepted()) {
    cookiePopup.open();
}
