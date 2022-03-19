function redeem(){

  fetch("/redeem-popup.html")
  .then(resp=>resp.text())
  .then(data=>{
    popup=document.createElement("div");
    popup.innerHTML=data;
    document.body.append(popup);
  })

}