var database_user = {
    user: 'foo',
    password: 'foo',
    server: 'localhost',
    database: 'Proj',
    options: {
        trustServerCertificate: true
    }
}

async function get_userdata(user_id) {
    var user_pool = new mssql.ConnectionPool(config1)
    await user_pool.connect()
    var request = new mssql.Request(user_pool)
    var result = await request.query(`SELECT * FROM User WHERE ID=${user_id}`)
    await user_pool.close()
    data = []
    result.recordset.forEach(r => {
        data.append(r)
    })
}

async function get_productdata(product_id) {
    var user_pool = new mssql.ConnectionPool(config1)
    await user_pool.connect()
    var request = new mssql.Request(user_pool)
    var result = await request.query(`SELECT name FROM Product WHERE ID=${product_id}`)
    await user_pool.close()
    data = []
    result.recordset.forEach(r => {
        data.append(r)
    })
}

async function set_productdata(product) {
    var user_pool = new mssql.ConnectionPool(config1)
    await user_pool.connect()
    var request = new mssql.Request(user_pool)
    var result = await request.query(`INSERT INTO Product(NAME, PRICE) VALUES('${product.name}', ${product.price})`)
    await user_pool.close()
}

async function set_userdata(user) {
    var user_pool = new mssql.ConnectionPool(config1)
    await user_pool.connect()
    var request = new mssql.Request(user_pool)
    var result = await request.query(`INSERT INTO User(NAME, PSSWRD) VALUES('${user.name}', ${user.psswrd})`)
    await user_pool.close()
}

module.exports = get_productdata
module.exports = get_userdata
module.exports = set_productdata
module.exports = set_userdata

