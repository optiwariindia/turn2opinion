const PasswordManager = {
    strong: new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})'),
    medium: new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))'),
    passwordField: null,
    init:function(querySelector){
        PasswordManager.passwordField = document.querySelector(querySelector);
        PasswordManager.passwordField.addEventListener('keyup',PasswordManager.strengthCheck);
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
    match: function (confirm) {
        pass = PasswordManager.passwordField;
        confirm.classList.remove('matched');
        confirm.classList.remove('unmatched');
        if (pass.value == confirm.value)
            confirm.classList.add("matched");
        else
            confirm.classList.add("unmatched");
    }
}
