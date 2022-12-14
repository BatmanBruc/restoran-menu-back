import type { Response, Request } from 'express';
import { create_user, check_user } from '../services/user_service';
import { Rejoin } from "../services/rejoin_service"

export const auth_sign_up = async (req: Request, res: Response)=>{
    let rejoin: Rejoin = await create_user({
        login: req.body.login,
        password: req.body.password,
    })
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}
export const auth_sign_in = async (req: Request, res: Response)=>{
    let rejoin: Rejoin = await check_user({
        login: req.body.login,
        password: req.body.password,
    })
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}