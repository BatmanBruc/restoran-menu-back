interface IRejoin {
    description?: string
    content?: any
    status: number
}

interface IRejoinError extends IRejoin {
    status: ( 400 | 401 | 403 | 404 )
    code: number | string
}
interface IRejoinSuccess extends IRejoin {
    status: 200
}

export abstract class Rejoin{
    description?: string
    content?: any
    status: number
    constructor(data: IRejoin){
        this.description = data.description
        this.content = data.content
        this.status = data.status
    }
    get_status(){
        return this.status;
    }
    get(){
        return {
            description: this.description,
            content: this.content
        }
    }
}

export class RejoinError extends Rejoin{
    status: ( 400 | 401 | 403 | 404 ) = 400
    code: number | string
    constructor(data: IRejoinError){
        super(data)
        this.code = data.code
    }
    get(){
        return {
            ...super.get(),
            code: this.code
        }
    }
}
export class RejoinSuccess extends Rejoin{
    status: 200 = 200
    constructor(data: IRejoinSuccess){
        super(data)
    }
}