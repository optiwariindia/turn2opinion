const twig  = require("twig");
const email = require("./email");
twig.renderFile("mail.twig",(e,h)=>{
    email.sendEmail("sachin@frequentresearch.com","Test mail from OPTiwari","Testing by OPT",h);
})