// The script created with the help of Bing Search GPT.
// Create dialog window
var w = new Window('dialog', 'Title');
w.add('statictext', undefined, 'Number of copies:');
var numCopiesInput = w.add('edittext', undefined, 5);
w.add('statictext', undefined, 'X offset:');
var xOffsetInput = w.add('edittext', undefined, 12);
w.add('statictext', undefined, 'Y offset:');
var yOffsetInput = w.add('edittext', undefined, 0);
var resetButton = w.add('button', undefined, 'Reset XY');
var okButton = w.add('button', undefined, 'OK');
var cancelButton = w.add('button', undefined, 'Cancel');
var previewButton = w.add('button', undefined, 'Preview');

okButton.onClick = function() {
    if (previewClicked) {
        w.close()
        return
    }

    numCopies = parseInt(numCopiesInput.text);
    xOffset = parseInt(xOffsetInput.text);
    yOffset = parseInt(yOffsetInput.text);
    w.close();
    runScript();
};
resetButton.onClick = function() {
    xOffsetInput.text = "0"
    yOffsetInput.text = "0"
};
cancelButton.onClick = function() {
    app.activeDocument.activeHistoryState = app.activeDocument.historyStates[app.activeDocument.historyStates.length - 2];
    w.close();
};

var previewClicked = false;
previewButton.onClick = (function() {
    if (previewClicked) {
        app.activeDocument.activeHistoryState = app.activeDocument.historyStates[app.activeDocument.historyStates.length - 2];
    }
    numCopies = parseInt(numCopiesInput.text);
    xOffset = parseInt(xOffsetInput.text);
    yOffset = parseInt(yOffsetInput.text);
    previewClicked = true;
    runScript();
    app.refresh();
});
w.show();

function main() {
    // Duplicate selected layer
    var layerToDuplicate = app.activeDocument.activeLayer;
    for (var i = 0; i < numCopies; i++) {
        var layer = layerToDuplicate.duplicate();
        // optionally put in reverse order
        // layer.move(layerToDuplicate, ElementPlacement.PLACEAFTER);
        layer.translate(i * xOffset, i * yOffset);
        if (layer.typename != "LayerSet") {
            layer.name = "mask " + (i+1).toString()
        }
    }
    layerToDuplicate.visible = false;

}


// Suspend history for all changes
function runScript() {
    app.activeDocument.suspendHistory("Duplicate and move layers", "main()")
    app.purge(PurgeTarget.UNDOCACHES);
}

