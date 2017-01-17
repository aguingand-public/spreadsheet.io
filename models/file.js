var db = require('../db');

exports.getOne = function(fileId,done) {
    db.query('SELECT * FROM files WHERE id=?',[fileId], function(err,rows) {
        if(err)
            console.log(err);
        done(rows[0]);
    });
}

exports.getAllByCreator = function(userName,done) {
    db.query('SELECT * FROM files WHERE creator=?',[userName], function(err,rows) {
        if(err)
            console.log(err);
        done(rows);
    });
}

exports.rename = function(fileId,newName,done) {
    db.query('UPDATE files SET name=? WHERE id=?',[newName,fileId], function(err,rows) {
        if(err)
            console.log(err);
        done(rows);
    });
}

exports.create = function(data,done) {
    db.query("INSERT INTO files (name, creator) values (?,?)",
                        [data.name,data.creator], function(err,rows) {
        if(err) {
            console.log(err);
        }   
        else {
            done(rows.insertId);
        }
    });
}