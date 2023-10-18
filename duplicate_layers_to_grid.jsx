// Prompt user for number of copies and X-axis offset
var numCopies = parseInt(prompt("Enter the number of copies to create:", 2));
var xOffset = parseInt(prompt("Enter the number of pixels to offset on the X-axis:", 250));

function main() {
    // Duplicate selected layers n times and save them to an array
    var layers = [];
    for (var i = 0; i < numCopies; i++) {
        var layer = app.activeDocument.activeLayer.duplicate();
        layers.push(layer);
    }

    // Move each duplicated layer to form a grid
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        layer.translate(i * xOffset, 0);
    }
}

// Suspend history for all changes
app.activeDocument.suspendHistory("Duplicate and move layers", "main()")

