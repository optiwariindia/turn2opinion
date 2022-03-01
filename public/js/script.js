$("form").submit(function (e) {
    e.preventDefault();
    if (this.classList.contains("sign-up-htm")) {
        if ($(this)[0].querySelector("[name=gender]:checked") === null) {
            alert("Select Gender");
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
        e.target.innerHTML = "Please Wait ...";
        if ("g-recaptcha-response" in flds) {
            if (flds['g-recaptcha-response'] === "") { alert("Please verify you are not a robot"); return false; }
            else {
                fetch("/user/new", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(flds)
                }).then(res => res.json()).then(res => {
                    if (res.status === "ok") {
                        popup.show(`<h2>Thanks for Joining</h2><br><p>Dear ${res.user.fn}, Your sign up requiest has been successfully submitted. Please open your email (${res.user.email}) and click the verify Link to setup your password and login to your dashboard.</p>`);
                    }
                }).catch(err => {
                    console.log(err);
                    e.target.innerHTML = `<div id="fh5co-logo"><a href="index.html">Turn<span>2</span>Opinion</a></div><h2>Declined</h2><br><p>Your request to register is decliend due to some system error. Please try after some time and try again. </p>`
                });
            }
        }
    } else if (e.target.getAttribute("name") === "setpass") {
        if (!strongPassword.test($("[name=pass]").val())) {
            alert("Password is not strong enough to continue");
            return false;
        }
        if ($("[name=pass]").val() !== $("[name=cpass]").val()) {
            alert("Passwords are not matching");
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
                popup.show(`<h2>Password Changed Successfully</h2><br><p> Your password has been successfully changed. Please <a href='/'>Sign In</a> to your account.</p>`);
            } else {
                document.querySelector("[data=autherror]").innerText = resp.message;
                setTimeout(() => {
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
                    console.log(secque);
                    secque.parentElement.style.display = "block";
                    e.target.querySelector("[type=submit]").value = "Reset Password";
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
        // console.log(e.target.getAttribute("action"));
        let flds = {};
        e.target.querySelectorAll("[name]").forEach(inp => {
            flds[inp.name] = inp.value;
        })
        if(("g-recaptcha-response" in flds) && (flds['g-recaptcha-response'] !== "")){        
        fetch(e.target.getAttribute("action"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(flds)
        }).then(res => res.json()).then(resp => {
            if (resp.status === "ok") {
                // console.log(resp);
                location.href = "/user/dashboard";
            } else {
                document.querySelector("[data=autherror]").innerText = resp.message;
                setTimeout(() => {
                    document.querySelector("[data=autherror]").innerText = "";
                }, 5000);
            }
        }).catch(err => { console.log(err) })
    }else{
        alert("Please verify you are not a robot");
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
    }
}
showPassword = function (e) {
    p = e.parentElement;
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
