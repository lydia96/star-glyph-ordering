/**
 * Read csv data
 */
$(document).ready(function () {

    $('#submit').on("click", function (e) {
        e.preventDefault();
        // If there is no data input
        if (!$('#files')[0].files.length) {
            alert("Please choose at least one file to read the data.");
        }

        $('#files').parse({
            config: {
                delimiter: "auto",
                complete: visualization
            },
            before: function (file, inputElem) {
                //console.log("Parsing file...", file);
            },
            error: function (err, file) {
                console.log("ERROR:", err, file);
            },
            complete: function () {
            }
        });
    });

});


/**
 * Main Function
 * @param results
 */
function visualization(results) {

    var fileName = document.getElementById('files').files[0].name.slice(0, -4);

        $("div.wrapper").remove();

        var data = results.data;
        var dataArray = [[]];
        var hasNullValue = [];

        //construct the data array
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            dataArray[i] = row;
            var cells = row.join(",").split(",");
            for (var j = 0; j < cells.length; j++) {
                dataArray[i][j] = cells[j];
            }
        }


        // delete rows with null value(s)
        for (var a = 1; a < dataArray.length; a++) {
            for (var b = 0; b < dataArray[0].length; b++) {
                if (dataArray[a][b] === "") {
                    hasNullValue.push(a);
                    break;
                }
            }
        }
        var deleted = 0;
        for (var index = 0; index < hasNullValue.length; index++) {
            dataArray.splice(hasNullValue[index] - deleted, 1);
            deleted++;
        }

        //get Ordering Methods
        var selectedMethod = document.getElementById("list").value;
        var newArr;
        var nomArr = getNomArr(dataArray);
        var orderingMethod;
        switch (selectedMethod) {
            //Default ordering
            case "0":
                console.log("you have chosen " + document.getElementById("0").innerHTML + ".");
                orderingMethod = "Default";
                newArr = dataArray;
                break;
            //Similarity-Global
            case "8":
                console.log("you have chosen " + document.getElementById("8").innerHTML + ".");
                orderingMethod = "Sim";
                var simMat2 = deepCopy(getSimMat(dataArray));
                if (dataArray[0].length > 9) {
                    if (confirm("Datasets with over 8 dimensions could take longer to compute, press OK if you want to continue.")) {
                        newArr = reconstruct(dataArray, sim_global(dataArray, simMat2));
                    }
                } else {
                    newArr = reconstruct(dataArray, sim_global(dataArray, simMat2));
                }
                break;
            //Dissimilarity-Global
            case "9":
                console.log("you have chosen " + document.getElementById("9").innerHTML + ".");
                orderingMethod = "Dis";
                var simMat3 = deepCopy(getSimMat(dataArray));
                if (dataArray[0].length > 9) {
                    if (confirm("Datasets with over 8 dimensions could take longer to compute, press OK if you want to continue.")) {
                        newArr = reconstruct(dataArray, dissim_global(dataArray, simMat3));
                    }
                } else {
                    newArr = reconstruct(dataArray, dissim_global(dataArray, simMat3));
                }
                break;
            default:
                throw("Something wrong here");

        }

        if (newArr !== undefined) {
            newArr[0][0] = "name";
            var visArr = deepCopy(newArr);
            var downloadArr = deepCopy(newArr);

            if (document.getElementById("storeData").checked) {
                var csvFile = ConvertToCSV(convertToArrayOfObjects(downloadArr));
                download(fileName + "_" + orderingMethod + ".csv", csvFile);
            }

                var labels = getLabels(visArr);
                sgVis(convertToArrayOfObjects(getNomArr(visArr)), labels);


            buildTable(newArr);
            if (!document.getElementById("appendData").checked) {
                document.getElementById("dataTable").className = "hidden";
            }
        }
}


/**
 * convert an array of objects to CSV file
 * @param objArray
 * @returns {string}
 * @constructor
 */
function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = Object.keys(objArray[0]).join() + '\r\n';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line !== '') line += ',';

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}



