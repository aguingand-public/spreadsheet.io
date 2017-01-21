var socket = io.connect(client.socketUrl);

socket.on('connect',function() {
  socket.emit('Client Infos', client);
});


$(function() {
  var $container = $('.js-sheet-container');
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
    $('input.js-editor-bar').val(hot.getValue());
  });

  function getSelectedCell() {
    return $(hot.getCell(selected.row,selected.col));
  }

  $('input.js-editor-bar').on("change paste keyup",function() {
    $selectedCell = getSelectedCell();
    hot.setDataAtCell(selected.row, selected.col, $(this).val());
    $selectedCell.addClass('selectedCellOut');
  });

  $('input.js-editor-bar').click(function() {
    $selectedCell = getSelectedCell();
    $(this).focus();
    $selectedCell.addClass('selectedCellOut');
  })

  $('form.js-file-rename').on('blur', 'input[name=filename]', function() {
    $(this).parents().submit();
  });


  $('form.js-file-rename').submit(function(e) {
    $nameInput = $(this).find('input[name=filename]');
    e.preventDefault();
    $.post('/file/'+client.file.id+'/rename',{filename:$("input[name='filename']").val()}, function() {
        $nameInput[0].blur();
    });
  });

  $(document).click(function(e) {
    var test = Interface.getActiveElement();
    if($(e.target).is(Interface.getActiveElement())) {
      Interface.unsetActive();
    } else if (!$(e.target).is(Interface.getActiveElement())) {
      Interface.unsetActive(function() {
        if($(e.target).hasClass('activable')){
          Interface.setActive($(e.target));
        }
      });
    }
  });
  

  $('.js-app-headbar__context-menu').on('click', '.js-menu-action', function() {
    console.log($(this));
    var action = $(this).data('action');
    Actions[action]();
  });

  var Actions = (function() {
    var self = {};

    self.undo = function() {
      console.log('undo');
      hot.undo();
    }

    self.redo = function() {
      hot.redo();
    }

    return self;
  }());


  var Interface = (function() {
    var self = {};
    var activeElement;

    self.setActive = function(element) {
      activeElement = element;
      element.addClass('js-cursor-active');
    }

    self.getActiveElement = function() {
      return activeElement;
    }

    self.unsetActive = function(callback = function(){}) {
      if(activeElement !== undefined){
        activeElement.removeClass('js-cursor-active');
        activeElement = undefined;
      }
      callback();
    }

    return self;
  }());

})
