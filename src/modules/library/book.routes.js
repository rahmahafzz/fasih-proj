import express from "express";
import * as controller from "./book.cotroller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import {uploadBook } from "../../middlewares/uploadFile.js";


const router = express.Router();



router.get('/',  controller.getBooksController);
router.get('/search',controller.searchBooksController);
router.get('/:id',controller.getBookController);
router.get('/:id/download',  controller.downloadBookController);
router.post('/', authorize('admin', 'vendor'),controller.createBookController);
router.post('/upload',authorize('admin'),uploadBook.single('bookFile'),controller.createBookController);

export default router;



  // {
  // "userId": "687bf0b7dd73b0c9a3c1f1b3",
  // "title": "كتاب القواعد",
  // "author": "محمود النجار",
  // "category": "64f8ac65d9c9d2a1d8a1a5b3",
  // "description": "شرح مفصل لقواعد اللغة العربية.",
  // "coverImage": "https://example.com/cover.jpg",
  // "fileUrl": "https://example.com/book.pdf",
  // "pages": 120


  // }

  // http://localhost:5000/api/v1/books/search?keyword=القواعد


//   {
// "title": "كتاب القواعد",
//   "author": "محمود النجار",
//   "category": "688ba86c363df2a463cacc8d",
//   "description": "شرح مفصل لقواعد اللغة العربية.",
//   "coverImage":"https://www.google.com/imgres?q=%D8%A7%D9%84%D9%86%D8%AD%D9%88%20%D9%88%D8%A7%D9%84%D8%B5%D8%B1%D9%81%20pdf&imgurl=https%3A%2F%2Fwww.alarabimag.com%2Fimages%2Fthumbs%2F27105.jpg&imgrefurl=https%3A%2F%2Fwww.alarabimag.com%2Fbooks%2F27105-%25D8%25A7%25D9%2584%25D9%2586%25D8%25AD%25D9%2588-%25D9%2588%25D8%25A7%25D9%2584%25D8%25B5%25D8%25B1%25D9%2581.html&docid=m8oQlWbQE0__wM&tbnid=DrE7usogaTuXEM&vet=12ahUKEwi32MvnouiOAxXW3gIHHbIJH1UQM3oECBIQAA..i&w=650&h=968&hcb=2&ved=2ahUKEwi32MvnouiOAxXW3gIHHbIJH1UQM3oECBIQAA",
//   "fileUrl":"noor-book.com/tus7zm"

// }
