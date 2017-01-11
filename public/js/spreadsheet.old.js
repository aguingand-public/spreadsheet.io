angular.module('spreadsheet',[])
.controller('SheetController',['$http','$log','cellops',function($http,$log,cellops) {
                            // Dépendances

    // Variable accessible dans la vue
    var data = {
        sheet : [],
        toggle : false,
        mouse : {
            press:false,
            select:false
        }
    }

    data.sheet = new Array(20);
    for(var i=0;i<data.sheet.length;i++)
        data.sheet[i]=new Array(20);

    var selection = {unset:true}

    console.log(window.location.href);

    // ----- Socket io ------- //
    var socket = io.connect(socketUrl);
    //socket.on('connect')

    // ---- Importation du fichier CSV ----
    /*$http.get(file).then(function(res) {
        var csv=res.data;
        $log.log(csv);
        Papa.parse(csv, {
            complete: function(results) {
                var json=results.data;
                $log.log(json);

                data.sheet=json;

                for(var row=0;row<json.length;row++) {
                    for(var col=0;col<json[0].length;col++) {
                        data.sheet[row][col]= {
                            value:json[row][col],
                            row:row, col:col,
                            x:col, y:row
                        }
                    }
                }
                $log.log(data.sheet);
            }
        });
    });*/
    // --------------------------------------

    function cellClick($event,cell) {
        cellops.updateCurCell(angular.element($event.currentTarget));
        resetSelection();
        selection.ix=cell.x;
        selection.iy=cell.y;
    }

    function resetSelection() {
        if(selection.unset)return;
        for(var x=selection.minx;x<=selection.maxx;x++) {
            for(var y=selection.miny;y<=selection.maxy;y++) {
                data.sheet[y][x].selected=false;
            }
        }
        //selection = {unset:true,ix:0,iy:0}
    }

    function updateSelection(cell) {
        selection.unset=false;
        selection.minx=Math.min(selection.ix,cell.x);
        selection.maxx=Math.max(selection.ix,cell.x);
        selection.miny=Math.min(selection.iy,cell.y);
        selection.maxy=Math.max(selection.iy,cell.y);
        for(var y=0;y<data.sheet.length;y++) {
            for(var x=0;x<data.sheet[0].length;x++) {
                data.sheet[y][x].selected=(x>=selection.minx && x<=selection.maxx && y>=selection.miny && y<=selection.maxy);
            }
        }
    }

    function cellMouseEnter(cell) {
        if(data.mouse.select) {
            updateSelection(cell);
            $log.log(selection);
        }
    }

    angular.extend(this,{data:data,selection:selection,cellClick:cellClick,cellMouseEnter:cellMouseEnter});
}])
.directive('firstCell', ['cellops',function(cellops) {
    return {
        link: function(scope, element) {
            cellops.updateCurCell(element.parent());
        }
    }
}])
.factory('cellops', function() {
    var currentCell;
    return {
        updateCurCell: function(cellElem) {
            if(typeof currentCell !== "undefined")
                currentCell.toggleClass('highlighted-cell');
            currentCell=cellElem;
            currentCell.toggleClass('highlighted-cell');
        }
    }
}).filter('character',function(){
    return function(input){
        return String.fromCharCode(64 + parseInt(input,10));
    };
});
