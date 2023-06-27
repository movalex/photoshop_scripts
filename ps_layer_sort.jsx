#target photoshop

/**
 * @copyright Copyright (c) 2020 Matthew Kimber. All rights reserved.
 * @copyright Copyright (c) 2023 Alexey Bogomolov. All rights reserved.
 * @authors Matthew Kimber <matthew.kimber@gmail.com> Alexey Bogomolov mail@abogomolov.com
 * @version 1.2
 * @license Apache Software License 2.0
 */

(function(app) {
	if (isDocumentOpen()) {
		main();
	} else {
		alert("Please open a document to run this script.");
	}

	/**
	 * @desc Program entry point. Retrieves the active document, determines if layers exist, and then sorts all ArtLayer and LayerSet objects.
	 */
	function main() {
		var selectedLayers = SelectedLayers();
		sortLayers(selectedLayers);
	}

	function SelectedLayers() {
		try{
			//Version V2 works with folders aka layersets
			var ActLay = app.activeDocument.activeLayer;
			ActLay.allLocked = true;
			var L = app.activeDocument.layers.length;
			var selLayers = new Array();
			for(var i = 0; i < L; i++) {
				var LayerType = app.activeDocument.layers[i].typename;
				var layerRef = app.activeDocument.layers[i];
	
				if (LayerType == "LayerSet" ) {
					var refLength = layerRef.layers.length;
					for(var j = 0; j < refLength; j++) {
						var refLay = layerRef.layers[j];
						if (refLay.allLocked == true){selLayers.push(refLay)}
					}
					continue;
				}
				if (layerRef.allLocked == true) {selLayers.push(layerRef)}
			}
	
			ActLay.allLocked = false;
			return selLayers;
		}
		catch (e) {
			alert(e)}
	}

	/**
	 * @desc Sorts the layers in the current LayerSet.
	 * @param {Layers} layers Collection of ArtLayer and LayerSet objects in the current scope.
	 */

	
	function select_layer(nm, add) {   
		// 	select_layer("layer 2");
		
		// select_layer("layer 1", true);

    try {
        var r = new ActionReference();
        r.putName(stringIDToTypeID("layer"), nm);
        var d = new ActionDescriptor();
        d.putReference(stringIDToTypeID("null"), r);
        if (add == true) d.putEnumerated(stringIDToTypeID("selectionModifier"), stringIDToTypeID("selectionModifierType"), stringIDToTypeID("addToSelection"));
        executeAction(stringIDToTypeID("select"), d, DialogModes.NO);
		}

    catch (e) { alert(e); throw(e); }

    }

	function sortLayers(layers) {
		if (layers.length == 0) {
			alert("No layers selected. Select some layers or select a group for sorting", "No layers to sort");
			return
		}
		var activeDoc = app.activeDocument;
		var all_layers = activeDoc.layers
		if (all_layers.length == 0) {
			// Check to see if we need to sort groups in the current layer set.
			if (layers[index].layers.length > 0) {
				alert("Getting layers in group", "Sorting Layers");
				sortLayers(layers[index].layers);
			}
			return
		}

		var layerBuffer = new Array()
		for (var index = 0; index < layers.length; index++) {
			if (!layers[index].isBackgroundLayer) {
				layerBuffer.push(layers[index]);
			}
		}
		// Sort the buffer array using built-in natural sort comparer.
		layerBuffer.sort(compareWithNumbers);
		
		// Move each layer accordingly.
		for (var index = 0; index < layerBuffer.length; index++) {
			layerBuffer[index].move(all_layers[index], ElementPlacement.PLACEBEFORE);
		}
		
		// Group sorted layers.
		var GROUP_NAME = 'Sorted Layers';
		var newGroup = activeDoc.layerSets.add();
		newGroup.name = GROUP_NAME;
		for (var index = layerBuffer.length - 1; index >= 0; index--) {
			layerBuffer[index].move(newGroup, ElementPlacement.INSIDE);
		}
		
		// Select layers.
		for (var index = 0; index < layerBuffer.length; index++) {
			select_layer(layerBuffer[index].name, true)
		}
	}
	
	/**
	 * @desc Checks to see if there is a document open.
	 * @returns {Boolean}
	 */
	function isDocumentOpen() {
		return app.documents.length > 0;	
	}
}(app));