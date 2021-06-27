const sqlite3 = require('sqlite3').verbose()
let db

// 连接数据库
function conn () {
  if (!db || !db.open) {
    db = new sqlite3.Database('base.db')
  }
  return db
}

// 初始化数据表
export const initTable = () => {
  return new Promise((resolve) => {
    let db = conn()
    db.serialize(() => {
      db.run('CREATE TABLE if not exists GLOBAL_DATA ( type char(2), key varchar(100), value varchar(2000), description varchar(200))')
      //db.run('CREATE TABLE IF NOT EXISTS ProductTable (id int primary key, name varchar(64))')
      resolve()
    })
  })
}
export const fineAllGlobalDataByType = (type) => {
  return new Promise((resolve) => {
    debugger;
    let db = conn()
    let prepare = db.prepare('SELECT key, value, description FROM GLOBAL_DATA WHERE type=?')
    prepare.run(type)
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const saveGlobalData = (globalData) => {
  return new Promise((resolve) => {
    let db = conn()
    let prepare = db.prepare('REPLACE INTO GLOBAL_DATA (type, key, value, description) VALUES (?, ?, ?, ?)')
    prepare.run(globalData.type, globalData.key, globalData.value, globalData.description)
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const deleteAllGlobalData = () => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all('DELETE FROM GLOBAL_DATA', (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

export const queryAllTree = () => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all('select id, name, fatherId from TreeTable order by fatherId', (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

export const queryAllProduct = () => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all('select id, name from ProductTable', (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

export const insertProduct = (product) => {
  return new Promise((resolve) => {
    let db = conn()
    let prepare = db.prepare('replace into ProductTable (id, name) values (?, ?)')
    prepare.run(product.id, product.name)
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}