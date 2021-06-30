
import Constants from "@/constants";

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
      db.run('CREATE TABLE IF NOT EXISTS GLOBAL_DATA (id INTEGER PRIMARY KEY AUTOINCREMENT, type CHAR(2), key VARCHAR(100), value VARCHAR(2000), description VARCHAR(200))');
      db.run('CREATE TABLE IF NOT EXISTS REQUEST (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100), method VARCHAR(10), url VARCHAR(2000))');
      db.run('CREATE TABLE IF NOT EXISTS REQUEST_DATA (id INTEGER PRIMARY KEY AUTOINCREMENT, requestId INTEGER, type CHAR(2), key VARCHAR(100), value VARCHAR(2000), description VARCHAR(200))');
      
      resolve()
    })
  })
}

export const saveRequest = (request) => {
  return new Promise((resolve) => {
    let db = conn()
    if (request.id) {
      // UPDATE
      let prepare = db.prepare('UPDATE REQUEST SET name=?, method=?, url=? WHERE id=?')
      prepare.run(request.name, request.method, request.url, request.id, function(err) {
        if (!err) resolve(request.id)
      })
    }
    else {
      // INSERT
      let prepare = db.prepare('REPLACE INTO REQUEST (name, method, url) VALUES (?, ?, ?)')
      prepare.run(request.name, request.method, request.url, function(err) {
        if (!err) resolve(this.lastID)
      })
    }
  })
}

export const saveRequestData = (requestData) => {
  return new Promise((resolve) => {
    let db = conn()
    let prepare = db.prepare('INSERT INTO REQUEST_DATA (type, requestId, key, value, description) VALUES (?, ?, ?, ?, ?)')
    prepare.run(requestData.type, requestData.id, requestData.key, requestData.value, requestData.description)
    prepare.finalize(err => { 
      if (!err) resolve()
    })
  })
}


export const fineAllRequestById = (id) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    var sql  = "SELECT id, name, method, url FROM REQUEST"
    if (id) {
      sql += " WHERE id=" + id;
    }
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err)
      }
        resolve(rows || [])
    })
  })
}

export const fineAllRequestDataByRequestId = (requestId) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    var sql  = "SELECT type, key, value, description FROM REQUEST_DATA WHERE requestId=" + requestId;

    db.all(sql, (err, rows) => {
      if (err) {
        reject(err)
      }
      var result = {
        parameter: [],
        header: [],
        body: []
      };
      for (var i in rows) {
        let row = rows[i];
        switch (row.type) {
          case Constants.DATA_TYPE.PARAMETER:
            result.parameter.push(row);
            break;
          case Constants.DATA_TYPE.HEADER:
            result.header.push(row);
            break;
          case Constants.DATA_TYPE.BODY:
            result.body.push(row);
            break;
        }
      }
      resolve(result || [])
    })
  })
}

export const fineAllGlobalDataByType = (type) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    var sql  = "SELECT type, key, value, description FROM GLOBAL_DATA"
    if (type) {
      sql += " WHERE type='" + type + "'";
    }
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err)
      }

      if (!type) {
        var result = {
          parameter: [],
          header: [],
          body: []
        };
        for (var i in rows) {
          let row = rows[i];
          switch (row.type) {
            case Constants.DATA_TYPE.PARAMETER:
              result.parameter.push(row);
              break;
            case Constants.DATA_TYPE.HEADER:
              result.header.push(row);
              break;
            case Constants.DATA_TYPE.BODY:
              result.body.push(row);
              break;
          }
        }
        resolve(result || [])
      }
      else {
        resolve(rows || [])
      }

    })
  })
}

export const saveGlobalData = (globalData) => {
  return new Promise((resolve) => {
    let db = conn()
    let prepare = db.prepare('INSERT INTO GLOBAL_DATA (type, key, value, description) VALUES (?, ?, ?, ?)')
    prepare.run(globalData.type, globalData.key, globalData.value, globalData.description)
    prepare.finalize(err => { 
      if (!err) resolve()
    })
  })
}

export const deleteAllRequestDataByRequestId = (requestId) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    let sql = 'DELETE FROM REQUEST_DATA';
    if (requestId) {
      sql += ' WHERE requestid='+requestId;
    }
    db.all(sql, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
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