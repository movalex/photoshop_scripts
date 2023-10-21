// The script created with the help of Bing Search GPT.
// Create dialog window
var w = new Window('dialog', 'Create Layers Grid');
// w.add('statictext', undefined, 'Number of copies:');
var inputGroup = w.add("group");
inputGroup.orientation = "row";
var columnsNumber = inputGroup.add('edittext', undefined, 2);
inputGroup.add('statictext', undefined, 'X');
var rowsNumber = inputGroup.add('edittext', undefined, 2);

var translateGroup = w.add("group");
translateGroup.orientation = "row";
translateGroup.add('statictext', undefined, 'X');
var xOffsetInput = translateGroup.add('edittext', undefined, 12);
translateGroup.add('statictext', undefined, 'Y');
var yOffsetInput = translateGroup.add('edittext', undefined, 12);


var resetButton = w.add('button', undefined, 'Reset XY');
var okButton = w.add('button', undefined, 'OK');
var cancelButton = w.add('button', undefined, 'Cancel');
var previewButton = w.add('button', undefined, 'Preview');


function getValues() {
    columns = parseInt(columnsNumber.text);
    rows = parseInt(rowsNumber.text);
    xOffset = parseInt(xOffsetInput.text);
    yOffset = parseInt(yOffsetInput.text);
}

okButton.onClick = function() {
    if (previewClicked) {
        w.close()
        return
    }
    getValues();
    w.close();
    runScript();
};

resetButton.onClick = function() {
    xOffsetInput.text = "0"
    yOffsetInput.text = "0"
};

cancelButton.onClick = function() {
    w.close();
};

var previewClicked = false;
previewButton.onClick = (function() {
    if (previewClicked) {
        app.activeDocument.activeHistoryState = app.activeDocument.historyStates[app.activeDocument.historyStates.length - 2];
    }
    getValues();
    previewClicked = true;
    runScript();
    app.refresh();
});
w.show();


function getSelectedLayers() {
    var selectedLayers = [];
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var desc = executeActionGet(ref);
    if (desc.hasKey(stringIDToTypeID("targetLayers"))) {
      desc = desc.getList(stringIDToTypeID("targetLayers"));
      for (var i = 0; i < desc.count; i++) {
        var index = desc.getReference(i).getIndex();
        try {
          var layer = app.activeDocument.layers[index - 1];
          selectedLayers.push(layer);
        } catch (e) {}
      }
    }
    return selectedLayers;
  }

function createGrid() {
    // Duplicate selected layer and make a grid of layers, then disable the source layer

    var selectedLayers = getSelectedLayers();
    if (selectedLayers.length != 1) {
        alert("Select exactly one layer to duplicate!", "Error")
        return
    }
    rowsNum = rows
    var layerToDuplicate = app.activeDocument.activeLayer;
    for (var j = 0; j < rows; j++) {
        var layerSetName = "row " + (rowsNum - j).toString()
        var layerSet = app.activeDocument.layerSets.add();
        layerSet.name = layerSetName;
        for (var i = 0; i < columns; i++) {
            var layer = layerToDuplicate.duplicate();
            layer.translate(i * xOffset, 0);
            if (layer.typename != "LayerSet") {
                layer.name = "mask " + (i+1).toString()
            }
            layer.move(layerSet, ElementPlacement.INSIDE);
        }
        layerSet.translate(0, j * yOffset);
        // reverse the layers order
        // TODO make it work correctly.
        // for (var i = 0; i < layerSet.layers.length; i++) {
        //     layer = layerSet.layers[i];
        //     layer.move(layerSet.layers[layerSet.layers.length - 1], ElementPlacement.PLACEBEFORE);
        // }
        // place the grpup after the duplicated layer
        layerSet.move(layerToDuplicate, ElementPlacement.PLACEAFTER);

    }

    layerToDuplicate.visible = false;
}


// Suspend history for all changes
function runScript() {
    app.activeDocument.suspendHistory("Duplicate and move layers", "createGrid()")
    app.purge(PurgeTarget.UNDOCACHES);
}

