#target photoshop
/*
<javascriptresource>
<name>[AB] Rename all Text Layers</name>
<enableinfo>true</enableinfo>
<category>MyScripts</category>
</javascriptresource>
*/

/*
WARNING: 
The script might change names of all Text layers in the document
*/

// The script to rename all text layers according to their text contents
// Use it on your own risk.
// License: MIT
// Copyright: Alexey Bogomolov <mail@abogomolov.com>, 2023
//

function isLayerSetOrArtboard(layer) {
    return layer.typename == "LayerSet" || layer.typename == "Artboard";
}

function isTextLayer(layer) {
    return layer.kind == LayerKind.TEXT
}

function runScriptOnLayerSetOrArtboard(layer) {
    if (isLayerSetOrArtboard(layer)) {
        for (var i = 0; i < layer.layers.length; i++) {
            var childLayer = layer.layers[i];
            runScriptOnLayerSetOrArtboard(childLayer);
        }
    } 
    if (isTextLayer(layer)) {
        // Rename the layer using the text value of the text layer
        layer.name = layer.textItem.contents;
    }
}

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

// Loop through each selected text layer
//
function process() {
    // Get a reference to the active document
    var doc = app.activeDocument;
    var allLayers = doc.layers;
    for (var i = 0; i < allLayers.length; i++) {
        var layer = allLayers[i];
        runScriptOnLayerSetOrArtboard(layer);
    }
}

process();

