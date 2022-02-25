const nodemailer=require('nodemailer');
module.exports=email={
    setup:{
        sender:{
            name:'',
            email:''
        },
        host:'s10.cyberspace.in',
        port:465,
        secure:true,
        auth:{
            user:'',
            pass:''
        }
    },
    sendEmail:function(to,subject,text,html){
        let transporter = nodemailer.createTransport(email.setup);
        transporter.sendMail({
            from:`${email.setup.sender.name} <${email.setup.sender.email}>`,
            to:to,
            subject:subject,
            text:text,
            html:html
        }).then(info=>{
            console.log('Message sent: %s', info.messageId);
        }).catch(err=>{
            console.log('Error sending email: %s', err);
        });
    }
}