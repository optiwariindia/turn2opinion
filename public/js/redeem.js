selectForm=function (e){
    navbar=e.closest(".form-nav");
    if(navbar == null )return false;
    navbar.querySelector(".active").classList.remove("active");
    e.classList.add("active");
}
frms=document.querySelectorAll("form");
frms.forEach(frm=>{
    frm.addEventListener("submit",function(e){
        e.preventDefault();
        validateForm(e.target);
    });
});
validateForm=function(frm){
    inps=frm.querySelectorAll("input");
    data={};
    for (let index = 0; index < inps.length; index++) {
        const inp = inps[index];
        data[inp.name]=inp.value;
    }
    console.log(data);
};

(async function(){
resp=await fetch("/api/v1/userstatus",{
    method:"GET"
});
info=await resp.json();
console.log(info);
[
    {
        name:"data-redeempoints",
        value:info.user.points
    },
    {
        name:"data-claimed",
        value:`$ ${info.user.points / info.conversion}`
    },
    {
        name:"data-lastclaimed",
        value:`$ 0.00`
    }
].forEach(data=>{
    temp=document.querySelector(`[${data.name}]`);
    temp.innerText=data.value;
})
html=`<li class="heading"><span class="circle"></span> <span class="name">Credit Survey</span> <span class="points">Credit Points</span> <span class="amount">Credit Amount</span></li>`;
for (let index = 0; index < info.earnings.length; index++) {
    let earning=info.earnings[index];
    html+=`<li> <span class="circle"></span> <span class="name">${earning.survey[0].name}</span> <span class="points">${earning.rewards}</span> <span class="amount"><img src="/images/dollar-1.png" />$ ${earning.rewards / info.conversion}</span> </li>`;
}
document.querySelector("[data-earnings]").innerHTML=html;
})();