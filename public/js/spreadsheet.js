var socket = io.connect(client.socketUrl);

socket.on('connect',function() {
  socket.emit('Client Infos', client);
});
  
$(function() {
  var $container = $('.sheet-container');
  var hot;
  var selected = {}
  var $selectedCell;

  $.getJSON(client.file.path, function(filedata) {
    var data = new Array(100);
    var sheet = filedata.sheet;
    console.log(sheet);
    for(var row=0;row<100;row++) {
      data[row] = new Array(100);
      for(var col=0;col<100;col++) {
        if(sheet[row] && sheet[row][col])
          data[row][col] = sheet[row][col].data;
        else
          data[row][col]="";
      }
    }
    hot = new Handsontable($container[0], {
      data: data,
      rowHeaders: true,
      colHeaders: true,
      beforeChange: function(changes, source) {
        console.log(changes);
        socket.emit('cell change', changes);
      }
    });
    hot.selectCell(0,0);
  });

  $container.click(function() {
    if($selectedCell)
      $selectedCell.removeClass('selectedCellOut');
    var coords = hot.getSelected();
    selected.row = coords[0];
    selected.col = coords[1];
    $('input.editor-bar').val(hot.getValue());
  });

  function getSelectedCell() {
    return $(hot.getCell(selected.row,selected.col));
  }

  $('input.editor-bar').on("change paste keyup",function() {
    $selectedCell = getSelectedCell();

    hot.setDataAtCell(selected.row, selected.col, $(this).val());
    $selectedCell.addClass('selectedCellOut');
  });

  $('input.editor-bar').click(function() {
    $selectedCell = getSelectedCell();

    $(this).focus();
    $selectedCell.addClass('selectedCellOut');
  })

  $('form.rename').submit(function(e) {
    e.preventDefault();
    $.post('/file/'+client.file.id+'/rename',{filename:$("input[name='filename']").val()});
    $(this).blur();
  });  
})