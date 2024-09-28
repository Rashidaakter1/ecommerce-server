import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: config.NODE_ENV === "production",
  auth: {
    user: "rashidaakterchadni@gmail.com",
    pass: "xpwn mdah uuts tujz",
  },
});

const sendEmail = async (to: string, html: string) => {
  const info = await transporter.sendMail({
    from: "rashidaakterchadni@gmail.com", // sender address
    to, // list of receivers
    subject: "Password Reset link", // Subject line
    text: "Hello world?", // plain text body
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);
};
export default sendEmail;
