/*
 * Batch Rename Selected Layers Script
 * Version 1.1
 * Created by Kamil Khadeyev (@darkwark)
 * Decompiled with Jsxer Version: 1.4.1 from JSXBIN 2.0
 * Updates by Alexey Bogomolov (@movalex)
 */

function doRename(mode, selectedLayers, txt, startNumber, inverse) {
    try {
        startNumber = parseFloat(startNumber)
    } catch (e) {
        alert(e, "Need to be a number!")
    }
    if (isNaN(startNumber)) {
        alert("Unable to parse the start number, starting from 0");
        startNumber = 0;
    }
    startNumber = Math.floor(startNumber);
    var countEnd = selectedLayers.length + startNumber - 1
    for (var i = 0; i < selectedLayers.length; i += 1) {
        makeActiveByIndex([selectedLayers[i]], false);
        tmpTxt = txt;
        docName = app.activeDocument.name;
        docName = docName.replace(".psd", "");
        layerName = app.activeDocument.activeLayer.name
        layerNumber = countEnd - i
        if (inverse){
            layerNumber = startNumber + i
        }
        tmpTxt = tmpTxt.replace("$t", layerName);
        tmpTxt = tmpTxt.replace("$d", docName);
        switch (mode) {
            case "enumerate":
                app.activeDocument.activeLayer.name = tmpTxt + " " + layerNumber.toString();
                break;
            default:
                app.activeDocument.activeLayer.name = tmpTxt;
                break;
        }
    }
}

function getSelectedLayersIdx() {
    var selectedLayers = new Array();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var desc = executeActionGet(ref);
    if (desc.hasKey(stringIDToTypeID("targetLayers"))) {
        desc = desc.getList(stringIDToTypeID("targetLayers"));
        var c = desc.count;
        var selectedLayers = new Array();
        for (var i = 0; i < c; i += 1) {
            try {
                activeDocument.backgroundLayer;
                selectedLayers.push(desc.getReference(i).getIndex());
            } catch (e) {
                selectedLayers.push(desc.getReference(i).getIndex() + 1);
            }
        }
    } else {
        var ref = new ActionReference();
        ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("ItmI"));
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        try {
            activeDocument.backgroundLayer;
            selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")) - 1);
        } catch (e) {
            selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")));
        }
    }
    return selectedLayers;
}

function makeActiveByIndex(idx, visible) {
    for (var i = 0; i < idx.length; i += 1) {
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putIndex(charIDToTypeID("Lyr "), idx[i]);
        desc.putReference(charIDToTypeID("null"), ref);
        if (i > 0) {
            var idselectionModifier = stringIDToTypeID("selectionModifier");
            var idselectionModifierType = stringIDToTypeID("selectionModifierType");alert
            var idaddToSelection = stringIDToTypeID("addToSelection");
            desc.putEnumerated(idselectionModifier, idselectionModifierType, idaddToSelection);
        }
        desc.putBoolean(charIDToTypeID("MkVs"), visible);
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
    }
}
var selectedLayers = getSelectedLayersIdx();

try {
    if (selectedLayers.length > 1) {
        var title = selectedLayers.length.toString() + " Layers Selected";
        var dialog = new Window("dialog", title);
        dialog.alignChildren = "right";
        dialog.margins = 10;
        dialog.closeButton = false;

        var inputGroup = dialog.add("group");
        inputGroup.orientation = "row";
        var label = inputGroup.add("statictext");
        label.text = "Rename to: ";
        var input = inputGroup.add("edittext");
        input.characters = 30;
        input.active = true;

        var dPanel = dialog.add("panel", undefined, "Rename options");
        dPanel.orientation = "row";
        dPanel.alignChildren = "left";
        dPanel.preferredSize = [350, -1];
        var enumCheckBox = dPanel.add("checkbox", undefined, "Enumerate");
        enumCheckBox.value = true;
        var reverseCheckBox = dPanel.add("checkbox", undefined, "Reverse Order");
        reverseCheckBox.value = false;

        var startNumGroup = dPanel.add("group");
        startNumGroup.orientation = "row";
        startNumGroup.alignChildren = "right";
        var startNumInput = startNumGroup.add("edittext");
        var startNumLabel = startNumGroup.add("statictext");
        startNumInput.characters = 3;
        startNumInput.text = 0;
        startNumLabel.text = "Start Enumeration From"
        
        var submitGroup = dialog.add("group");
        submitGroup.orientation = "row";
        var ok_btn = submitGroup.add("button", undefined, "OK");
        var cancel_btn = submitGroup.add("button", undefined, "Cancel");

        enumCheckBox.onClick = function (){
            var doEnum = enumCheckBox.value;
            if (doEnum) {
                reverseCheckBox.enabled = true
            }
            else {
                reverseCheckBox.enabled = false
                reverseCheckBox.value = false
            }
        }

        if (dialog.show() == 1) {
            var mode = "";
            var txt = input.text;
            var doReverse = reverseCheckBox.value;
            var doEnum = enumCheckBox.value;
            var startNum = startNumInput.text;
            if (!startNum) {
                startNum = 0;
            }
            if (doEnum) {
                mode = "enumerate";
            }
            app.activeDocument.suspendHistory("Layers Renamer Script", "doRename(mode, selectedLayers, txt, startNum, doReverse)");
            makeActiveByIndex(selectedLayers, false);
        }
    } else {
        alert("Please select more than one layer", "Error");
    }
} catch (e) {
    alert(e,"Error");
}
