/*CSS Sam Framework by Samuel B.*/

function colorswitch() {
  document.body.toggleAttribute("dark");
}

// #################################

function tablesearchfilter() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchTable");
    filter = input.value.toUpperCase();
    table = document.getElementById("customTable");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
}

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("customTable");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc"; 
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch= true;
                break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;      
            } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

// #################################

var coll = document.getElementsByClassName("collapsible");
var i;
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("activecollapsible");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}

// #################################

var inputs = document.querySelectorAll('.inputfile');
Array.prototype.forEach.call(inputs, function(input)
{
	var label	 = input.nextElementSibling,
		labelVal = label.innerHTML;

	input.addEventListener('change', function(e)
	{
		var fileName = '';
		if(this.files && this.files.length > 1)
			fileName = (this.getAttribute('data-multiple-caption') || '' ).replace('{count}', this.files.length);
		else
			fileName = e.target.value.split('\\').pop();

		if(fileName)
			label.querySelector('span').innerHTML = fileName;
		else
			label.innerHTML = labelVal;
	});
});

// #################################

var TagInputData = [
  {
    name: "tagPerson",
    onlyfromData: true,
    multipleData: false,
    // removeTagformDataifUsed: false,
    addData: ["01 Hello", "02 Lol", "02 Du","Kek"],
  },
  {
    name: "tagPersonLol",
    onlyfromData: false,
    multipleData: true,
    // removeTagformDataifUsed: false,
    addData: ["Hello", "Du"],
  }
];

[].forEach.call(document.getElementsByClassName('tags-input'), function (el) {
  let hiddenInput = document.createElement('input'),
      datalist = document.createElement('datalist'),
      mainInput = document.createElement('input'),
      tags = [];

  //console.log(el);

  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', el.getAttribute('data-name'));

  mainInput.setAttribute('type', 'text');
  mainInput.setAttribute('placeholder', 'Eingabe..');
  mainInput.classList.add('main-input');
  mainInput.addEventListener('input', function () {
    InputCheck();

    //Click event on Datalist options
    var val = mainInput.value;
    var opts = datalist.childNodes;
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].value.toLowerCase() === val.toLowerCase()) {
        if(!TagInputData[GetCurrentInputIndex()].multipleData) {
          if(CheckMultipleTags()) {
            mainInput.value = '';
            return;
          }
        }
        addTag(opts[i].value);
        mainInput.value = '';
        break;
      }
    }
  });

  function InputCheck() {
    let enteredTags = mainInput.value.split(',');
    if (enteredTags.length > 1) {
        enteredTags.forEach(function (t) {
          let filteredTag = filterTag(t);
          if (filteredTag.length > 0) {
            if(!TagInputData[GetCurrentInputIndex()].onlyfromData) {
              if(!TagInputData[GetCurrentInputIndex()].multipleData) {
                if(CheckMultipleTags()) {
                  return;
                }
              }
              addTag(filteredTag);
            }
          }
        });
        mainInput.value = '';
    }
  }

  mainInput.addEventListener('keydown', function (e) {
      let keyCode = e.which || e.keyCode;
      if (keyCode === 8 && mainInput.value.length === 0 && tags.length > 0) {
        removeTag(tags.length - 1);
      }
      if(keyCode === 13) {
        mainInput.value += ',';
        InputCheck();
      }
  });

  function CheckMultipleTags() {
    let tags = hiddenInput.value.split(',');
    var lastchar = mainInput.value.slice(-1);
    if(lastchar == ',') {
      mainInput.value = mainInput.value.slice(0,-1);
    }
    tags.push(mainInput.value);
    //console.log(tags);
    return checkIfDuplicateExists(tags);
  }

  function checkIfDuplicateExists(w){
    return new Set(w).size !== w.length;
}

  function GetCurrentInputIndex() {
    var index;
    TagInputData.forEach(function (v,i) {
      if(el.getAttribute('name') == v.name) {
        index = i
      }
    });
    return index;
  }
  
  DatalistCreate();

  function DatalistCreate() {
    mainInput.setAttribute('list', `${TagInputData[GetCurrentInputIndex()].name}`);
    datalist.setAttribute('id', `${TagInputData[GetCurrentInputIndex()].name}`);

    for (let i = 0; i < TagInputData[GetCurrentInputIndex()].addData.length; i++) {
      addDatalist(TagInputData[GetCurrentInputIndex()].addData[i]);
    }
  }

  function addDatalist(value) {
    var option = document.createElement('option');
    option.setAttribute('value', `${value}`);
    datalist.appendChild(option);
  }

  el.appendChild(mainInput);
  el.appendChild(datalist);
  el.appendChild(hiddenInput);

  addTag('hello!');

  function addTag(text) {
    let tag = {
      text: text,
      element: document.createElement('span'),
    };

    tag.element.classList.add('tag');
    tag.element.textContent = tag.text;

    let closeBtn = document.createElement('span');
    closeBtn.classList.add('close');
    closeBtn.addEventListener('click', function () {
      removeTag(tags.indexOf(tag));
    });
    tag.element.appendChild(closeBtn);

    tags.push(tag);

    el.insertBefore(tag.element, mainInput);

    refreshTags();
  }

  function removeTag(index) {
    let tag = tags[index];
    tags.splice(index, 1);
    el.removeChild(tag.element);
    refreshTags();
  }

  function refreshTags() {
    let tagsList = [];
    tags.forEach(function (t) {
      tagsList.push(t.text);
    });
    hiddenInput.value = tagsList.join(',');
  }

  function filterTag(tag) {
    return tag.replace(/[^\w -]/g, '').trim().replace(/\W+/g, '-');
  }
});

