
import Constants from "@/constants";
const sqlite3 = require('sqlite3').verbose()
let db
function conn() {
  if (!db || !db.open) {
    db = new sqlite3.Database('base.db')
  }
  return db
}

export default {

  initTable() {
    return new Promise((resolve) => {
      let db = conn()
      db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS GLOBAL_DATA (id INTEGER PRIMARY KEY AUTOINCREMENT, type CHAR(2), key VARCHAR(100), value VARCHAR(2000), description VARCHAR(200))');
        db.run('CREATE TABLE IF NOT EXISTS REQUEST (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100), method VARCHAR(10), url VARCHAR(2000))');
        db.run('CREATE TABLE IF NOT EXISTS REQUEST_DATA (id INTEGER PRIMARY KEY AUTOINCREMENT, requestId INTEGER, type CHAR(2), key VARCHAR(100), value VARCHAR(2000), description VARCHAR(200))');
        db.run('CREATE TABLE IF NOT EXISTS REQUEST_HISTORY (id INTEGER PRIMARY KEY AUTOINCREMENT, method VARCHAR(10), url VARCHAR(2000), requestParameter VARCHAR(2000), requestHeader VARCHAR(2000), requestBody VARCHAR(2000), requestDtti TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)');
        
        resolve()
      })
    })
  },

  /*===================REQUEST====================*/
  findAllRequestById(id) {
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
  },

  saveRequest(request) {
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
  },

  saveRequestWithId(request) {
    return new Promise((resolve) => {
      let db = conn()
      // INSERT
      let prepare = db.prepare('REPLACE INTO REQUEST (id, name, method, url) VALUES (?, ?, ?, ?)')
      prepare.run(request.id, request.name, request.method, request.url, function(err) {
        if (!err) resolve(this.lastID)
      })
    })
  },

  deleteRequestById(id) {
    return new Promise((resolve, reject) => {
      let db = conn()
      var sql  = "DELETE FROM REQUEST WHERE id=" + id;
      db.all(sql, (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows || [])
      })
    })
  },

  deleteAllRequest() {
    return new Promise((resolve, reject) => {
      let db = conn()
      var sql  = "DELETE FROM REQUEST";
      db.all(sql, (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows || [])
      })
    })
  },
  
  duplicateRequestById(id) {
    return new Promise((resolve, reject) => {
      let db = conn()
      var sql  = "INSERT INTO REQUEST(name, method, url) SELECT  name || \"_복사본\", method, url FROM REQUEST WHERE id=?";
      let prepare = db.prepare(sql)
      prepare.run(id, function(err) {
        if (!err) resolve(this.lastID)
        reject(err)
      })
    })
  },

  /*===================REQUEST DATA====================*/
  findAllRequestDataByRequestId(requestId) {
    return new Promise((resolve, reject) => {
      let db = conn()
      var sql  = "SELECT requestId, type, key, value, description FROM REQUEST_DATA";
      if (requestId) {
        sql += " WHERE requestId=" + requestId;
      }

      db.all(sql, (err, rows) => {
        if (err) {
          reject(err)
        }
        var result = {
          parameter: [],
          header: [],
          body: []
        };
        if (requestId) {
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
  },

  saveRequestData(requestData) {
    return new Promise((resolve) => {
      let db = conn()
      let prepare = db.prepare('INSERT INTO REQUEST_DATA (type, requestId, key, value, description) VALUES (?, ?, ?, ?, ?)')
      prepare.run(requestData.type, requestData.requestId, requestData.key, requestData.value, requestData.description)
      prepare.finalize(err => { 
        if (!err) resolve()
      })
    })
  },

  deleteAllRequestDataByRequestId(requestId) {
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
  },

  duplicateRequestDataById(newRequestId, oldRequestId) {   // 새로운 request id, 복사할 request id
    return new Promise((resolve, reject) => {
      let db = conn()
      var sql  = "INSERT INTO REQUEST_DATA(requestId, type, key, value, description) SELECT ?, type, key, value, description FROM REQUEST_DATA WHERE requestId=?";
      let prepare = db.prepare(sql)
      prepare.run(newRequestId,oldRequestId, function(err) {
        if (!err) resolve(this.lastID)
        reject(err)
      })
    })
  },


  deleteAllRequestData() {
    return new Promise((resolve, reject) => {
      let db = conn()
      var sql  = "DELETE FROM REQUEST_DATA";
      db.all(sql, (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows || [])
      })
    })
  },
  /*===================REQUEST HISTORY====================*/
  findAllRequestHistoryById(id) {
    return new Promise((resolve, reject) => {
      let db = conn()
      var sql  = "SELECT id, method, url, requestParameter, requestHeader, requestBody, requestDtti, strftime('%Y-%m-%d', requestDtti) AS requestDate FROM REQUEST_HISTORY"
      if (id) {
        sql += " WHERE id=" + id;
      }
      sql += " ORDER BY requestDtti DESC";

      db.all(sql, (err, rows) => {
        if (err) {
          reject(err)
        }
          resolve(rows || [])
      })
    })
  },

  saveRequestHistory(history) {
    return new Promise((resolve) => {
      let db = conn()
        // UPDATE
        let prepare = db.prepare('REPLACE INTO REQUEST_HISTORY (method, url, requestParameter, requestHeader, requestBody) VALUES (?, ?, ?, ?, ?)')
        prepare.run(history.method, history.url, history.params, history.headers, history.data, function(err) {
          if (!err) resolve()
        })
    })
  },

  deleteRequestHistoryById(id) {
    return new Promise((resolve, reject) => {
      let db = conn()
      var sql  = "DELETE FROM REQUEST_HISTORY WHERE id=" + id;
      db.all(sql, (err, rows) => {
        if (err) {
          reject(err)
        }
          resolve(rows || [])
      })
    })
  },


  /*===================GLOBAL DATA====================*/
  findAllGlobalData()  {
    return new Promise((resolve, reject) => {
      let db = conn()
      var sql  = "SELECT type, key, value, description FROM GLOBAL_DATA"
      db.all(sql, (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows || [])
      })
    })
  },

  findAllGlobalDataByType(type)  {
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
  },

  saveGlobalData(globalData) {
    return new Promise((resolve) => {
      let db = conn()
      let prepare = db.prepare('INSERT INTO GLOBAL_DATA (type, key, value, description) VALUES (?, ?, ?, ?)')
      prepare.run(globalData.type, globalData.key, globalData.value, globalData.description)
      prepare.finalize(err => { 
        if (!err) resolve()
      })
    })
  },

  deleteAllGlobalData () {
    return new Promise((resolve, reject) => {
      let db = conn()
      db.all('DELETE FROM GLOBAL_DATA', (err, rows) => {
        if (err) reject(err)
        resolve(rows || [])
      })
    })
  }
}
