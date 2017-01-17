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
        if(upd.cell.row > sheet.length) {
            var int=upd.cell.row-(sheet.length-1);
            for(var j=0;j<int;j++)
                sheet.push([]);
        }
        if(upd.cell.col > sheet[upd.cell.row].length)
        {
            var int=upd.cell.x-(sheet.length[upd.cell.row]-1);
            for(var j=0;j<int;j++)
                sheet[upd.cell.row].push([]);
        }
        sheet[upd.cell.row][upd.cell.col] = upd.cell;
    }

    self.getSheet = function() {
        return sheet;
    } 
    return self;
};

module.exports = {UpdateType:UpdateType, UpdateOperation:UpdateOperation}