import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'
import type { Response, Request } from 'express';
import config from './config';
import { BAD_TOKEN } from "./services/errors_service"
import { RejoinError } from "./services/rejoin_service"

const prisma = new PrismaClient()

export const check_token_auth = function(req: Request, res: Response, next: Function){
    const resError =  new RejoinError({
        description: BAD_TOKEN[0],
        status: BAD_TOKEN[1],
        code: BAD_TOKEN[2]
    })

    if(!req.headers.authorization){
        res.status(resError.get_status())
        res.send(resError.get())
        return
    }
    const auth_token: string = req.headers.authorization

    if (auth_token) {
        jwt.verify(
            auth_token,
            config.jwt_token,
            async (err, payload) => {
                if (err){
                    res.status(resError.get_status())
                    res.send(resError.get())
                }
                else if (payload) {
                    let user = await prisma.user.findUnique({ where: { id: typeof payload != 'string' && typeof payload != 'undefined' ?  payload.id : payload } })
                    if(!user){
                        res.status(resError.get_status())
                        res.send(resError.get())
                    }else{
                        next()
                    }
                }
            }
        )
        return
    }else{
        res.status(resError.get_status())
        res.send(resError.get())
        return
    }
}