const nodemailer=require('nodemailer');
const dns=require('dns');
module.exports=email={
    validate:function(email,callback){
        email=email.split("@");
        if(email.length !== 2){
            callback({status:"error",message:"E-Mail is not valid"});
            return false;
        }
        dns.resolve(email[1],"MX",(err,resp)=>{
            if(err){
                callback({status:"error",message:"E-Mail is not valid"});
                return false;
            }else
            {
                callback({status:"success",message:"E-Mail is valid"});
                return true;
            }
        })
    },
    setup:{
        sender:{
            name:'Turn2Opinion Support',
            email:'support@frequentresearch.com'
        },
        host:'s10.cyberspace.in',
        port:465,
        secure:true,
        auth:{
            user:'support@frequentresearch.com',
            pass:'frfssupport@123'
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