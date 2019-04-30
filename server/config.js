module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    URL: process.env.BASE_URL || 'http://localhost:5000',
    DB : {
        host: 'vrathoremysql.cpdhzb7tqdsn.us-west-1.rds.amazonaws.com',
        port: 3306,
        user: 'vrathoreMySQL',
        password: 'vrathoreMySQL',
        database: 'vrathoreMySQL'
    }
}