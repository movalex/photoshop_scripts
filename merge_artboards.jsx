#target photoshop
/*
<javascriptresource>
<name>[AB] Merge Artboards</name>
<enableinfo>true</enableinfo>
<category>MyScripts</category>
</javascriptresource>
*/


// The script to merge artboards
// Use it on your own risk.
// License: MIT
// Copyright: Alexey Bogomolov <mail@abogomolov.com>, 2023
//

function isLayerSet(layer) {
    return layer.typename == "LayerSet";
}

// Since the current (2023) official API does not support artboard attribute query, 
// write a method to determine whether the layer is an artboard.
function isArtboard (layer) {
    var itemIndex = layer.itemIndex;
    try {
        if (app.activeDocument.backgroundLayer) {
            itemIndex --;
        }
    } catch (e) {
    }

    var ref = new ActionReference();
    ref.putIndex(stringIDToTypeID("layer"), itemIndex);
    var desp = executeActionGet(ref);
    try {
        return desp.getBoolean(stringIDToTypeID("artboardEnabled"));
    } catch (e) {
        return false;
    }
}

// Get the size of the artboard and the coordinates of the distance
// from the origin of the upper left corner of the entire canvas
function getArtboardBounds (artboardLayer) {
    var originalRuler = app.preferences.rulerUnits;
    
    app.preferences.rulerUnits = Units.PIXELS;
    var itemIndex = artboardLayer.itemIndex;
    try {
        if (app.activeDocument.backgroundLayer) {
            itemIndex --;
        }
    } catch (e) {
    }
    var ref = new ActionReference();
    ref.putIndex(stringIDToTypeID("layer"), itemIndex);
    var desp = executeActionGet(ref);
    var theBounds = desp.getObjectValue(stringIDToTypeID('bounds'));
    var theX = theBounds.getInteger(stringIDToTypeID('left'));
    var theY = theBounds.getInteger(stringIDToTypeID('top'));
    var theX2 = theBounds.getInteger(stringIDToTypeID('right'));
    var theY2 = theBounds.getInteger(stringIDToTypeID('bottom'));
    
    app.preferences.rulerUnits = originalRuler;
    return [UnitValue(theX, "px"), UnitValue(theY, "px"), UnitValue(theX2, "px"), UnitValue(theY2, "px")];
}

//Export an artboard separately, similar to the "File->Export->Artboard to File" function in ps
function exportArtboardAsPNG(artboard, exportDirPath) {
    //Create a new document and copy the artboard layer group to group
    var currentDoc = app.activeDocument;
    var newDoc = app.documents.add (currentDoc.width, currentDoc.height, currentDoc.resolution, null, NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
    app.activeDocument = currentDoc;
    var newArtboard = artboard.duplicate (newDoc);
    app.activeDocument = newDoc;
    //Record the dimensions of the artboard
    var bounds = getArtboardBounds(newArtboard);
    var tmpFilePath = exportDirPath + "/tmp.png";
    //Export a temporary image containing only the artboard but still at its original dimensions
    saveDocumentAsPNG(tmpFilePath);
    newDoc.close(SaveOptions.DONOTSAVECHANGES);
    //Open the temporary picture in ps, crop the artboard area according to the artboard size, and export the cropped part
    var tmpFile = new File(tmpFilePath);
    newDoc = app.open (tmpFile);
    newDoc.crop(bounds);
    saveDocumentAsPNG(exportDirPath+"/result.png");
    tmpFile.remove();
    newDoc.close(SaveOptions.DONOTSAVECHANGES);
}

function process(layers) {
    for (var i = 0; i < layers.length; i++) {
        var rootLayer = layers[i];
        if (isArtboard(rootLayer)) {
            for (var j = 0; j < rootLayer.layers.length; j++) {
                var layer = rootLayer.layers[j];
                if (isLayerSet(layer)) {
                    layer.merge();
                    // continue
                }
                else {
                    if (layer.visible && !layer.isBackgroundLayer) {
                        // rasterize the layer
                        layer.rasterize(RasterizeType.ENTIRELAYER);
                    }
                }
            }    
        }
    }
}

// Get a reference to the active document
var doc = app.activeDocument;
var allLayers = doc.layers;


// Suspend history for all changes
function runScript() {
    app.activeDocument.suspendHistory("Merge Artboards", "process(allLayers)")
    app.purge(PurgeTarget.UNDOCACHES);
}
runScript()
