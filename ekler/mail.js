const nodemailer = require("nodemailer");

config_mail =  {
    host: "mail.missha.com.tr",
    port:587,
    secure:false,
    tls: {
        rejectUnauthorized:false
    },
    auth: {
        user:"teknik.destek@missha.com.tr",
        pass:"tkd12355321"
    },
}

transporter = new nodemailer.createTransport( config_mail );

module.exports = {
    gonder: function( bakiye ){
        mail_bilgisi = {
            from: config_mail.auth.user,
            to: "mehmet.tkmk.0352@gmail.com",
            subject:"İşlem bekliyor",
            text: "İşlem bitti bakiye: "+bakiye
        }
        transporter.sendMail( mail_bilgisi, (err, res) => {
            console.log( err );
            console.log( res );
        });
    }
}



