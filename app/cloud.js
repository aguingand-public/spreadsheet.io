var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var cloud;

cloud.prototype.getPath = function(fileId) {
    return 'cloud/'+fileId+'.json';
}

cloud.prototype.save = function(fileId, updateStack) {
    var filedata;
    var sheet;
    var filepath = this.getPath(fileId);
    fs.readFile(filepath,function(err, data) {
        filedata=JSON.parse(data);
        sheet=JSON.parse(data).sheet;
        for(var i=0;i<updateStack.length;i++) {
            var upd=updateStack[i];
            switch(updateStack[i].type) {
                case UpdateType.CELL_CHANGE:
            }
            /// Grow array if high pos
            if(upd.cell.x>sheet.length) {
                var int=upd.cell.x-(sheet.length-1);
                for(var j=0;j<int;j++)
                    sheet.push([]);
            }
            if(upd.cell.y>sheet[upd.cell.x].length)
            {
                var int=upd.cell.x-(sheet.length[upd.cell.x]-1);
                for(var j=0;j<int;j++)
                    sheet[upd.cell.x].push([]);
            }
            sheet[upd.cell.x][upd.cell.y] = upd.cell;
        }
        filedata.sheet = sheet;
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