import type { Response, Request } from 'express';
import { Rejoin, RejoinError } from "../services/rejoin_service"
import { create_product, change_product, delete_product, find_all_products, find_one_product } from './../services/product_service';
import { create_image } from './../services/images_services';
import { EMPTY_IMAGE } from '../services/errors_service';

export const get_all_products = async (req: Request, res: Response)=>{
    let rejoin: Rejoin = await find_all_products({
        take: req.body.take,
        skip: req.body.skip,
    })
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}

export const get_one_product = async (req: Request, res: Response)=>{
    let rejoin: Rejoin = await find_one_product(Number(req.params.id))
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}


export const add_product = async (req: Request, res: Response)=>{
    let rejoin: Rejoin = await create_product({
        title: req.body.title,
        category_id: req.body.category_id,
        image_id: req.body.image_id,
    })
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}

export const edit_product = async (req: Request, res: Response)=>{
    let rejoin: Rejoin = await change_product({
        title: req.body.title,
        category_id: req.body.category_id,
    }, Number(req.params.id))
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}

export const remove_product = async (req: Request, res: Response)=>{
    let rejoin: Rejoin = await delete_product(Number(req.params.id))
    res.status(rejoin.get_status()) 
    res.send(rejoin.get())
}

export const upload_photo = async (req: Request | { files: { image: any } }, res: Response)=>{
    let rejoin: Rejoin
    if(!req.files || !req.files.image)
        rejoin = new RejoinError({
            description: EMPTY_IMAGE[0],
            status: EMPTY_IMAGE[1],
            code: EMPTY_IMAGE[2],
        })
    else
        rejoin = await create_image(req.files.image)
    res.status(rejoin.get_status())
    res.send(rejoin.get())
}
