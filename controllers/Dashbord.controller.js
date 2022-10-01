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
  Dashbord: (req, res, next) => {
    res.render("admin/Dashbord");
  },
  addlproduct: (req, res, next) => {
    catagertHelper.viewcatagery().then((data) => {
      console.log(data);
      req.session.catagery = data;
      res.render("admin/Product/addproduct", {
        data,
      });
    });
  },
  productdetailes: (req, res) => {
    productHelper.addproduct(req.body).then((id) => {
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
    });
  },
  viewproduct: (req, res, next) => {
    productHelper.viewproduct().then((product) => {
      console.log(product);
      res.render("admin/Product/viewproduct", {
        product,
      });
    });
  },
  editproduct: (req, res, next) => {
    productHelper.findproduct(req.params.id).then((data) => {
      console.log(data);
      res.render("admin/Product/editproduct", {
        data,
      });
    });
  },
  productdetails: (req, res) => {
    console.log("halooooo");
    productHelper.editproduct(req.params.id, req.body).then((result) => {
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
    });
  },
  deleteproduct: (req, res) => {
    productHelper.deleteproduct(req.params.id).then((id) => {
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
    });
  },
  users: (req, res, next) => {
    userHelper.allusres().then((users) => {
      console.log(users);
      res.render('admin/User/users', {
        users
      })
    })
  },
  block: (req, res) => {
    userHelper.blockuser(req.params.id).then((data) => {
      res.redirect('back')
    })
  },
  active: (req, res) => {
    userHelper.activeuser(req.params.id).then((data) => {
      res.redirect('back')
    })
  },
  delete: (req, res) => {
    userHelper.deltetuser(req.params.id).then((result) => {
      if (req.session.userlogin == req.params.id) {
        res.redirect('/userlogout')
      }
      res.redirect('back')
    })
  },
  viewcatagery: (req, res) => {
    catagertHelper.viewcatagery().then((data) => {

      res.render('admin/Category/viewCategory', {
        data
      })
    })
  },
  addcategary: (req, res) => {
    res.render('admin/Category/addCategory')
  },
  editcatagery: (req, res) => {
    catagertHelper.findcatagery(req.params.id).then((data) => {
      res.render('admin/Category/editCategory', {
        data
      })
    })
  },
  postaddcatagery: (req, res) => {
    catagertHelper.addcatagery(req.body).then((done) => {
      if (done) {
        //req.session.existcatagery = false
        res.redirect('back')
      } else {
        req.session.existcatagery = true
        res.redirect('/Dashbord/addcatagery')
      }
    })
  },
  posteditcatagery: (req, res) => {
    catagertHelper.editcatagery(req.params.id, req.body).then((data) => {
      if (data) {
        res.redirect('/Dashbord/viewcatagery')
      } else {
        console.log('editing is failed');
      }
    })
  },
  deletecatagery: (req, res) => {
    catagertHelper.deletecatagery(req.params.id).then((data) => {
      if (data) {
        res.redirect('back')
      } else {
        console.log('catagery deleting is failed');
      }
    })
  },
  orderlist: (req, res) => {
    orderHelpers.viewordersadmin(req.params.id).then((data) => {
      res.render('admin/User/user-order-list', {
        data
      })
    }).catch((error) => {
      console.log(error + '\n find a error in Dashbord controller ');
    })
  },
  orderdetails: (req, res) => {
    orderHelpers.findeachproduct(req.body.userid, req.body.productid).then((orders) => {
      const order = orders.products.find((item) => item._id == req.body.productid)
      const userid = orders.userid._id
      res.render('admin/User/user-order-details', {
        order,
        userid
      })
    }).catch((error) => {
      console.log(error + 'find a error in Dashbord controller');
    })
  },
  changestatus: (req, res) => {
    console.log(req.body);
    orderHelpers.changestatus(req.body.orderid, req.body.changestatus).then((order) => {
      res.json(order)
    }).catch((error) => {
      console.log(error);
    })
  },
  orders: (req, res) => {
    orderHelpers.orders().then((order) => {
      console.log(order);
      res.render('admin/order/orders', {
        order
      })
    }).catch((err) => {
      console.log(err);
    })
  },
  order: (req, res) => {
    orderHelpers.order(req.params.orderid).then((order) => {
      res.render('admin/order/order', {
        order
      })
    }).catch((err) => {
      console.log(err);
    })
  },
  coupons: (req, res) => {
    couponHelper.viewcoupons().then((coupons) => {
      console.log(coupons)
      res.render('admin/coupons/coupon',{coupons})
    })
  },
  addcoupon: (req, res) => {
    res.render('admin/coupons/addcoupon')
  },
  addcouponpost: (req, res) => {
    couponHelper.addcoupon(req.body).then((done) => {
      res.redirect('/Dashbord/coupons')
    })
  },
  deletecoupon:(req,res) => {
    console.log(req.body);
    couponHelper.deletecoupon(req.body.couponid).then((done) => {
      res.json(done)
    }).catch((err) => {
      console.log(err);
    })
  }
};