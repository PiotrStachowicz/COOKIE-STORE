const mssql = require('mssql')

var database_user = {
    user: 'foo',
    password: 'foo',
    server: 'localhost',
    database: 'Proj',
    options: {
        trustServerCertificate: true
    }
}

async function get_userdata(column, user_desc, data='*') {
    var user_pool = new mssql.ConnectionPool(database_user)
    await user_pool.connect()
    var request = new mssql.Request(user_pool)
    var result = await request.query(`SELECT ${data} FROM USERDATA WHERE ${column}='${user_desc}'`)
    await user_pool.close()
    data = []
    result.recordset.forEach(r => {
        data.push(r)
    })
    return data
}


async function get_productdata(product_id) {
    var user_pool = new mssql.ConnectionPool(database_user)
    await user_pool.connect()
    var request = new mssql.Request(user_pool)
    var result = await request.query(`SELECT name FROM PRODUCTDATA WHERE ID=${product_id}`)
    await user_pool.close()
    data = []
    result.recordset.forEach(r => {
        data.push(r)
    })
    return data
}

async function set_productdata(product) {
    var user_pool = new mssql.ConnectionPool(database_user)
    await user_pool.connect()
    var request = new mssql.Request(user_pool)
    await request.query(`INSERT INTO PRODUCTDATA(NAME, PRICE) VALUES('${product.name}', ${product.price})`)
    await user_pool.close()
}

async function set_userdata(user) {
    var user_pool = new mssql.ConnectionPool(database_user)
    await user_pool.connect()
    var request = new mssql.Request(user_pool)
    await request.query(`INSERT INTO USERDATA(NAME, PSSWRD) VALUES('${user.name}', '${user.psswrd}')`)
    await user_pool.close()
}

module.exports = {
    get_productdata: get_productdata,
    get_userdata: get_userdata,
    set_productdata: set_productdata,
    set_userdata: set_userdata
  };

