import nodemailer from "nodemailer"

// Create a test account or replace with real credentials.
const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        //   secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    })

    // Wrap in an async IIFE so we can use await.
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message, // plain‑text body
    }

    const info = await transporter.sendMail(message)

    console.log("Message sent: ", info.messageId)
}


export default sendEmail