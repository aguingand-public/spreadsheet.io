var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var update = require('./update');
var UpdateType = update.UpdateType;


module.exports = {
    getPath : function(fileId) {
        return 'cloud/'+fileId+'.json';
    },
    save : function(fileId, updateStack) {
        // chemin du fichier
        var filepath = this.getPath(fileId);
        
        fs.readFile(filepath,function(err, data) {
            filedata=JSON.parse(data);
            var updOps = update.UpdateOperation(filedata);

            for(var i=0;i<updateStack.length;i++) {
                var upd=updateStack[i];
                switch(upd.type) {
                    case UpdateType.CELL_CHANGE:
                        updOps.processCellChange(upd);
                    break;
                    case UpdateType.ADD_ROW:
                    case UpdateType.ADD_COL:
                    case UpdateType.REMOVE_ROW:
                    case UpdateType.REMOVE_COL:
                    break;
                }
            }
            filedata.sheet = updOps.getSheet();
            fs.writeFile(filepath, JSON.stringify(filedata), function(err) {
                if(err)
                    console.log(err)
                else
                    console.log('"'+filepath+'" saved!');
            });
        });
    },
    createFile : function(fileId, user) {
        var filepath = this.getPath(fileId);
        var dir=path.dirname(filepath);

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
}