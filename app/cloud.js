var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var update = require('./update');
var UpdateType = update.UpdateType;

var cloud;

cloud.prototype.getPath = function(fileId) {
    return 'cloud/'+fileId+'.json';
}

cloud.prototype.save = function(fileId, updateStack) {
    var filedata;
    var filepath = this.getPath(fileId);
    fs.readFile(filepath,function(err, data) {
        filedata=JSON.parse(data);
        for(var i=0;i<updateStack.length;i++) {
            var upd=updateStack[i];
            switch(upd.type) {
                case UpdateType.CELL_CHANGE:
                    update.processCellChange(filedata);
                break;
                case UpdateType.ADD_ROW:
                case UpdateType.ADD_COL:
                case UpdateType.REMOVE_ROW:
                case UpdateType.REMOVE_COL:
                break;
            }
        }
        fs.writeFile(filepath, JSON.stringify(filedata), function(err) {
            if(err)
                console.log(err)
            else
                console.log('"'+filepath+'" saved!');
        });
    });
}

cloud.prototype.newFile = function(fileId, user) {
    var filepath = this.getPath(fileId);
    var dir=path.dirname(filepath);

    mkdirp.sync(dir, function(err) {
        if(err)
            console.log(err);
        else {
            console.log('"'+dir+'" directory created');
            fs.writeFile(filepath,JSON.stringify({
                username: user.username,
                sheet : []
            }),function(err) {
                if(err)
                    console.log(err);
                else
                    console.log('"'+filepath+'" created!');
            });
        }
    })
}

module.exports = cloud;