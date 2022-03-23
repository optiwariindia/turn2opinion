const PasswordManager = {
    strong: new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})'),
    medium: new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))'),
    passwordField: null,
    init:function(querySelector){
        PasswordManager.passwordField = document.querySelector(querySelector);
        PasswordManager.passwordField.addEventListener('keyup',PasswordManager.strengthCheck);
        let cnfpassfield = document.querySelector("[name=cnfpass");
        if(cnfpassfield){
            cnfpassfield.addEventListener('keyup',PasswordManager.match);
        }
    },
    show:function(){
        PasswordManager.passwordField.type = 'text';
        setTimeout(() => {
            PasswordManager.passwordField.type='password';
        }, 5000);
    },
    strengthCheck: function (e) {
        let pass=PasswordManager.passwordField.value;
        PasswordManager.passwordField.classList.remove('strong');
        PasswordManager.passwordField.classList.remove('medium');
        PasswordManager.passwordField.classList.remove('weak');
        if (PasswordManager.strong.test(pass)) {
            PasswordManager.passwordField.classList.add("strong");
            return false;
        }
        if (PasswordManager.medium.test(pass)) {
            PasswordManager.passwordField.classList.add("medium");
            return false;
        }
        PasswordManager.passwordField.classList.add("weak");
    },
    strength:function(e){
        return PasswordManager.strong.test(e)
    },
    match: function (event) {
        confirm=event.target;
        console.log(confirm);
        pass = PasswordManager.passwordField;
        confirm.classList.remove('matched');
        confirm.classList.remove('unmatched');
        if (pass.value == confirm.value)
            confirm.classList.add("matched");
        else
            confirm.classList.add("unmatched");
    },
    change:async function(e){
        data={};
        await e.form.querySelectorAll('[name]').forEach(function(input){
            data[input.name]=input.value;
        });
        if(!PasswordManager.strength(data.newpass)){
            alert('Password is not strong enough');
            return;
        }
        if(data.newpass!=data.cnfpass){
            alert('Password does not match');
            return;
        }
        fetch("/user/changepassword",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        }).then(resp=>resp.json()).then(function(data){
            console.log(data);
        })
    }
}
