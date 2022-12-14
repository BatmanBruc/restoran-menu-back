import { create_category, change_category, delete_category, find_all_category, find_one_category } from './../services/category_service';
import type { Response, Request } from 'express';
import { Rejoin } from "../services/rejoin_service"

export const get_all_category = async (req: Request, res: Response)=>{
    let rejoin: Rejoin = await find_all_category({
        take: req.body.take,
        skip: req.body.skip,
    })
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}

export const get_one_category = async (req: Request, res: Response)=>{
    let rejoin: Rejoin = await find_one_category(Number(req.params.id))
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}


export const add_category = async (req: Request, res: Response)=>{
    let rejoin: Rejoin = await create_category({
        title: req.body.title
    })
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}

export const edit_category = async (req: Request, res: Response)=>{
    let rejoin: Rejoin = await change_category({
        title: req.body.title
    }, Number(req.params.id))
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}

export const remove_category = async (req: Request, res: Response)=>{
    let rejoin: Rejoin = await delete_category(Number(req.params.id))
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}
