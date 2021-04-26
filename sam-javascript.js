/*CSS Sam Framework by Samuel B.*/

var colorthemes = ['light', 'dark', 'blue', 'skin', 'greyish'];

function flatswitch() {
  document.body.toggleAttribute("flat");
}

function themecolor(val) {
  colorthemes.forEach(v => {
    document.body.removeAttribute(v);
  });
  document.body.setAttribute(val,true);
}

function addthemecolor(val) {
  colorthemes.push(val);
}

// document.getElementById('inputid').toggleAttribute('disabled');

//#region  ############### Table ##################

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
//#endregion ####################################

//#region  ################ collapsible #################

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

//#endregion #################################

//#region  ################ Input File #################
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

//#endregion #################################

//#region  ################ Tags #################
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

  // addTag('hello!');

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

//#endregion #################################

//#region  ################ Custom Select #################

initCustomSelect();
// Custom Selector
function initCustomSelect() {
  var x, i, j, l, ll, selElmnt, a, b, c;
  /* Look for any elements with the class "custom-select": */
  x = document.getElementsByClassName("custom-select");
  l = x.length;
  for (i = 0; i < l; i++) {
    //Delete old Divs
    var oldDiv = x[i].getElementsByClassName("select-selected");
    var oldDiv2 = x[i].getElementsByClassName("select-items");
    for (let index = 0; index < oldDiv.length; index++) {
      oldDiv[index].remove();
    }
    for (let index = 0; index < oldDiv2.length; index++) {
      oldDiv2[index].remove();
    }


    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
  
    let hiddenInput = x[i].getElementsByTagName("input")[0];
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
      /* For each option in the original select element,
      create a new DIV that will act as an option item: */
      c = document.createElement("DIV");
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener("click", function(e) {
          /* When an item is clicked, update the original select box,
          and the selected item: */
          var y, i, k, s, h, sl, yl;
          s = this.parentNode.parentNode.getElementsByTagName("select")[0];
          sl = s.length;
          h = this.parentNode.previousSibling;
          for (i = 0; i < sl; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = this.innerHTML;
  
              // Trigger change event and give hidden input value
              hiddenInput.value = s.options[i].value;
              var event = new Event('change');
              hiddenInput.dispatchEvent(event);
  
              y = this.parentNode.getElementsByClassName("same-as-selected");
              yl = y.length;
              for (k = 0; k < yl; k++) {
                y[k].removeAttribute("class");
              }
              this.setAttribute("class", "same-as-selected");
              break;
            }
          }
          h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function(e) {
      /* When the select box is clicked, close any other select boxes,
      and open/close the current select box: */
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  }
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}


function loadSelect(id,value) {
  var a = document.getElementById(id);
  var selctindex = 0;
  var displayval = a.getElementsByClassName("select-selected")[0];
  var coptions = a.getElementsByClassName("select-items")[0].childNodes;
  var options = a.getElementsByTagName("select")[0].getElementsByTagName("option");
  for (let index = 0; index < options.length; index++) {
    if(options[index].value == value) {
      selctindex = index-1;
      displayval.innerHTML = options[index].innerHTML;
    }  
  }
  for (let index = 0; index < coptions.length; index++) {
    if(index == selctindex) {
      coptions[index].classList.add("same-as-selected");
    }  
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);

//#endregion #################################

//#region ####################### Slider / Progress ############################

[].forEach.call(document.getElementsByClassName("slider"), function (slider) {
  var slidertitle = slider.nextElementSibling;
  
  var sliderOffsetX = slider.getBoundingClientRect().left - document.documentElement.getBoundingClientRect().left;
  //var sliderOffsetY = slider.getBoundingClientRect().top - document.documentElement.getBoundingClientRect().top;
  // var sliderWidth = slider.offsetWidth - 1;
  
  checkProgressBardisabled();
  UpdateProgressBar();
  
  window.addEventListener('resize', TooltipSliderResize);
  function TooltipSliderResize() {
    sliderOffsetX = slider.getBoundingClientRect().left - document.documentElement.getBoundingClientRect().left;
    //sliderOffsetY = slider.getBoundingClientRect().top - document.documentElement.getBoundingClientRect().top;
    // sliderWidth = slider.offsetWidth - 1;
    checkProgressBardisabled();
  }
  
  function checkProgressBardisabled() {
    if(slider.getAttribute('disabled') != null) {
      if(slider.getAttribute('showvalue') != null)
      {
        slidertitle.style.display = "initial";
        slidertitle.innerHTML = slider.value;
        var currentMouseXPos = (slider.clientWidth + window.pageXOffset) - sliderOffsetX;
        slidertitle.style.left = currentMouseXPos + sliderOffsetX + 'px';
        slidertitle.style.transform = "translate3d(-40%, 0, 0)";
      }
      return;
    }
    slidertitle.style.display = "none";
    slidertitle.style.transform = "translate3d(-40%, -2.2em, 0)";
  }
  
  slider.addEventListener('mousemove', function(event) {
    sliderPostion(event, false, true);
    slidertitle.style.display = "initial";
  });
  
  slider.addEventListener('touchmove', function(event) {
    sliderPostion(event, true);
    slidertitle.style.display = "initial";
  }, {passive: true});
  
  function sliderPostion(event, mobile, UpdatetitleContentOnHover) {
    var valueHover,currentMouseXPos;
    if(!mobile) {
      valueHover = calcSliderPos(event).toFixed(2);
      currentMouseXPos = (event.clientX + window.pageXOffset) - sliderOffsetX;
    } else {
      valueHover = slider.value;
      currentMouseXPos = (event.touches[0].clientX + window.pageXOffset) - sliderOffsetX;
    }
    if(!UpdatetitleContentOnHover) {
      valueHover = slider.value;
    }
  
    // var valueHover = Math.round(currentMouseXPos / sliderWidth * 100 + 1);
    //var valueHover = (currentMouseXPos / sliderWidth * 100).toFixed(2);
    // this...
    // if(valueHover < 1) valueHover = 0;
    // ... and this are to make it easier to hover on the "0" and "100" positions
    // if(valueHover > 99) valueHover = 100;
  
    if(100 >= valueHover && valueHover >= 0) {
      slidertitle.style.transition = "none";
      slidertitle.innerHTML = valueHover;
      //slidertitle.style.top = sliderOffsetY - 15 + 'px';
      slidertitle.style.left = currentMouseXPos + sliderOffsetX - 5 + 'px';
    }
    // Moves Tooltip, so it is not half out of screen on 0 and 100
    if(98 <= valueHover) {
      slidertitle.style.left = currentMouseXPos + sliderOffsetX - 28 + 'px';
      slidertitle.style.transition = "left 0.15s ease-out";
    }
    if(valueHover <= 1) {
      slidertitle.style.left = currentMouseXPos + sliderOffsetX + 20 + 'px';
      slidertitle.style.transition = "left 0.15s ease-out";
    }
    UpdateProgressBar();
  }
  
  function calcSliderPos(e) {
    return (e.offsetX / e.target.clientWidth) *  parseInt(e.target.max,10);
  }
  
  slider.addEventListener('mouseup', function(e) {
    UpdateProgressBar();
    document.activeElement.blur();
  });
  
  slider.addEventListener('touchend', function(e) {
    UpdateProgressBar();
    document.activeElement.blur();
    slidertitle.style.display = "none";
  });
  
  slider.addEventListener('mouseout', function(e) {
    slidertitle.style.display = "none";
  });
  
  slider.onfocus = () => {
    sliderfocus = true;
  };
  
  slider.addEventListener('touchstart', function(e) {
    sliderfocus = true;
  }, {passive: true});
  
  slider.addEventListener('change', function(e) {
    UpdateProgressBar();
    checkProgressBardisabled();
  });

  function UpdateProgressBar()  {
    slider.style.backgroundSize = (slider.value - slider.min) * 100 / (slider.max - slider.min) + '% 100%';
  }

});

function SetProgressBar(elementid, newvalue)  {
  var ele = document.getElementById(String(elementid));
  ele.dispatchEvent(new Event("change"));
  if(newvalue != undefined) {
    ele.value = newvalue;
  }
}

function SetProgressBarByTime(elementid, addvalue, interval)  {
  var ele = document.getElementById(String(elementid));
  var elementid = setInterval(() => {
    let val = parseFloat(ele.value);
    if(val <= parseFloat(ele.min) || val >= parseFloat(ele.max)) { ClearProgressBarInterval(elementid);return; }
    SetProgressBar(elementid, val + parseFloat(addvalue));
    // console.log(val + parseFloat(addvalue));
  }, interval);
}

function ClearProgressBarInterval(intervalname)  {
  clearInterval(intervalname);
}

function DisableProgressBar(elementid) {
  var ele = document.getElementById(String(elementid));
  ele.setAttribute('disabled', true);
  ele.setAttribute('showvalue', true);
}

function ActiveProgressBar(elementid) {
  var ele = document.getElementById(String(elementid));
  ele.removeAttribute('disabled');
  ele.removeAttribute('showvalue');
}
//#endregion ##############################

