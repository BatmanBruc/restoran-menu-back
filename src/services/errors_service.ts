type ITypeError = [ string, ( 400 | 401 | 403 | 404 ), string | number ]



export const FIELD_REQUIRED: ITypeError = ['Не заполнены необходимые поле:', 400, 0]
export const NOT_FOUND_ITEM: ITypeError = ['ПОзиция не найдена:', 400, 1]
export const BAD_ID: ITypeError = ['Некорректный id', 400, 2]
export const ITEM_ALREADY_EXISTS: ITypeError = ['Такая позиция уже существует:', 400, 3]

export const USER_ALREADY_EXISTS: ITypeError = ['Пользователь с таким никнеймом уже существует:', 400, 'auth_0']
export const NOT_FOUND_NICKENAME: ITypeError = ['Не найден никнейм', 400, 'auth_1']
export const BAD_PASSWORD: ITypeError = ['Неправильный пароль', 400, 'auth_2']
export const BAD_TOKEN: ITypeError = ['Неверый токен', 400, 'auth_3']

export const NOT_FOUND_CATEGORY: ITypeError = ['Категория не найдена:', 400, 'prod_0']


export const EMPTY_IMAGE: ITypeError = ['Empty image:', 400, 'img_0']