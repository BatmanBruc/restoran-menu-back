import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import { PrismaClient, type User } from '@prisma/client'
import config from '../config';
import { ModelEnity } from "./enity_service"
import { FIELD_REQUIRED, USER_ALREADY_EXISTS, NOT_FOUND_NICKENAME, BAD_PASSWORD, BAD_TOKEN } from "./errors_service"
import { Rejoin, RejoinError, RejoinSuccess } from "./rejoin_service"
const prisma = new PrismaClient()

type DataUser = {
    login: string,
    password: string
}

class UserEnity extends ModelEnity<DataUser>{
    required_fields = {
        login: true,
        password: true
    }
    async verify_is_user(): Promise<User | false> {
        const user = await prisma.user.findUnique({where: { login: this.data.login }})
        if(user)
            return user
        return false
    }
    password_hash(){
        this.data.password = bcrypt.hashSync(this.data.password, config.salt_rounds_for_bcrypt)
    }
    verify_password(password_checker: string){
        return bcrypt.compareSync(this.data.password, password_checker);
    }
}

export const create_user = async function(data: DataUser): Promise<Rejoin>{
    const user_enity = new UserEnity(data)
    let missing_fields = user_enity.verify_fields()
    if(missing_fields.length)
        return new RejoinError({
            description: FIELD_REQUIRED[0],
            content: missing_fields,
            status: FIELD_REQUIRED[1],
            code: FIELD_REQUIRED[2]
        })
    
    const user = await user_enity.verify_is_user()
    if(user)
        return new RejoinError({
            description: USER_ALREADY_EXISTS[0],
            status: USER_ALREADY_EXISTS[1],
            code: USER_ALREADY_EXISTS[2]
        })

    user_enity.password_hash()

    await prisma.user.create({data: user_enity.data})
    return new RejoinSuccess({
        description: 'Регистрация прошла успешно.',
        status: 200
    })
}

export const check_user = async function(data: DataUser): Promise<Rejoin> {
    const user_enity = new UserEnity(data)
    let missing_fields = user_enity.verify_fields()
    if(missing_fields.length)
        return new RejoinError({
            description: FIELD_REQUIRED[0],
            content: missing_fields,
            status: FIELD_REQUIRED[1],
            code: FIELD_REQUIRED[2]
        })
    
    const user = await user_enity.verify_is_user()
    if(!user)
        return new RejoinError({
            description: NOT_FOUND_NICKENAME[0],
            status: NOT_FOUND_NICKENAME[1],
            code: NOT_FOUND_NICKENAME[2]
        })

    const result_verify = user_enity.verify_password(user.password)
    if(!result_verify)
        return new RejoinError({
            description: BAD_PASSWORD[0],
            status: BAD_PASSWORD[1],
            code: BAD_PASSWORD[2] 
        })
    
    return new RejoinSuccess({
        description: 'Успешная авторизация.',
        content: jwt.sign({
            id: user.id,
            login: user.login
        }, config.jwt_token),
        status: 200
    })
}