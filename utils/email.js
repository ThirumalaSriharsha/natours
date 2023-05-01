const nodemailer = require('nodemailer');
const pug=require('pug');
const htmlToText=require('html-to-text');
module.exports=class Email{
   constructor(user,url) {
    this.to=user.email;
    this.firstName=user.name.split( " ")[0];
    this.url=url;
    this.from=` SRIHARSHA < ${process.env.EMAIL_FROM}>`
   }
newTransport()
{
  if(process.env.NODE_ENV === 'production')
  {
    //sendgrid

    return nodemailer.createTransport(
      {
        service:'sendGrid',
        auth:
        {
          user:process.env.SENDGRID_USERNAME,
          pass:process.env.SENDGRID_USERNAME
        }
      }
    )
  }
   return nodemailer.createTransport(
    {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD 
          }
   
    }
    )
}

async send(templete,subject)
{
 
  // 1) rendering the templete
   
 const html=pug.renderFile(`${__dirname}/../views/email/${templete}.pug`,
 {
  firstName:this.firstName,
  url:this.url,
  subject
 });   
    
   
  // 2) definr the email options 

   const mailOptions = {
    from: this.from,
    to: this.to,
    subject,
    html,
    // text:htmlToText.fromString(html)
    
  };


  // 3)  creating the transporter

  await this.newTransport().sendMail(mailOptions);
}

sendWelcome()
{
  this.send('welcome','welcome to the natours family');
};

sendResettoken()
{
  this.send('passwordReset',' this email is to reset your password ');
}
};





