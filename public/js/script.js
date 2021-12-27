function filterTableByName() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById('odcinek');
  filter = input.value.toUpperCase();
  table = document.getElementById('table');
  tr = table.getElementsByTagName('tr');
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = '';
      } else {
        tr[i].style.display = 'none';
      }
    }
  }
}

function filterByVoideship() {
  var input, filter, table, tr, td, i;
  input = document.getElementById('floatingSelect');
  filter = input.value.toUpperCase();
  table = document.getElementById('table');
  tr = table.getElementsByTagName('tr');
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')[2];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = '';
      } else {
        tr[i].style.display = 'none';
      }
    }
  }
}

function filterTableByNoumberOfRoad() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById('numberOfRoad');
  filter = input.value.toUpperCase();
  table = document.getElementById('table');
  tr = table.getElementsByTagName('tr');
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = '';
      } else {
        tr[i].style.display = 'none';
      }
    }
  }
}

function filterByType() {
  var input, filter, table, tr, td, i;
  input = document.getElementById('floatingSelect2');
  filter = input.value.toUpperCase();
  table = document.getElementById('table');
  tr = table.getElementsByTagName('tr');
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')[3];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = '';
      } else {
        tr[i].style.display = 'none';
      }
    }
  }
}
var $affectedElements = $('p,div,span,nav,a,button,input,textarea,select');
// Can be extended, ex. $("div, p, span.someClass")

// Storing the original size in a data attribute so size can be reset
$affectedElements.each(function () {
  var $this = $(this);
  $this.data('orig-size', $this.css('font-size'));
});

$('#btn-increase').click(function () {
  changeFontSize(1);
});

$('#btn-decrease').click(function () {
  changeFontSize(-1);
});

$('#btn-orig').click(function () {
  $affectedElements.each(function () {
    var $this = $(this);
    $this.css('font-size', $this.data('orig-size'));
  });
});

function changeFontSize(direction) {
  $affectedElements.each(function () {
    var $this = $(this);
    $this.css('font-size', parseInt($this.css('font-size')) + direction);
  });
}
