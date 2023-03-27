/*
 * Batch Rename Selected Layers Script
 * Version 1.1
 * Created by Kamil Khadeyev (@darkwark)
 * Decompiled with Jsxer Version: 1.4.1 from JSXBIN 2.0
 */

function prependAppend(mode, selectedLayers, txt) {
    for (var i = 0; i < selectedLayers.length; i += 1) {
        makeActiveByIndex([selectedLayers[i]], false);
        tmpTxt = txt;
        tmpTxt = tmpTxt.replace("%n", selectedLayers.length - i);
        switch (mode) {
            case "append":
                app.activeDocument.activeLayer.name += tmpTxt;
                break;
            case "prepend":
                app.activeDocument.activeLayer.name = tmpTxt + app.activeDocument.activeLayer.name;
                break;
            case "replace":
                app.activeDocument.activeLayer.name = tmpTxt;
                break;
            default:
                app.activeDocument.activeLayer.name += tmpTxt;
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

var myResource = "dialog{ text: '" + selectedLayers.length + " Layers Selected', preferredSize:[-1, -1], alignChildren:'right',\
                    controls: Panel{ orientation: 'column', alignChildren:'right',\
                                  preferredSize:[250, -1],\
                        txt: Group{ orientation: 'row',\
                            label: StaticText {text:'Text: '}\
                            input: EditText {text:'', characters: 28, active:true}\
                        }\
                        rbuttons: Group{orientation:'row',\
                            label: StaticText {text:'Mode: '}\
                            append: RadioButton {text:'Append', value:true}\
                            prepend: RadioButton {text:'Prepend'}\
                            replace: RadioButton {text:'Replace'}\
                        }\
                    }\
                    buttons: Group{ orientation: 'row',\
                        ok_btn: Button {text:'OK'},\
                        cancel_btn: Button {text:'Cancel'},\
                    }\
                }";
try {
    if (selectedLayers.length > 1) {
        var myWindow = new Window(myResource);
        if (myWindow.show() == 1) {
            var txt = myWindow.controls.txt.input.text;
            var append = myWindow.controls.rbuttons.append.value;
            var prepend = myWindow.controls.rbuttons.prepend.value;
            var replace = myWindow.controls.rbuttons.replace.value;
            if (append) {
                var preppendAppend_label = "Appended";
                var mode = "append";
            } else if (prepend) {
                var prependAppend_label = "Prepended";
                var mode = "prepend";
            } else {
                var prependAppend_label = "Replaced";
                var mode = "replace";
            }
            app.activeDocument.suspendHistory("Layers Renamer Script", "prependAppend(mode, selectedLayers, txt)");
            makeActiveByIndex(selectedLayers, false);
        }
    } else {
        alert("Please select more than one layer", "Error");
    }
} catch (e) {
    alert(e,"Error");
}