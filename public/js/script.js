
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
        fetch("/user/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(flds)
        }).then(res => res.json()).then(res => {
            if(res.status==="ok"){
                popup.show(`<h2>Thanks for Joining</h2><br><p>Dear ${res.user.fn}, Your sign up requiest has been successfully submitted. Please open your email (${res.user.email}) and click the verify Link to setup your password and login to your dashboard.</p>`);
            }
        }).catch(err => {
            console.log(err);
            e.target.innerHTML=`<div id="fh5co-logo"><a href="index.html">Turn<span>2</span>Opinion</a></div><h2>Declined</h2><br><p>Your request to register is decliend due to some system error. Please try after some time and try again. </p>`
        });
    } else if (e.target.getAttribute("name") === "setpass") {
        if(!strongPassword.test($("[name=pass]").val())){
            alert("Password is not strong enough to continue");
            return false;
        }
        if($("[name=pass]").val() !== $("[name=cpass]").val()){
            alert("Passwords are not matching");
            return false;
        }
        e.target.submit();
    }else if (e.target.getAttribute("name") === "forgot"){
        email=e.target.querySelector("[name=email]").value;
        secans=e.target.querySelector("[name=security]").value;
        if(secans===""){
        fetch("/user/securityquestion",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({email:email})
        }).then(res=>res.json()).then(res=>{
            if(res.status === "ok"){
                secque=document.querySelector("[data=securityque]");
                secque.innerText=res.question;
                console.log(secque);
                secque.parentElement.style.display="block";
                e.target.querySelector("[type=submit]").value="Reset Password";
            }
        });
    }else{
        fetch("/user/forgot",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({email:email,security:secans})
        }).then(res=>res.json()).then(res=>{
            if(res.status === "ok"){
                popup.show(`<p>Hi ${res.user.fn},</p>
                <p>Your request for password reset has been sent to your registered email address. Please check your email and follow the instructions to reset your password. If you have not received it in your inbox please check your spam/bulk mail  folder.</p>`,"/");
            }else{
                
            }
        });
    }
    }else{
        // console.log(e.target.getAttribute("action"));
        let flds={};
        e.target.querySelectorAll("[name]").forEach(inp=>{
            flds[inp.name]=inp.value;
        })
        fetch(e.target.getAttribute("action"),{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(flds)
        }).then(res=>res.json()).then(resp=>{
            if(resp.status==="ok"){
                // console.log(resp);
                location.href="/user/dashboard";
            }else{
                document.querySelector("[data=autherror]").innerText=resp.message;
                setTimeout(() => {
                    document.querySelector("[data=autherror]").innerText="";
                }, 5000);
            }
        }).catch(err=>{console.log(err)})
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
if($("[name=pass]").val() === "") { $(".pwstatus").html(""); }
    else if ($("[name=pass]").val() !== $("[name=cpass]").val()) {
        $(".pwstatus").html("Passwords are not matching");//.css("color", "red");
    } else {
        $(".pwstatus").html("Password Matched")
    }

}
$("[name=cpass").on("change", matchpass);
$("[name=pass").on("change", matchpass);
popup={
    close:function(){
        document.querySelector(".forced-popup").remove();
    },
    show:function(message,closeTarget=null){
        popupElement=document.createElement("div");
        if(closeTarget==null)let=href="";else href=`href="${closeTarget}"`;
                popupElement.innerHTML=`<div class='popup-body'>
                <a ${href} onclick=popup.close()><i class='fa fa-times fr'></i></a>
                <div class='logo-center'><img src='/assets/images/logo.png'></div>
                ${message}
                </div>`;
                popupElement.classList.add("forced-popup");
                document.body.appendChild(popupElement);
    }
}