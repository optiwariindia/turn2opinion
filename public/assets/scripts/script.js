(
  async () => {
    fn = {
      profileStatus: async function () {
        let elm = document.querySelector("#profile-status");
        if (!elm) return;
        resp = await fetch("/api/v1/profileStatus");
        data = await resp.json();
        total = 0; value = 0;
        for (let i = 0; i < data.length; i++) {
          total++;
          value+=data[i].completed / 100;
        }
        new Chart(elm,
          {
            type: "doughnut",
            data: {
              labels: [
                "Completed",
                "Pending...."
              ],
              datasets: [{
                label: 'Profile Status',
                data: [value, total - value],
                backgroundColor: [
                  '#ea9215',
                  'rgb(200,200,200)'
                ],
                hoverOffset: 1,
                options: {
                  elements: {
                    center: {
                      text: 'Red is 2/3 of the total numbers',
                      color: '#FF6384', // Default is #000000
                      fontStyle: 'Arial', // Default is Arial
                      sidePadding: 10, // Default is 20 (as a percentage)
                      minFontSize: 15, // Default is 20 (in px), set to false and text will not wrap.
                      lineHeight: 15 // Default is 25 (in px), used for when text wraps
                    }
                  }
                }
              }]
            }
          }
        )
      },
      earnings: async function () {
        resp = await fetch("/api/v1/earnings");
        data = await resp.json();
        totalearnings=document.querySelector("[data=totalearnings]");
        if(totalearnings==null )return;
        totalearnings.innerHTML = data.total;
        let chart = new Chart(
          document.querySelector("#spark-earnings")
          , {
            type: 'line',
            data: {
              labels: data.month,
              datasets: [{
                label: "Earnings",
                data: data.amount
              }],
            }
          });
      }
    }
    fn.profileStatus();
    fn.earnings();
  }
)();
const user = {
  logout: function () {
    localStorage.removeItem("auth");
    window.location.href = "/user/logout";
  }
}
const contact={
  form:document.querySelector("#social-form"),
  add:function(e){
    
    if(contact.form == null )
    return false;
    contact.showForm({form:e.getAttribute("form"),value:e.getAttribute("info")});
  },
  showForm:function(e){    
    labels={
      googleplus:"Enter your Google+ ID",
      facebook:"Enter your Facebook Profile URL",
      twitter:"Enter your Twitter handle",
      linkedin:"Enter your Linkedin Profile URL",
      instagram:"Enter your Instagram Profile URL",
      youtube:"Enter your Youtube Channel URL",
      whatsapp:"Enter your Whatsapp Number",
      paypal:"Enter your Paypal Email",
    }
    contact.form.classList.remove("hidden");
    label=contact.form.querySelector("[data=socialLabel]");
    console.log(e);
    if(label!=null)label.innerText=labels[e.form]||`Add ${e.form} id`;
    contact.form.querySelector("[name=platform]").value=e.form;
    contact.form.querySelector("[name=userid]").value=e.value;
  },
  hide:function(){
    contact.form.classList.add("hidden");
  }
};
const custom={
  popup:{
    close:function(e){
      e.closest(".custom-popup").style="display:none"
    }
  }
}