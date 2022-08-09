const twig  = require("twig");
const email = require("./email");
twig.renderFile("mail.twig",(e,h)=>{
    email.sendEmail("optiwari.india@gmail.com","Test mail from OPTiwari","Testing by OPT",h)
        .then(info=>{
            console.log(info);
        })
        .catch(err=>{
            console.log(err);
        })
    email.sendEmail("om.tiwari@team.frequentresearch.com","Test mail from OPTiwari","Testing by OPT",h);
    email.sendEmail("om.tiwari@frequentresearch.com","Test mail from OPTiwari","Testing by OPT",h);
})