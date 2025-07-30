const mongoose = require('mongoose')

const connectDatabase = () => {
    mongoose.connect(process.env.MONGODB_LOCAL).then(() => {
        console.log('Database Connected!')
    }).catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    })
}

//Exporting
module.exports = connectDatabase