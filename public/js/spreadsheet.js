/*var data = [
  ["", "Ford", "Volvo", "Toyota", "Honda"],
  ["2016", 10, 11, 12, 13],
  ["2017", 20, 11, 14, 13],
  ["2018", 30, 15, 12, 13]
];*/
var data = new Array(100);
for(var i=0;i<100;i++)
  data = new Array(100);
$(function() {
  var container = $('.sheet-container').get(0);
  console.log(container);
  var hot = new Handsontable(container, {
    data: data,
    rowHeaders: true,
    colHeaders: true
  });
})