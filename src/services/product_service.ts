import { ModelEnity, EnityRequest, IPagination } from "./enity_service"
import { PrismaClient, Product, Category, Prisma } from "@prisma/client"
import { ITEM_ALREADY_EXISTS, FIELD_REQUIRED, NOT_FOUND_ITEM, NOT_FOUND_CATEGORY, BAD_ID } from "./errors_service"
import { RejoinError, RejoinSuccess } from "./rejoin_service"

const prisma = new PrismaClient()

type DataProduct = {
    title: string,
    category_id: number,
    image_id?: number 
}

const includeProduct = Prisma.validator<Prisma.ProductInclude>()({
    image: true,
    category: true
})

class ProductRequestEnity extends EnityRequest{
    async verify_is_product_by_id(): Promise<Category | false> {
        const product = await prisma.product.findUnique({where: { id: this.id }, include: includeProduct})
        if(product)
            return product
        return false
    }
}

class ProductEnity extends ModelEnity<DataProduct>{
    required_fields = {
        title: true,
        category_id: true
        
    }
    async verify_is_product_by_title(): Promise<Product | false> {
        const cateogry = await prisma.product.findUnique({where: { title: this.data.title }})
        if(cateogry)
            return cateogry
        return false
    }
    async verify_is_category_by_id(): Promise<Category | false> {
        const category = await prisma.category.findUnique({where: { id: this.data.category_id }})
        if(category)
            return category
        return false
    }
}

export const find_all_products = async function(pagination: IPagination){
    const product_request_enity = new ProductRequestEnity(undefined, pagination)

    const missing_fields = await product_request_enity.verify_pagination()
    if(missing_fields.length)
        return new RejoinError({
            description: FIELD_REQUIRED[0],
            content: missing_fields,
            status: FIELD_REQUIRED[1],
            code: FIELD_REQUIRED[2]
        })

    const list = await prisma.product.findMany({ ...pagination,  include: includeProduct })
    const count = await prisma.product.count()

    return new RejoinSuccess({
        content: {list, count},
        status: 200
    })
}

export const find_one_product = async function(id: number){
    const product_request_enity = new ProductRequestEnity(id)

    const is_id: boolean = await product_request_enity.verify_id()
    if(!is_id)
        return new RejoinError({
            description: BAD_ID[0],
            status: BAD_ID[1],
            code: BAD_ID[2]
        })

    const product = await product_request_enity.verify_is_product_by_id()
    if(!product)
        return new RejoinError({
            description: NOT_FOUND_ITEM[0],
            content: product,
            status: NOT_FOUND_ITEM[1],
            code: NOT_FOUND_ITEM[2]
        })

    return new RejoinSuccess({
        content: product,
        status: 200
    })
}

export const create_product = async function(data: DataProduct ){
    const product_enity = new ProductEnity(data)

    const missing_fields = product_enity.verify_fields()
    if(missing_fields.length)
        return new RejoinError({
            description: FIELD_REQUIRED[0],
            content: missing_fields,
            status: FIELD_REQUIRED[1],
            code: FIELD_REQUIRED[2]
        })

    const product = await product_enity.verify_is_product_by_title()
    if(product)
        return new RejoinError({
            description: ITEM_ALREADY_EXISTS[0],
            content: product,
            status: ITEM_ALREADY_EXISTS[1],
            code: ITEM_ALREADY_EXISTS[2]
        })
    
    const category = await product_enity.verify_is_category_by_id()
    if(!category)
        return new RejoinError({
            description: NOT_FOUND_CATEGORY[0],
            content: category,
            status: NOT_FOUND_CATEGORY[1],
            code: NOT_FOUND_CATEGORY[2]
        })
    
    const result = await prisma.product.create({ data: product_enity.data })

    return new RejoinSuccess({
        description: 'Блюдо создано.',
        content: result,
        status: 200
    })
}

export const change_product = async function(data: DataProduct, id: number ){
    const product_enity = new ProductEnity(data)
    const product_request_enity = new ProductRequestEnity(id)

    const is_id: boolean = await product_request_enity.verify_id()
    if(!is_id)
        return new RejoinError({
            description: BAD_ID[0],
            status: BAD_ID[1],
            code: BAD_ID[2]
        })

    const product = await product_request_enity.verify_is_product_by_id()
    if(!product)
        return new RejoinError({
            description: ITEM_ALREADY_EXISTS[0],
            content: product,
            status: ITEM_ALREADY_EXISTS[1],
            code: ITEM_ALREADY_EXISTS[2]
        })
    
    const missing_fields = product_enity.verify_fields()
    if(missing_fields.length)
        return new RejoinError({
            description: FIELD_REQUIRED[0],
            content: missing_fields,
            status: FIELD_REQUIRED[1],
            code: FIELD_REQUIRED[2]
        })

    const result = await prisma.product.update({ data: product_enity.data, where: { id: product_request_enity.id } })

    return new RejoinSuccess({
        description: 'Блюдо именено.',
        content: result,
        status: 200
    })
}
export const delete_product = async function(id: number ){
    const product_request_enity = new ProductRequestEnity(id)

    const is_id: boolean = await product_request_enity.verify_id()
    if(!is_id)
        return new RejoinError({
            description: BAD_ID[0],
            status: BAD_ID[1],
            code: BAD_ID[2]
        })

    const product = await product_request_enity.verify_is_product_by_id()
    if(!product)
        return new RejoinError({
            description: ITEM_ALREADY_EXISTS[0],
            content: product,
            status: ITEM_ALREADY_EXISTS[1],
            code: ITEM_ALREADY_EXISTS[2]
        })

    const result = await prisma.product.delete({ where: { id: product_request_enity.id } })

    return new RejoinSuccess({
        description: 'Блюдо изменено.',
        content: result,
        status: 200
    })
}