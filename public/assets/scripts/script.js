(async function () {
    let elm = document.querySelector("#profile-status");
    resp=await fetch("/api/v1/profileStatus");
    data=await resp.json();
    total=0;value=0;
    for(let i=0;i<data.length;i++){
        total++;//=data[i][2];
        if( data[i][1]==data[i][2])
        value++;//=data[i][1];
    }
    // console.log({total:total,value:value});
    // console.table(data);
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
          data: [value,total-value],
          backgroundColor: [
            'rgb(54, 162, 235)',
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
  })();
  const user={
      logout:function(){
          localStorage.removeItem("auth");
          window.location.href="/user/logout";
      }
  }