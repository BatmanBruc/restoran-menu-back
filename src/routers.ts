import { Router } from 'express';
import { check_token_auth } from './middlewares';
import { auth_sign_up, auth_sign_in } from './controllers/auth_controller';
import { get_all_category, get_one_category, add_category, edit_category, remove_category } from './controllers/category_controller';
import { get_all_products, get_one_product, add_product, edit_product, remove_product, upload_photo } from './controllers/product_controller';

const router = Router();

router.post('/user/signup', auth_sign_up);
router.post('/user/signin', auth_sign_in);

router.post('/categories', check_token_auth, get_all_category);
router.get('/category/:id', check_token_auth, get_one_category);
router.post('/category', check_token_auth, add_category);
router.post('/category/:id', check_token_auth, edit_category);
router.delete('/category/:id', check_token_auth, remove_category);

router.post('/products', check_token_auth, get_all_products);
router.get('/product/:id', check_token_auth, get_one_product);
router.post('/product', check_token_auth, add_product);
router.post('/product/:id', check_token_auth, edit_product);
router.delete('/product/:id', check_token_auth, remove_product);
router.post('/upload_image', check_token_auth, upload_photo);
export default router;