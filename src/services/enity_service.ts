abstract class EnityRequest{
    constructor(public id?: number, public pagination?: IPagination){}
    verify_pagination(){
        if(!this.pagination)
            return []
        let missing_fields = []
        if(this.pagination.take && !(this.pagination.skip || this.pagination.skip == 0)){
            missing_fields.push('skip')
        }else if(!(this.pagination.take || this.pagination.take == 0) && this.pagination.skip){
            missing_fields.push('take')
        }
        return missing_fields
    }
    verify_id(){
        if(!this.id || typeof this.id != 'number')
            return false
        else
            return true
    }
}

type RequiredFields<TDataModel> = {
    [K in keyof TDataModel]: boolean
}

abstract class ModelEnity<TDataModel>{
    constructor(
        public data: TDataModel,
        public id?: number,
        public required_fields?: RequiredFields<TDataModel>
    ){
        this.data = Object.assign({}, data)
    }
    verify_fields(): string[]{
        let missing_fields = []
        for( let prop in this.required_fields){
            if(this.required_fields[prop]){
                if(!this.data[prop] && typeof this.data[prop] != 'boolean')
                    missing_fields.push(prop)
            }
        }
        return missing_fields
    }
} 

export type IPagination = {
    take: number;
    skip: number;
}

export {
    EnityRequest,
    ModelEnity,
}