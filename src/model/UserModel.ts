import { model, Model, Schema } from "mongoose"
import IUser from "../interfaces/IUser"

const userSchema = new Schema<IUser>({
  username: {type:String, required:true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  resetPasswordOTP: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }



}, {
  versionKey: false,
  timestamps: true
})

const User: Model<IUser> = model("User", userSchema)

export default User