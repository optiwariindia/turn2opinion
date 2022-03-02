((frm,submitButton)=>{
    elm=frm.querySelectorAll("[type=checkbox]");
    elm.forEach(checkboxInput=>{
        checkboxInput.addEventListener("change",(e)=>{
          if(frm.querySelectorAll("[type=checkbox]:checked").length>2){
              submitButton.classList.remove("btn-secondary");
              submitButton.classList.add("btn-primary");
              submitButton.type="submit";
          }else{
            submitButton.classList.add("btn-secondary");
            submitButton.classList.remove("btn-primary");
            submitButton.type="button";
          }
        })
    })
})(document.querySelector(".terms-checkbox"),document.querySelector("#termsButton"));
function checkall(e){
    elm=document.querySelector(".terms-checkbox").querySelectorAll("[type=checkbox]").forEach(checkboxInput=>{
        let submitButton=document.querySelector("#termsButton");
        checkboxInput.checked=e.checked;
        if(e.checked){
        submitButton.classList.remove("btn-secondary");
        submitButton.classList.add("btn-primary");
        submitButton.type="submit";
        
        }else{
            submitButton.classList.add("btn-secondary");
        submitButton.classList.remove("btn-primary");
        submitButton.type="button";
        }
    })
}