import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'strange426344@gmail.com',
    pass: 'nsqhrjstugtxfjwb',
  },
})

/**
 * Sends an email notification
 * @param to - Recipient email
 * @param subject - Email subject
 * @param text - Email body
 */
export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Stock Alert" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    })

    console.log('Email sent: ', info.messageId)
    return { success: true }
  } catch (error) {
    console.error('Error sending email: ', error)
    return { success: false, error }
  }
}
