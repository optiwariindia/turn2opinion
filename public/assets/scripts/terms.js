((frm,submitButton)=>{
    elm=frm.querySelectorAll("[type=checkbox]");
    elm.forEach(checkboxInput=>{
        checkboxInput.addEventListener("change",(e)=>{
            console.table({
                checkedInputs:frm.querySelectorAll("[type=checkbox]:checked").length,
                uncheckedMandatory:frm.querySelectorAll("[type=checkbox][required]:not(:checked)").length,
                criteria:(frm.querySelectorAll("[type=checkbox]:checked").length>4 && frm.querySelectorAll("[type=checkbox][required]:not(:checked)").length == 0)
            });
          if(frm.querySelectorAll("[type=checkbox]:checked").length>4 && frm.querySelectorAll("[type=checkbox][required]:not(:checked)").length == 0){
              submitButton.classList.remove("btn-secondary");
              submitButton.classList.add("btn-primary");
              submitButton.classList.remove("disabled");
              submitButton.setAttribute("title","Click to Accept Terms and Conditions");
              submitButton.type="submit";
          }else{
            submitButton.classList.add("btn-secondary");
            submitButton.classList.remove("btn-primary");
            submitButton.classList.add("disabled");
            submitButton.setAttribute("title","Select at least 5 terms and conditions to continue");
            submitButton.type="button";
          }
        })
    })
})(document.querySelector(".terms-checkbox"),document.querySelector("#termsButton"));
function checkall(e){
    elm=document.querySelector(".terms-checkbox").querySelectorAll("[type=checkbox]").forEach(checkboxInput=>{
        let submitButton=document.querySelector("#termsButton");
        if(!checkboxInput.hasAttribute("required"))
            checkboxInput.checked=e.checked;
            else
            checkboxInput.checked=true;
        if(e.checked){
            submitButton.classList.remove("btn-secondary");
            submitButton.classList.remove("disabled");
            submitButton.classList.add("btn-primary");
            submitButton.setAttribute("title","Click to Accept Terms and Conditions");
            submitButton.type="submit";
        }else{
            submitButton.classList.add("btn-secondary");
            submitButton.classList.remove("btn-primary");
            submitButton.classList.add("disabled");
            submitButton.setAttribute("title","Select at least 5 terms and conditions to continue");
            submitButton.type="button";
        }
    })
}