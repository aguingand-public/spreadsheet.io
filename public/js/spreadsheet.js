var hot = {};
var socket = io.connect(client.socketUrl);
var collaborators = {};

var jobs = {};

function createCollaborator() {
  return {
    colorClass : 'highlighted-'+Math.floor((Math.random() * 12) + 1)
  }
}

function executeIfDefined(callback) {
  if(typeof callback == 'function')
    callback();
}

// socket
socket.on('connect',function() {
  socket.emit('Client Infos', client);
});

socket.on('collaborators', function(datas) {
  console.log('get collaborators');
  console.log('received data', datas);
  datas.forEach(function(data) {
    collaborators[data.user.username] = createCollaborator();
  });
  console.log('collaborator = ',collaborators);

  executeIfDefined(jobs.afterCollaborators);

  var $clientList = $('#clientList');
  $clientList.empty();
  $.each(collaborators,function(username, collaborator) {
    $clientList.append($('<li>').text(username));
  });

  function render() {
    hot.render();
    hot.runHooks('afterSelection');
  }
  if(typeof hot == 'undefined') {
    jobs.afterHotInit = render;
    return;
  }
  render();
});


/*
$(function() {
  var $container = $('.js-sheet-container');
  var hot;
  var selected = {}
  var $selectedCell;
*/


socket.on('external selection', function(data) {
  console.log('external selection', data);
  console.log(collaborators);
  jobs.afterCollaborators = function() {
    collaborators[data.user.username].selectedCell = data.selection;
    hot.render();
  }
  if(typeof collaborators[data.user.username] != "undefined")
    jobs.afterCollaborators();
});
//

// dom + Handsontable
$(function() {
  var $container = $('.js-sheet-container');
  var selected = {};

  var data = new Array(100);
  for(var row=0;row<100;row++) {
      data[row] = new Array(100);
    for(var col=0;col<100;col++) {
        data[row][col]="";
    }
  }

  hot = new Handsontable($container[0], {
    data: data,
    rowHeaders: true,
    colHeaders: true,
    manualRowResize: true,
    manualColumnResize: true,
    outsideClickDeselects: false,
    beforeChange: function(changes, source) {
      console.log('new modification ', changes);
      socket.emit('cell change', changes);
    },
    afterSelection: function(r, c, r2, c2) {
      console.log('new selection ',arguments);
      selected.row = r;
      selected.col = c;
      $('input.editor-bar').val(hot.getValue());
      if(Object.keys(collaborators).length>0)
        socket.emit('new selection', {row:r, col:c, row2:r2, col2:c2});
    },
    afterInit: function() {
      executeIfDefined(jobs.afterHotInit);
    }
  });

  hot.updateSettings({
    afterRender: function(f) {
      console.log('afterRender');
      $.each(collaborators, function(username, c) {
        if(typeof c.selectedCell !== 'undefined') {
          $(hot.getCell(c.selectedCell.row,c.selectedCell.col)).addClass(c.colorClass);
        }
      })
    }
  })

  $.getJSON(client.file.path, function(filedata) {

    var sheet = filedata.sheet;
    console.log(sheet);
    for(var row=0;row<sheet.length;row++) {
      for(var col=0;col<sheet[row].length;col++) {
        if(sheet[row] && sheet[row][col])
          data[row][col] = sheet[row][col].data;
        else
          data[row][col]="";
      }
    }

  /*
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
*/

    hot.loadData(data);
    hot.selectCell(0,0);
  });

  $('input.js-editor-bar').on("change paste keyup",function() {
    hot.setDataAtCell(selected.row, selected.col, $(this).val());
  });

  $('input.js-editor-bar').click(function() {
    $(this).focus();
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
