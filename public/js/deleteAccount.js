const deleteMyAccount=()=>{
    fetch("/user/delete",{
        method:"DELETE"
    }).then(res=>res.json()).then(r=>{
        popup=document.querySelector("#deleteAccount");
        popup.querySelector(".modal-body").innerHTML=`<p>${r.message}</p>`;
        popup.querySelector(".modal-footer").innerText="";
    })
}