interface IUser {
  username:string
  email: string,
  password: string
  resetPasswordOTP?: string
  resetPasswordExpires?: Date
}

export default IUser