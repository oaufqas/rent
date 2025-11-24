import accountService from "../services/account-service.js"

class AccountController {
    
    async getAllAccounts(req, res, next) {
        try {
            const {bape, crewUniform, more300mif} = req.query

            const accsData = await accountService.getSortOrAllAcc(bape, crewUniform, more300mif)

            return res.json(accsData)            
        } catch (e) {
            next(e)
        }
    }
    
    async getOneAccount(req, res, next) {
        try {
            const {id} = req.params

            const accData = await accountService.getOneAccount(id)

            return res.json(accData)            
        } catch (e) {
            next(e)
        }
    }
}

export default new AccountController()