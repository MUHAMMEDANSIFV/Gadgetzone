const Razorpay = require('razorpay');
var instance = new Razorpay({
    key_id: 'rzp_test_g6NbSW53elwvsD',
    key_secret: 'UtMmNUd0xJxHejwD2BNa3MWH',
});
const db = require('../config/conection')
const user_collection = require('../models/Users')
const ordermodal = require('../models/order')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const {
    UserBindingContext
} = require('twilio/lib/rest/chat/v2/service/user/userBinding')
const {
    ObjectID
} = require('bson')
const crypto = require('node:crypto');
const {
    resolve
} = require('node:path');
const {
    error
} = require('node:console');

const Users = mongoose.model(user_collection.USER_COLLECTION, user_collection.USER_SCHEMA)
const Orders = mongoose.model(ordermodal.ORDER_COLLECTION, ordermodal.ORDER_SCHEMA)

module.exports = {

    adduser: (user) => {
        return new Promise((resolve, reject) => {
            var user1 = new Users(user);
            user1.save().then((data) => {
                console.log(data);
                resolve(data)
            })
        })
    },
    loginuser: (data) => {
        return new Promise(async (resolve, reject) => {
            const user = await Users.findOne({
                mobile: data.mobile
            })
            if (user) {
                if (user.mobile == data.mobile && user.password == data.password) {
                    resolve(user)
                } else {
                    resolve(false)
                }
            } else {
                resolve(false)
            }
        })
    },
    allusres: () => {
        return new Promise(async (resolve, reject) => {
            const users = await Users.find({})
            resolve(users)
        })
    },
    deltetuser: (id) => {
        return new Promise(async (resolve, reject) => {
            const user = await Users.findById(id)
            user.remove()
            resolve(true)
        })
    },
    activeuser: (id) => {
        return new Promise((resolve, reject) => {
            Users.updateOne({
                _id: ObjectID(id)
            }, {
                button: true
            }).then((done) => {
                resolve(done)
            })
        })
    },
    blockuser: (id) => {
        return new Promise((resolve, reject) => {
            Users.updateOne({
                _id: ObjectID(id)
            }, {
                button: false
            }).then((done) => {
                resolve(done)
            })
        })
    },
    existmobile: (mobile) => {
        return new Promise((resolve, reject) => {
            Users.findOne({
                mobile: mobile
            }).then((data) => {
                if (data) {
                    resolve(data)
                } else {
                    resolve(false)
                }
            })
        })
    },
    existemail: (email) => {
        return new Promise((resolve, reject) => {
            Users.findOne({
                email: email
            }).then((data) => {
                if (data) {
                    resolve(data)
                } else {
                    resolve(false)
                }
            })
        })
    },
    statustrue: (mobile) => {
        return new Promise((resolve, reject) => {
            Users.updateOne({
                mobile: mobile
            }, {
                $set: {
                    status: 'true'
                }
            }).then((data) => {
                resolve(data)
            })
        })
    },
    finduser: (id) => {
        return new Promise((resolve, reject) => {
            Users.findOne({
                _id: id
            }).populate('addresses').then((user) => {
                resolve(user)
            }).catch((error) => {
                console.log(error + '\n A error find user helpers find user');
            })
        })
    },
    userprofileedit: (keyword, value, userid) => {
        return new Promise((resolve, reject) => {
            if (keyword == 'lastname') {
                const result = editlastname(value, userid)
                if (result == 'error') reject()
                resolve(result)
            } else if (keyword == 'mobile') {
                const result = editmobile(value, userid)
                if (result == 'error') reject()
                resolve(result)
            } else if (keyword == 'email') {
                const result = editemail(value, userid)
                if (result == 'error') reject()
                resolve(result)
            }
        })
    },
    creatrazorpay: (orderid, total) => {
        return new Promise((resolve, reject) => {
            var options = {
                amount: parseInt(total)*100, // amount in the smallest currency unit
                currency: "INR",
                receipt: '' + orderid
            };
            instance.orders.create(options).then((order) => {
                resolve(order)
            }).catch((err) => {
                console.log(err);
            })

        })
    },
    verifypayment: (id, details) => {
        console.log(details);
        return new Promise(async (resolve, reject) => {
            const secret = 'UtMmNUd0xJxHejwD2BNa3MWH'
            const hash = crypto.createHmac('sha256', secret)
                .update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
                .digest('hex');

            if (hash == details['payment[razorpay_signature]']) {
                Orders.findByIdAndUpdate(details['order[receipt]'], {
                    $set: {
                        orderstatus: 'Complited',
                        trackingstatus: 'Order Confirmed',
                        paymentstatus: 'Paid',
                        paidamount:details['order[amount_due]']
                    }
                }).then((done) => {
                    resolve(done)
                }).catch((err) => {
                    reject(err)
                })
            } else {
                Orders.findByIdAndUpdate(details['order[receipt]'], {
                    $set: {
                        orderstatus: 'Failed',
                        trackingstatus: 'Payment Failed Please try again',
                        paymentstatus: 'Payment Failed'
                    }
                }).then((done) => {
                    resolve({status:false})
                }).catch((err) => {
                    reject(err)
                })
            }
        })
    },
    passwordchecking: (id, password) => {
        return new Promise((resolve, reject) => {
            Users.findOne({
                _id: id
            }).then((user) => {
                if (user.password == password) {
                    resolve({
                        status: true
                    })
                }
                resolve({
                    status: false
                })
            })
        })
    },
    passwordchanging: (userid, data) => {
        return new Promise((resolve, reject) => {
            Users.updateOne({
                _id: userid
            }, {
                $set: {
                    password: data.newpassword
                }
            }).then((done) => {
                resolve(done)
            }).catch((error) => {
                console.log(error);
            })
        })
    }
}

function editlastname(value, userid) {
    Users.findByIdAndUpdate(userid, {
        $set: {
            lastname: value
        }
    }).then((done) => {
        return done;
    }).catch((error) => {
        console.log(error + '\n a erro find user profile editing lastname')
        return 'error'
    })
}

function editmobile(value, userid) {
    Users.findByIdAndUpdate(userid, {
        $set: {
            mobile: value
        }
    }).then((done) => {
        console.log(done)
        return done
    }).catch((error) => {
        console.log(error + '\n a erro find user profile editing mobile')
        return 'error'
    })
}

function editemail(value, userid) {
    Users.findByIdAndUpdate(userid, {
        $set: {
            email: value
        }
    }).then((done) => {
        console.log(done)
        return done
    }).catch((error) => {
        console.log(error + '\n a erro find user profile editing email')
        return 'error'
    })
}