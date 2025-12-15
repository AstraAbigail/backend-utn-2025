import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import User from "../model/UserModel"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
import { createUserSchema } from "../validators/userValidator"
import  sendResetPasswordEmail  from "../services/sendResetPasswordEmail"

const SECRET_KEY = process.env.JWT_SECRET!

class AuthController {
  // http://localhost:3000/auth/register
  // method: POST
  // body: {"email": "gabi@gmail.com", "password": pepe123}
  static register = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { username, email, password } = req.body
      console.log(username,email,password)
      if (!username || !email || !password) {
        return res.status(400).json({ success: false, error: "Datos invalidos" })
      }

      const user = await User.findOne({ email })

      if (user) {
        return res.status(409).json({ success: false, error: "El usuario ya existe en la base de datos." })
      }

      //validator
      const dataToValidate = {
        username,
        email,
        password
      }
      
      const validator = createUserSchema.safeParse(dataToValidate)

      if (!validator.success) {
        return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors });
      }

      // crear el hash de la contraseña
      const hash = await bcrypt.hash(password, 10)
      const newUser = new User({ username, email, password: hash })

      await newUser.save()
      res.status(201).json({ success: true, data: newUser })
    } catch (e) {
      const error = e as Error
      switch (error.name) {
        case "MongoServerError":
          return res.status(409).json({ success: false, error: "Usuario ya existente en nuestra base de datos" })
      }
    }
  }

  static login = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { username, email, password } = req.body

      if (!username || !email || !password) {
        return res.status(400).json({ success: false, error: "Datos invalidos" })
      }

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(401).json({ success: false, error: "No autorizado" })
      }

      // validar la contraseña
      const isValid = await bcrypt.compare(password, user.password)

      if (!isValid) {
        return res.status(401).json({ success: false, error: "No autorizado" })
      }

      const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" })
      res.json({ success: true, token })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }
  //genera OTP
  static forgotPassword = async (req:Request, res:Response): Promise<void | Response> => {
    try {      
      const { email } = req.body

      if (!email) {
        return res.status(400).json({
          success: false,
          error: "Email requerido"
        })
      }

      const user = await User.findOne({ email })

      // 🔐 Seguridad: no revelar si existe o no
      if (!user) {
        return res.status(200).json({
          success: true,
          message: "Si el email existe, se enviará un código"
        })
      }

      // 1️⃣ Generar OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString()

      // 2️⃣ Hashearlo
      const hashedOTP = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex")

      // 3️⃣ Guardar OTP + expiración
      user.resetPasswordOTP = hashedOTP
      user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000)

      await user.save()

      await sendResetPasswordEmail(user.email, otp)


      // 4️⃣ Enviar mail (mock)
      console.log("OTP enviado:", otp)

      return res.status(200).json({
        success: true,
        message: "Código enviado al email"
      })

    } catch (error) {
      console.error("FORGOT ERROR:", error)
      return res.status(500).json({
        success: false,
        error: "Error interno"
      })
    } 
  }
  //valida otp + cambia contraseña
  static resetPassword = async (req: Request, res: Response): Promise<void | Response> => {    
    try {
      const { email, otp, password } = req.body
      const user = await User.findOne({ email })
     
      if (!user) {
        return res.status(400).json({
          success: false,
          error: "Código inválido o vencido"
        })
      }
      
      if (
        !user.resetPasswordOTP ||
        !user.resetPasswordExpires ||
        user.resetPasswordExpires.getTime() < Date.now()
      ) {
        return res.status(400).json({
          success: false,
          error: "Código inválido o vencido"
        })
      }


      // 3️⃣ Hashear OTP recibido
      const otpHashed = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex")

      // 4️⃣ Comparar OTP
      if (otpHashed !== user.resetPasswordOTP) {
        return res.status(400).json({
          success: false,
          error: "Código inválido o vencido"
        })
      }

      // 5️⃣ Hashear nueva contraseña
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)

      // 6️⃣ Limpiar OTP
      user.resetPasswordOTP = undefined
      user.resetPasswordExpires = undefined

      await user.save()


      return res.status(200).json({
        success: true,
        message: "Contraseña actualizada correctamente"
      })

    } catch (error) {
      console.error("Reset password error:", error)
      return res.status(500).json({
        success: false,
        error: "Error al resetear contraseña"
      })
    }
  }
  

}

export default AuthController