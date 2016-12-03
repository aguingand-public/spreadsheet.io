var db = require('../db');

exports.getOne = function(userName, fileId) {
    db.query('SELECT * FROM files WHERE creator=? AND id=?',[userName,fileId], function(err,rows) {
        if(err)
            console.log(err);
        done(rows);
    });
}

exports.getAll = function(userName,done) {
    db.query('SELECT * FROM files WHERE creator=?',[userName], function(err,rows) {
        if(err)
            console.log(err);
        console.log('FILE.GETALL : ');
        done(rows);
    });
}

exports.post = function(data,done) {
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