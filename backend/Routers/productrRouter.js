const express=require('express')
const router=express.Router();
const productController=require('../Controllers/productController')
const imageController=require('../Controllers/imageController');
const {auth}=require('../Middleware/auth')


router.post('/addproduct',auth,productController.addProduct);
router.put('/editProduct/:id',auth,productController.editProduct);
router.delete('/deleteproduct/:id',auth,productController.deleteProduct);

router.get('/published',auth,productController.getPublished);
router.get('/unpublished',auth,productController.getUnPublished);
router.get('/getallproduct',auth,productController.getAllProducts);

router.put('/toggle/:id',auth,productController.toggleProduct);

//imageDelete
router.delete("/deleteimg/:id",auth,imageController.deleteimg)

module.exports=router;