import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const sendResetPasswordEmail = async ( email: string, otp: string) => {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Código para restablecer contraseña",
    html: `
      <h2>Restablecer contraseña</h2>
      <p>Tu código es:</p>
      <h1>${otp}</h1>
      <p>Este código expira en 10 minutos.</p>
    `
  })
}

export default sendResetPasswordEmail