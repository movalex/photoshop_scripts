// The script created with the help of Bing Search GPT.
// Create dialog window
var w = new Window('dialog', 'Title');
w.add('statictext', undefined, 'Number of copies:');
var numCopiesInput = w.add('edittext', undefined, 2);
w.add('statictext', undefined, 'X offset:');
var xOffsetInput = w.add('edittext', undefined, 250);
w.add('statictext', undefined, 'Y offset:');
var yOffsetInput = w.add('edittext', undefined, 250);
var resetButton = w.add('button', undefined, 'Reset XY');
var okButton = w.add('button', undefined, 'OK');
var cancelButton = w.add('button', undefined, 'Cancel');

// var previewButton = w.add('button', undefined, 'Show Preview');

okButton.onClick = function() {
    numCopies = parseInt(numCopiesInput.text);
    xOffset = parseInt(xOffsetInput.text);
    yOffset = parseInt(yOffsetInput.text);
    w.close();
    run();
};
resetButton.onClick = function() {
    xOffsetInput.text = "0"
    yOffsetInput.text = "0"
};
cancelButton.onClick = function() {
    w.close();
};
// previewButton.onClick = function() {
//     numCopies = parseInt(numCopiesInput.text);
//     xOffset = parseInt(xOffsetInput.text);
//     app.activeDocument.activeHistoryState = app.activeDocument.historyStates[app.activeDocument.historyStates.length - 2];
//     run();
// };
w.show();

function main() {
    // Duplicate selected layers n times and save them to an array
    var layers = [];
    for (var i = 1; i < numCopies; i++) {
        var layer = app.activeDocument.activeLayer.duplicate();
        layers.push(layer);
    }

    // Move each duplicated layer to form a grid
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        layer.translate(i * xOffset, i * yOffset);
    }
}


// Suspend history for all changes
function run() {
    app.activeDocument.suspendHistory("Duplicate and move layers", "main()")
}

