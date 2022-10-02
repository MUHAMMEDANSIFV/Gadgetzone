const userHelper = require("../helpers/user-helper");
const fs = require("fs");
const catagertHelper = require("../helpers/catagery-helpers");
const productHelper = require("../helpers/product-helper");
const orderHelpers = require("../helpers/order-helpers");
const addressHelper = require("../helpers/address-helpers");
const couponHelper = require("../helpers/couponhelpers")
const {
  resolve
} = require("path");
const {
  rejects
} = require("assert");

module.exports = {
  Dashbord: async (req, res, next) => {
    try{
      res.render("admin/Dashbord");
    } catch(err) {
      console.log(err);
      next()
    }
  },
  addlproduct: async (req, res, next) => {
    try {
      const data = await catagertHelper.viewcatagery()
      req.session.catagery = data;
      res.render("admin/Product/addproduct", {
        data,
      });
    } catch (err) {
      console.log(err);
      next()
    }
  },
  productdetailes: async (req, res, next) => {
    try {
      const id = await productHelper.addproduct(req.body)
      let image1 = req.files.image1;
      let image2 = req.files.image2;
      let image3 = req.files.image3;
      let image4 = req.files.image4;
      let image5 = req.files.image5;
      let image6 = req.files.image6;
      console.log(req.body);
      folderpath = "./public/images/productimages/" + id;
      if (!fs.existsSync(folderpath)) {
        fs.mkdirSync(folderpath);
        image1.mv("./public/images/productimages/" + id + "/1.jpg");
        image2.mv("./public/images/productimages/" + id + "/2.jpg");
        image3.mv("./public/images/productimages/" + id + "/3.jpg");
        image4.mv("./public/images/productimages/" + id + "/4.jpg");
        image5.mv("./public/images/productimages/" + id + "/5.jpg");
        image6.mv("./public/images/productimages/" + id + "/6.jpg");
        res.redirect("back");
      }
    } catch (err) {
      console.log(err);
      next()
    }
  },
  viewproduct: async (req, res, next) => {
    try {
      const product = await productHelper.viewproduct()
      console.log(product);
      res.render("admin/Product/viewproduct", {
        product,
      });
    } catch (err) {
      console.log(err);
      next()
    }
  },
  editproduct: async (req, res, next) => {
    try {
      const data = await productHelper.findproduct(req.params.id)
      res.render("admin/Product/editproduct", {
        data,
      });
    } catch (err) {
      console.log(err);
      next()
    }
  },
  productdetails: async (req, res, next) => {
    try {
      const result = await productHelper.editproduct(req.params.id, req.body)
      if (result) {
        if (req.body.image == 1) {
          let productid = req.params.id;
          let image1 = req.files.image1;
          image1.mv("./public/images/productimages/" + productid + "/1.jpg");
          let image2 = req.files.image2;
          image2.mv("./public/images/productimages/" + productid + "/2.jpg");
          let image3 = req.files.image3;
          image3.mv("./public/images/productimages/" + productid + "/3.jpg");
          let image4 = req.files.image4;
          image4.mv("./public/images/productimages/" + productid + "/4.jpg");
          let image5 = req.files.image5;
          image5.mv("./public/images/productimages/" + productid + "/5.jpg");
          let image6 = req.files.image6;
          image6.mv("./public/images/productimages/" + productid + "/6.jpg");
        }
        res.redirect("/Dashbord/viewproduct");
      }
    } catch (err) {
      console.log(err);
      next()
    }
  },
  deleteproduct: async (req, res, next) => {
    try {
      const id = await productHelper.deleteproduct(req.params.id)
      var folderpath = "./public/images/productimages/" + id;
      fs.rmdir(
        folderpath, {
          recursive: true,
        },
        (err, done) => {
          if (err) console.log(err);
          else res.redirect("back");
        }
      );
    } catch (err) {
      console.log(err);
      next()
    }
  },
  users: async (req, res, next) => {
    try {
      await userHelper.allusres()
      console.log(users);
      res.render('admin/User/users', {
        users
      })
    } catch (err) {
      console.log(err);
      next()
    }
  },
  block: async (req, res, next) => {
    try {
      await userHelper.blockuser(req.params.id)
      res.redirect('back')
    } catch (err) {
      console.log(err);
      next()
    }
  },
  active: async (req, res, next) => {
    try {
      await userHelper.activeuser(req.params.id)
      res.redirect('back')
    } catch (err) {
      console.log(err);
      next()
    }
  },
  delete: async (req, res, next) => {
    try {
      await userHelper.deltetuser(req.params.id)
      if (req.session.userlogin == req.params.id) {
        res.redirect('/userlogout')
      }
      res.redirect('back')
    } catch (err) {
      console.log(err);
      next()
    }
  },
  viewcatagery: async (req, res, next) => {
    try {
      const data = await catagertHelper.viewcatagery()

      res.render('admin/Category/viewCategory', {
        data
      })
    } catch (err) {
      console.log(err);
      next()

    }
  },
  addcategary: (req, res) => {
    try {
      res.render('admin/Category/addCategory')
    } catch (err) {
      console.log(err);
      next()
    }
  },
  editcatagery: async (req, res, next) => {
    try {
      const data = await catagertHelper.findcatagery(req.params.id)
      res.render('admin/Category/editCategory', {
        data
      })
    } catch (err) {
      console.log(err);
      next()
    }
  },
  postaddcatagery: async (req, res, next) => {
    try {
      const done = await catagertHelper.addcatagery(req.body)
      if (done) {
        //req.session.existcatagery = false
        res.redirect('back')
      } else {
        req.session.existcatagery = true
        res.redirect('/Dashbord/addcatagery')
      }
    } catch (err) {
      console.log(err);
      next()
    }
  },
  posteditcatagery: async (req, res, next) => {
    try {
      catagertHelper.editcatagery(req.params.id, req.body)
      if (data) {
        res.redirect('/Dashbord/viewcatagery')
      } else {
        console.log('editing is failed');
      }
    } catch (err) {
      console.log(err);
      next()
    }
  },
  deletecatagery: async (req, res, next) => {
    try {
      const data = await catagertHelper.deletecatagery(req.params.id)
      if (data) {
        res.redirect('back')
      } else {
        console.log('catagery deleting is failed');
      }
    } catch (err) {
      console.log(err);
      next()
    }
  },
  orderlist: async (req, res, next) => {
    try {
      const data = await orderHelpers.viewordersadmin(req.params.id)
      res.render('admin/User/user-order-list', {
        data
      })
    } catch (err) {
      console.log(err);
      next()
    }
  },
  orderdetails: async (req, res, next) => {
    try {
      const orders = await orderHelpers.findeachproduct(req.body.userid, req.body.productid)
      const order = orders.products.find((item) => item._id == req.body.productid)
      const userid = orders.userid._id
      res.render('admin/User/user-order-details', {
        order,
        userid
      })
    } catch (err) {
      console.log(err);
      next()
    }
  },
  changestatus: async (req, res, next) => {
    try {
      const order = await orderHelpers.changestatus(req.body.orderid, req.body.changestatus)
      res.json(order)
    } catch (err) {
      console.log(err);
      next()
    }
  },
  orders: async (req, res, next) => {
    try {
      const order = await orderHelpers.orders()
      res.render('admin/order/orders', {
        order
      })
    } catch (err) {
      console.log(err);
      next(err)
    }
  },
  order: async (req, res, next) => {
    try {
      const order = await orderHelpers.order(req.params.orderid)
      res.render('admin/order/order', {
        order
      })
    } catch (err) {
      console.log(err);
      next()
    }
  },
  coupons: async (req, res, next) => {
    try {
      const coupons = await couponHelper.viewcoupons()
      res.render('admin/coupons/coupon', {
        coupons
      })
    } catch (err) {
      console.log(err);
      next()
    }
  },
  addcoupon: async (req, res, next) => {
    try {
      res.render('admin/coupons/addcoupon')
    } catch (err) {
      console.log(err);
      next()
    }
  },
  addcouponpost: async (req, res, next) => {
    try {
      const done = await couponHelper.addcoupon(req.body)
      res.redirect('/Dashbord/coupons')
    } catch (err) {
      console.log(err);
      next()
    }
  },
  deletecoupon: async (req, res, next) => {
    try {
      const done = await couponHelper.deletecoupon(req.body.couponid)
      res.json(done)
    } catch (err) {
      console.log(err);
      next()
    }
  }
};