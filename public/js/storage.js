const localDB={
  delete:function(key){
    window.localStorage.removeItem(key);
  },
  has:function(key){
    return (window.localStorage.getItem(key)!= null);
  },
  store:function(key,value){
    window.localStorage.setItem(key,value)
  },
  fetch:function(key){
    return window.localStorage.getItem(key)
  },
  login:function(){
    let info=JSON.parse(atob(window.localStorage.getItem("auth")));
    fetch("/user/auth",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(info)
    })
    .then(resp=>resp.json())
    .then(response=>{
      if(response.status !== "error")location.href=response.redirect;
      else {
        console.log(response)
        localDB.delete('auth')
      }
    })
  }
}
// Validating authentication status
if(localDB.has("auth"))
  localDB.login();
