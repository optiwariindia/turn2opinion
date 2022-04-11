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
          if (data[i][1] == data[i][2])
            value++;
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
    contact.showForm(e);
  },
  showForm:function(e){    
    contact.form.classList.remove("hidden");
    label=contact.form.querySelector("[data=socialLabel]");
    if(label!=null)label.innerText=`Add ${e} id`;
    contact.form.querySelector("[name=platform]").value=e;
  },
  hide:function(){
    contact.form.classList.add("hidden");
  }
}