const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
var url_link = process.env.URL

const state = {
    db: null
}

module.exports.connect =  (done) => {
    const dbname = 'ecommerce'

    mongoose.connect(url_link, (err, data) => {
        if (err)   return done(err)
        state.db = dbname
        done();
    })
}

module.exports.get = function () {
    return state.db
}