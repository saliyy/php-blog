const authService = require("../services/AuthService")

class AuthController {
    async registration(req, res) 
    {
        try {
            const { email, password, name } = req.body

            const userData = await authService.registration(email, password, name)

            res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
            
        } catch (ex) {
            console.dir(ex)
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body

            const userData = await authService.login(email, password)

            res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
        }catch (ex) {
            console.dir(ex)
            throw  new Error("fuck off")
        }

    }

    async logout(req, res) {
        const { refreshToken } = req.cookies

        const result = await authService.logout(refreshToken)

        res.clearCookie("refreshToken")

        return res.send(result)
    }

    async refresh(req, res) {
        try {
            const { refreshToken } = req.cookies

            const userData = await authService.refresh(refreshToken)
    
            res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
    
            return res.json(userData)
        } catch(ex) {
            res.status(401).send(ex)
        }
    }
}

module.exports = new AuthController()