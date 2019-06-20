const sgMail=require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API)

const welcomeMail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'harisha4swaminathan@gmail.com',
        subject:'Welcome!',
        text:`Thank you for joining, ${name}`
    })
}
const goodByeMail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'harisha4swaminathan@gmail.com',
        subject: `We're sorry to see you leave, ${name}`,
        text:`We'd appreciate it if you could take a moment to tell us why you're leaving `
    })
}
module.exports={
    welcomeMail,
    goodByeMail
}