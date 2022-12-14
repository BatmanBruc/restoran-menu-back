import { ModelEnity, EnityRequest, IPagination } from "./enity_service"
import { PrismaClient, Category } from "@prisma/client"
import { ITEM_ALREADY_EXISTS, FIELD_REQUIRED, NOT_FOUND_ITEM, BAD_ID } from "./errors_service"
import { RejoinError, RejoinSuccess } from "./rejoin_service"

const prisma = new PrismaClient()

type DataCategory = {
    title: string
}

class CategoryRequestEnity extends EnityRequest{
    async verify_is_category_by_id(): Promise<Category | false> {
        const cateogry = await prisma.category.findUnique({where: { id: this.id }})
        if(cateogry)
            return cateogry
        return false
    }
}

class CategoryEnity extends ModelEnity<DataCategory>{
    required_fields = {
        title: true
    }
    async verify_is_category_by_title(): Promise<Category | false> {
        const cateogry = await prisma.category.findUnique({where: { title: this.data.title }})
        if(cateogry)
            return cateogry
        return false
    }
}

export const find_all_category = async function(pagination: IPagination){
    const category_request_enity = new CategoryRequestEnity(undefined, pagination)

    const missing_fields = await category_request_enity.verify_pagination()
    if(missing_fields.length)
        return new RejoinError({
            description: FIELD_REQUIRED[0],
            content: missing_fields,
            status: FIELD_REQUIRED[1],
            code: FIELD_REQUIRED[2]
        })

    const list = await prisma.category.findMany({ ...pagination })
    const count = await prisma.category.count()

    return new RejoinSuccess({
        content: {list, count},
        status: 200
    })
}

export const find_one_category = async function(id: number){
    const category_request_enity = new CategoryRequestEnity(id)

    const is_id: boolean = await category_request_enity.verify_id()
    if(!is_id)
        return new RejoinError({
            description: BAD_ID[0],
            status: BAD_ID[1],
            code: BAD_ID[2]
        })

    const category = await category_request_enity.verify_is_category_by_id()
    if(!category)
        return new RejoinError({
            description: NOT_FOUND_ITEM[0],
            content: category,
            status: NOT_FOUND_ITEM[1],
            code: NOT_FOUND_ITEM[2]
        })

    return new RejoinSuccess({
        content: category,
        status: 200
    })
}

export const create_category = async function(data: DataCategory ){
    const category_enity = new CategoryEnity(data)

    const missing_fields = category_enity.verify_fields()
    if(missing_fields.length)
        return new RejoinError({
            description: FIELD_REQUIRED[0],
            content: missing_fields,
            status: FIELD_REQUIRED[1],
            code: FIELD_REQUIRED[2]
        })

    const category = await category_enity.verify_is_category_by_title()
    if(category)
        return new RejoinError({
            description: ITEM_ALREADY_EXISTS[0],
            content: category,
            status: ITEM_ALREADY_EXISTS[1],
            code: ITEM_ALREADY_EXISTS[2]
        })
    
    const result = await prisma.category.create({ data: category_enity.data })

    return new RejoinSuccess({
        description: 'Категория создана.',
        content: result,
        status: 200
    })
}

export const change_category = async function(data: DataCategory, id: number ){
    const category_enity = new CategoryEnity(data)
    const category_request_enity = new CategoryRequestEnity(id)

    const is_id: boolean = await category_request_enity.verify_id()
    if(!is_id)
        return new RejoinError({
            description: BAD_ID[0],
            status: BAD_ID[1],
            code: BAD_ID[2]
        })

    const category = await category_request_enity.verify_is_category_by_id()
    if(!category)
        return new RejoinError({
            description: NOT_FOUND_ITEM[0],
            content: category,
            status: NOT_FOUND_ITEM[1],
            code: NOT_FOUND_ITEM[2]
        })
    
    const missing_fields = category_enity.verify_fields()
    if(missing_fields.length)
        return new RejoinError({
            description: FIELD_REQUIRED[0],
            content: missing_fields,
            status: FIELD_REQUIRED[1],
            code: FIELD_REQUIRED[2]
        })

    const result = await prisma.category.update({ data: category_enity.data, where: { id: category_request_enity.id } })

    return new RejoinSuccess({
        description: 'Категория изменена.',
        content: result,
        status: 200
    })
}
export const delete_category = async function(id: number ){
    const category_request_enity = new CategoryRequestEnity(id)

    const is_id: boolean = await category_request_enity.verify_id()
    if(!is_id)
        return new RejoinError({
            description: BAD_ID[0],
            status: BAD_ID[1],
            code: BAD_ID[2]
        })

    const category = await category_request_enity.verify_is_category_by_id()
    if(!category)
        return new RejoinError({
            description: NOT_FOUND_ITEM[0],
            content: category,
            status: NOT_FOUND_ITEM[1],
            code: NOT_FOUND_ITEM[2]
        })

    const result = await prisma.category.delete({ where: { id: category_request_enity.id } })

    return new RejoinSuccess({
        description: 'Категория удалена.',
        content: result,
        status: 200
    })
}