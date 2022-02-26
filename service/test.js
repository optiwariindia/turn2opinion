const twig  = require("twig");
const email = require("./email");
twig.renderFile("mail.twig",(e,h)=>{
    email.sendEmail("om.tiwari@frequentresearch.com","Activate your Turn2Opinion Account","Testing by OPT",h);
})