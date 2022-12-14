import { PrismaClient } from "@prisma/client"
import { ModelEnity} from "./enity_service"
import { FIELD_REQUIRED } from "./errors_service"
import { RejoinError, RejoinSuccess } from "./rejoin_service"

const prisma = new PrismaClient()

type DataImage = {
    name?: string,
    src: string
}

class ImageEnity extends ModelEnity<DataImage>{
    required_fields = {
        src: true
    }
}

export const create_image = async function(image: any, name?: string ){
    const path = 'public/pics/' + image.name
    image.mv(path);
    const data = {
        src: image.name,
        name: name
    }
    const image_enity = new ImageEnity(data)
    const missing_fields = image_enity.verify_fields()
    if(missing_fields.length)
        return new RejoinError({
            description: FIELD_REQUIRED[0],
            content: missing_fields,
            status: FIELD_REQUIRED[1],
            code: FIELD_REQUIRED[2]
        })
    
    const result = await prisma.image.create({ data: image_enity.data })

    return new RejoinSuccess({
        content: result,
        status: 200
    })
}