module.export = function(data, sheet){
    var self;
    
    self.UpdateType ={
        NO_CHANGE:1,
        CELL_CHANGE:2,
        ADD_ROW:3,
        ADD_COL:4,
        REMOVE_ROW:5,
        REMOVE_COL:6
    };

    self.processAddCol = function(data, update) {
        var sheet=data.sheet;
    }
    self.processCellChange = function(data, update) { 
        var sheet=data.sheet;
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
    return self;
};