import User from "../models/user.model.js"
import genToken from "../config/token.js"

export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body
        let user = await User.findOne({ email })

        if (!user) {
            user = await User.create({
                name,
                email
            })
        }
        let token = await genToken()
    } catch (error) {

    }
}