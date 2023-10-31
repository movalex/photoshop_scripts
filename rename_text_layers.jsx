#target photoshop
/*
<javascriptresource>
<name>[AB] Rename Text Layers by Content</name>
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

function renameTextByContents(layer) {
    if (isLayerSetOrArtboard(layer)) {
        for (var i = 0; i < layer.layers.length; i++) {
            var childLayer = layer.layers[i];
            renameTextByContents(childLayer);
        }
    }
    if (isTextLayer(layer)) {
        // Rename the layer using the text value of the text layer
        layer.name = layer.textItem.contents;
    }
}

function show_confirmation() {
    var w = new Window('dialog', 'Confirmation');
    var label = w.add('statictext', undefined, 'Process text layers renaming?');
    var confirmGroup = w.add("group");
    confirmGroup.orientation = "row";
    var okButton = confirmGroup.add('button', undefined, 'OK');
    var cancelButton = confirmGroup.add('button', undefined, 'Cancel');
    var doc = app.activeDocument;

    if (w.show() == 1) {
        var allLayers = doc.layers;
        var selectedLayers = getSelectedLayersInfo();
        var reselectLayers = false;
        if (selectedLayers.length > 0) {
            message = "Processing " + selectedLayers.length.toString() + " selected layers"
            var processLayers = selectedLayers;
            processSelectedByID(selectedLayers);
            reselectLayers = true;
        } else {
            message = "Processing all layers";
            var processLayers = allLayers;
        }
        // alert(message)
        processSelectedByID(processLayers)
        if (reselectLayers) {
            reselectSelectedLayers(selectedLayers);
        }
    } else {
        w.close();
    }

}

function getSelectedLayersInfo() {

    // https://stackoverflow.com/questions/63448143/get-selected-layers

    var layers = [];
    var layer;
    var ref = new ActionReference();
    var desc;
    var tempIndex = 0;
    var ref2;
    ref.putProperty(stringIDToTypeID("property"), stringIDToTypeID("targetLayers"));
    ref.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));

    var targetLayers = executeActionGet(ref).getList(stringIDToTypeID("targetLayers"));
    for (var i = 0; i < targetLayers.count; i++) {
        ref2 = new ActionReference();

        // if there's a background layer in the document, AM indices start with 1, without it from 0. ¯\_(ツ)_/¯ 
        try {
            activeDocument.backgroundLayer;
            ref2.putIndex(charIDToTypeID('Lyr '), targetLayers.getReference(i).getIndex());
            desc = executeActionGet(ref2);
            tempIndex = desc.getInteger(stringIDToTypeID("itemIndex")) - 1;

        } catch (o) {
            ref2.putIndex(charIDToTypeID('Lyr '), targetLayers.getReference(i).getIndex() + 1);
            desc = executeActionGet(ref2);
            tempIndex = desc.getInteger(stringIDToTypeID("itemIndex"));
        }

        layer = {};
        layer.index = tempIndex;
        layer.id = desc.getInteger(stringIDToTypeID("layerID"));
        layer.name = desc.getString(charIDToTypeID("Nm  "));
        layers.push(layer);
    }

    return layers;
}


function selectByID(id, add) {
    if (add == undefined) add = false;
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putIdentifier(charIDToTypeID('Lyr '), id);
    desc1.putReference(charIDToTypeID('null'), ref1);
    if (add) desc1.putEnumerated(stringIDToTypeID("selectionModifier"), stringIDToTypeID("selectionModifierType"), stringIDToTypeID("addToSelection"));
    executeAction(charIDToTypeID('slct'), desc1, DialogModes.NO);
}
// end of selectByID()

// if we _really_ want to get artLayers we should select them one by one with IDs
function processSelectedByID(selectedLayers) {
    for (var i = 0; i < selectedLayers.length; i++) {
        selectByID(selectedLayers[i].id);
        // alert(selectedLayers[i].name);
        // renameTextByContents(selectedLayers[i]);
        // alert(activeDocument.activeLayer.name);
        renameTextByContents(activeDocument.activeLayer);
    }
}

// and reselecting everything back
function reselectSelectedLayers(selectedLayers) {
    for (var i = 0; i < selectedLayers.length; i++) {
        selectByID(selectedLayers[i].id, true);
    }
}


show_confirmation();