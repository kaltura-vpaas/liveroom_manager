function joinRoom(resourceId, firstName, lastName, role) {
    // Send POST to /joinroom
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/joinroom", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4) {
            // Open the newrow room in a new tab
            window.open(xhr.response);
        }
    }
    xhr.send(JSON.stringify({
        resourceId: resourceId,
        firstName: firstName,
        lastName: lastName,
        role: role
    }));
}

function updateRooms(bDeleteRooms) {
    var checkedRows = [];
    var headersText = [];
    var headers = $("th");
    var keys = ["", "id", "name", "description", "tags"];

    // Loop through the rows and add the checked ones to checkedRows
    var rowNumber = 0;
    $("#roomTable tr").each(function(index) {
      var cells = $(this).find("td");
      //console.log("row " + index + " checked: " + document.getElementById($cells[1].innerText).checked);

      if(cells.length == 0){
          return;
      }
      // Add row if checkbox is checked
      if (document.getElementById(cells[1].innerText).checked) {
        checkedRows[rowNumber] = {};

        cells.each(function(cellIndex) {
          if (cellIndex > 0 && cellIndex < 5) {
            // Update the row object with the key/cell combo
            checkedRows[rowNumber][keys[cellIndex]] = $(this).text();
          }
        });
        console.log(checkedRows[rowNumber]);
        ++rowNumber;
      }
    });

    // Convert checkedRows to JSON
    var checkedRowsJson = JSON.stringify( { "updatedRooms": checkedRows } );
    //alert(checkedRowsJson);

    // Send POST to /updaterooms and reload page when updates complete
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/updaterooms", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function(e) {
      if (xhr.readyState === 4) {
        location.reload();
      }
    }
    xhr.send(JSON.stringify({
        rooms: checkedRowsJson,
        delete: bDeleteRooms
    }));
  }


function onChanged(changeField, defaultVal) {
    //when the checkbox is checked we switch the tag
    //we show the otherValue when first checked

    //Base Case: we add the tag to the textarea
    //Normal Case: we find the tag and switch it

    //the tr containing the checkbox that passes
    //changeField will also have an id of same value 

    var realDefault, otherVal;
    if (Array.isArray(defaultVal)) {
        realDefault = defaultVal[0];
        otherVal = defaultVal[1]
    } else {
        //then its a number
        realDefault = defaultVal
        otherVal = (realDefault == 0) ? 1 : 0;
    }

    var tags = $("#tags").val();
    if (!tags.includes(changeField)) {
        //tag does not exist, so add the other value
        $("#tags").val(tags + ","+changeField+":"+otherVal);

        //change table to highlight which field is actually being used
        $("#"+changeField).find("td:eq(4)").attr("class","default");
        $("#"+changeField).find("td:eq(3)").attr("class","");
    } else {
        //since tag already exists, we "reverse" it
        var tagsArr = tags.split(",");
        var newArr = [];
        tagsArr.forEach(tagSet => {
            if (tagSet.includes(changeField)) {
                var theTagArr = tagSet.split(":");
                var tagVal = theTagArr[1];
                if(tagVal == realDefault){
                    newVal = otherVal;
                    $("#"+changeField).find("td:eq(4)").attr("class","default");
                    $("#"+changeField).find("td:eq(3)").attr("class","");
                } else {
                    newVal = realDefault
                    $("#"+changeField).find("td:eq(3)").attr("class","default");
                    $("#"+changeField).find("td:eq(4)").attr("class","");
                }
                newArr.push(changeField+":"+newVal);
            } else {
                newArr.push(tagSet);
            }
        });
        $("#tags").val(newArr.join(","));
    }
}