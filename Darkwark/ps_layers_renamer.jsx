#target photoshop
/*
<javascriptresource>
<name>[D] Renamer</name>
<enableinfo>true</enableinfo>
<category>DarkWark</category>
</javascriptresource>
*/


/*
 * Batch Rename Selected Layers Script
 * Version 1.2
 * Created by Kamil Khadeyev (@darkwark)
 * Decompiled with Jsxer Version: 1.4.1 from JSXBIN 2.0
 * Updates by Alexey Bogomolov (@movalex)
 */

function verifyFLoat(num) {
    try {
        num = parseFloat(num);
        if (isNaN(num)) {
            alert("Unable to parse the start number, starting from 0");
            num = 0;
        }
        return num;
    } catch (e) {
        alert(e, "Need to be a number!")
    }
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

function renameSelectedLayers(mode, selectedLayers, txt, startNumber, inverse) {
    var countEnd = selectedLayers.length + startNumber - 1;
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
                app.activeDocument.activeLayer.name = tmpTxt + layerNumber.toString();
                break;
            default:
                app.activeDocument.activeLayer.name = tmpTxt;
                break;
        }
    }
    makeActiveByIndex(selectedLayers, false);
}

function renameSelectedGroups(mode, txt, startNumber, inverse) {
    // Select the groups you want to rename
    var selectedGroups = app.activeDocument.layerSets;
    var countEnd = selectedGroups.length + startNumber - 1;

    // Define the new name for the groups
    var newName = txt;

    // Loop through each selected group and rename it
    for (var i = 0; i < selectedGroups.length; i++) {
        var group = selectedGroups[i];
        alert(group.name)
        if (inverse) {
            layerNumber = startNumber + i
        }
        if (group.layers.length == 0) {
            group.name = txt;
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

        var enumPanel = dialog.add("panel", undefined, "Enumeration Options");
        enumPanel.orientation = "row";
        enumPanel.alignChildren = "left";
        enumPanel.preferredSize = [350, -1];
        var enumCheckBox = enumPanel.add("checkbox", undefined, "Enumerate");
        enumCheckBox.value = true;
        
        var startNumGroup = enumPanel.add("group");
        startNumGroup.orientation = "row";
        startNumGroup.alignChildren = "right";
        var startNumLabel = startNumGroup.add("statictext");
        var startNumInput = startNumGroup.add("edittext");
        startNumLabel.text = "Start From"
        startNumInput.characters = 2;
        startNumInput.text = 1;
        var reverseCheckBox = enumPanel.add("checkbox", undefined, "Reverse Order");
        reverseCheckBox.value = false;

        var groupOptions = dialog.add("panel", undefined, "Group Options");
        groupOptions.orientation = "row";
        groupOptions.alignChildren = "left";
        var groupCheckBox = enumPanel.add("checkbox", undefined, "Rename Groups Only");
        groupCheckBox.value = false;
        
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
                startNum = 1;
            }
            startNum = verifyFLoat(startNum);
            startNum = Math.floor(startNum);
            if (doEnum) {
                mode = "enumerate";
            }
            if (groupCheckBox.value) {
                app.activeDocument.suspendHistory("Groups Renamer Script", "renameSelectedGroups(mode, txt, startNum, doReverse)");
            }
            else {
                    app.activeDocument.suspendHistory("Layers Renamer Script", "renameSelectedLayers(mode, selectedLayers, txt, startNum, doReverse)");
                }
            }
    } else {
        alert("Please select more than one layer", "Error");
    }
} catch (e) {
    alert(e,"Error");
}
