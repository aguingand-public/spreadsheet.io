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
  var $container = $('.sheet-container');
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

    hot.loadData(data);
    hot.selectCell(0,0);
  });

  $('input.editor-bar').on("change paste keyup",function() {
    hot.setDataAtCell(selected.row, selected.col, $(this).val());
  });

  $('input.editor-bar').click(function() {
    $(this).focus();
  })

  $('form.rename').submit(function(e) {
    e.preventDefault();
    $.post('/file/'+client.file.id+'/rename',{filename:$("input[name='filename']").val()});
    $(this).blur();
  });  
})