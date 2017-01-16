var UpdateType = {
    NO_CHANGE:1,
    CELL_CHANGE:2,
    ADD_ROW:3,
    ADD_COL:4,
    REMOVE_ROW:5,
    REMOVE_COL:6
};
var UpdateOperation = function(data){
    var self = {};
    var sheet = data.sheet;

    self.processAddCol = function(upd) {
    }
    /*
    Update object (upd):
        cell {
            x, //col 
            y // row
        }
    */
    self.processCellChange = function(upd) { 
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

    self.getSheet = function() {
        return sheet;
    } 
    return self;
};

module.exports = {UpdateType:UpdateType, UpdateOperation:UpdateOperation}