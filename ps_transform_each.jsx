/*
 * Decompiled with Jsxer
 * Version: 1.4.1
 * JSXBIN 2.0
 */

function transformEach(anchorPosition, angle, horizontal, scaleFX, selectedLayers, vertical) {
    for (var i = 0; i < selectedLayers.length; i += 1) {
        makeActiveByIndex([selectedLayers[i]], false);
        app.activeDocument.activeLayer.resize(horizontal, vertical, anchorPosition);
        app.activeDocument.activeLayer.rotate(angle, anchorPosition);
        if (scaleFX) {
            scaleStyles(Math.max(horizontal_sl.value, vertical_sl.value));
        }
    }
}

function scaleStyles(percent) {
    try {
        var idscaleEffectsEvent = stringIDToTypeID("scaleEffectsEvent");
        var desc121 = new ActionDescriptor();
        var idScl = charIDToTypeID("Scl ");
        var idPrc = charIDToTypeID("#Prc");
        desc121.putUnitDouble(idScl, idPrc, percent);
        executeAction(idscaleEffectsEvent, desc121, DialogModes.NO);
    } catch (e) {}
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
            var idselectionModifierType = stringIDToTypeID("selectionModifierType");
            var idaddToSelection = stringIDToTypeID("addToSelection");
            desc.putEnumerated(idselectionModifier, idselectionModifierType, idaddToSelection);
        }
        desc.putBoolean(charIDToTypeID("MkVs"), visible);
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
    }
}
var selectedLayers = getSelectedLayersIdx();
var doc = app.activeDocument;
var UI_res = "dialog{ text: \'Transform Each (" + selectedLayers.length + " Layers Selected)\', preferredSize:[-1, -1],\n\t\t\t\t\tscale: Panel { text:\'Scale\', orientation: \'row\', alignment:\'center\', alignChildren:\'right\', preferredSize:[340,0],\n\t\t\t\t\t\tcontrols: Group {orientation: \'column\', alignChildren:\'right\',\n\t\t\t\t\t\t\thorizontal: Group {orientation: \'row\', margins:[20,5,10,5]\n\t\t\t\t\t\t\t\tlabel: StaticText {text:\'Width:\'},\n\t\t\t\t\t\t\t\tslider: Slider {value:100, maxvalue:300, minvalue:0, preferredSize:[150,-1]},\n\t\t\t\t\t\t\t\ttxt: EditText {text:\'100%\', characters: 5},\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\tvertical: Group {orientation: \'row\', margins:[20,5,10,5]\n\t\t\t\t\t\t\t\tlabel: StaticText {text:\'Height:\'},\n\t\t\t\t\t\t\t\tslider: Slider {value:100, maxvalue:300, minvalue:0, preferredSize:[150,-1]},\n\t\t\t\t\t\t\t\ttxt: EditText {text:\'100%\', characters: 5},\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\trotate: Panel { text:\'Rotate\', orientation: \'row\', alignment:\'center\', alignChildren:\'right\', preferredSize:[340,0],\n\t\t\t\t\t\tangle: Group {orientation: \'row\', margins:[20,5,10,5],\n\t\t\t\t\t\t\tlabel: StaticText {text:\'Angle:\'}\n\t\t\t\t\t\t\tslider: Slider {value:0, maxvalue:360, minvalue:-360, preferredSize:[150,-1]},\n\t\t\t\t\t\t\ttxt: EditText {text:\'0\u02da\', characters: 5},\n\t\t\t\t\t\t},\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\taPoint: Panel { text:\'Transformation Point\', orientation: \'row\', alignment:\'center\', alignChildren:\'center\', preferredSize:[340,0],\n\t\t\t\t\t\tcontrol: Group {orientation: \'row\', alignChildren:\'left\', margins:[20,5,10,5],\n\t\t\t\t\t\t\ttxt: StaticText {text:\'Placement:\'},\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\toptions: Panel { text:\'Options\', orientation: \'row\', alignment:\'fill\', alignChildren:\'left\', preferredSize:[340,0],\n\t\t\t\t\t\tcheckboxes: Group {orientation: \'row\', alignChildren:\'left\', margins:[20,5,10,5],\n\t\t\t\t\t\t\tscaleStyles: Checkbox {text:\'Scale Styles\', value: true},\n\t\t\t\t\t\t\tlockScale: Checkbox {text:\'Constrain Proportions\', value: true},\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\tbuttons: Group{ orientation: \'row\', alignChildren:\'right\', margins:[0,5,10,5], \n\t\t\t\t\t\tabout_btn: Button {text: \'?\', preferredSize:[30,-1]},\n\t\t\t\t\t\tpreview_btn: Button {text: \'Preview\'},\n\t\t\t\t\t\tgroup: Group { margins:[30,-1,-1,-1],\n\t\t\t\t\t\t\tok_btn: Button {text:\'OK\'},\n\t\t\t\t\t\t\tcancel_btn: Button {text:\'Cancel\'},\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}";
try {
    w = new Window(UI_res);
    var aPoint = w.aPoint.control.add("dropdownlist", undefined, ["Top Left", "Top Center", "Top Right", "-", "Middle Left", "Middle Center", "Middle Right", "-", "Bottom Left", "Bottom Center", "Bottom Right"]);
    aPoint.preferredSize = [180, -1];
    aPoint.selection = 5;
    var horizontal_sl = w.scale.controls.horizontal.slider;
    var horizontal_txt = w.scale.controls.horizontal.txt;
    var vertical_sl = w.scale.controls.vertical.slider;
    var vertical_txt = w.scale.controls.vertical.txt;
    var angle_sl = w.rotate.angle.slider;
    var angle_txt = w.rotate.angle.txt;
    var lockScale_cb = w.options.checkboxes.lockScale;
    var scaleStyles_cb = w.options.checkboxes.scaleStyles;
    var about_btn = w.buttons.about_btn;
    var preview_btn = w.buttons.preview_btn;
} catch (e) {
    alert(e);
}
lockScale_cb.onClick = (function() {
    if (vertical_sl.value < horizontal_sl.value) {
        vertical_sl.value = horizontal_sl.value;
        vertical_txt.text = horizontal_txt.text;
    } else {
        horizontal_sl.value = vertical_sl.value;
        horizontal_txt.text = vertical_txt.text;
    }
});
horizontal_sl.onChanging = (function() {
    this.value = Math.round(this.value);
    horizontal_txt.text = this.value + "%";
    if (lockScale_cb.value) {
        vertical_sl.value = horizontal_sl.value;
        vertical_txt.text = horizontal_txt.text;
    }
});
horizontal_txt.onChange = (function() {
    this.text = parseInt(this.text);
    if (isNaN(this.text)) {
        this.text = horizontal_sl.value;
    }
    if (this.text > horizontal_sl.maxvalue) {

    }
    if (this.text < horizontal_sl.minvalue) {
        this.text = horizontal_sl.minvalue;
    }
    horizontal_sl.value = this.text;
    this.text += "%";
    if (lockScale_cb.value) {
        vertical_sl.value = horizontal_sl.value;
        vertical_txt.text = horizontal_txt.text;
    }
});
vertical_sl.onChanging = (function() {
    this.value = Math.round(this.value);
    vertical_txt.text = this.value + "%";
    if (lockScale_cb.value) {
        horizontal_sl.value = vertical_sl.value;
        horizontal_txt.text = vertical_txt.text;
    }
});
vertical_txt.onChange = (function() {
    this.text = parseInt(this.text);
    if (isNaN(this.text)) {
        this.text = vertical_sl.value;
    }
    if (this.text > vertical_sl.maxvalue) {

    }
    if (this.text < vertical_sl.minvalue) {
        this.text = vertical_sl.minvalue;
    }
    vertical_sl.value = this.text;
    this.text += "%";
    if (lockScale_cb.value) {
        horizontal_sl.value = vertical_sl.value;
        horizontal_txt.text = vertical_txt.text;
    }
});
angle_sl.onChanging = (function() {
    this.value = Math.round(this.value);
    angle_txt.text = this.value + "\u02da";
});
angle_txt.onChange = (function() {
    this.text = parseInt(this.text);
    if (isNaN(this.text)) {
        this.text = angle_sl.value;
    }
    if (this.text > angle_sl.maxvalue) {
        this.text = angle_sl.maxvalue;
    }
    if (this.text < angle_sl.minvalue) {
        this.text = angle_sl.minvalue;
    }
    angle_sl.value = this.text;
    this.text += "\u02da";
});
about_btn.onClick = (function() {
    alert("Transform Each 2.1\nCreated by Kamil Khadeyev (@darkwark)\nblog.kam88.com\n\xa9 2015");
});
var anchorPosition = AnchorPosition.MIDDLECENTER;
var aPointPositions = [AnchorPosition.TOPLEFT, AnchorPosition.TOPCENTER, AnchorPosition.TOPRIGHT, "", AnchorPosition.MIDDLELEFT, AnchorPosition.MIDDLECENTER, AnchorPosition.MIDDLERIGHT, "", AnchorPosition.BOTTOMLEFT, AnchorPosition.BOTTOMCENTER, AnchorPosition.BOTTOMRIGHT];
aPoint.onChange = (function() {
    anchorPosition = aPointPositions[this.selection.index];
});
var previewClicked = false;
preview_btn.onClick = (function() {
    if (previewClicked) {
        doc.activeHistoryState = doc.historyStates[doc.historyStates.length - 2];
    }
    prevH = parseInt(horizontal_txt.text);
    prevW = parseInt(vertical_txt.text);
    prevAngle = parseInt(angle_txt.text);
    prevScaleStyles = scaleStyles_cb.value;
    prevAPos = anchorPosition;
    app.activeDocument.suspendHistory("[KAM] Transform Each Script (Learn more: http://blog.kam88.com)", "transformEach(selectedLayers, parseInt(horizontal_txt.text), parseInt(vertical_txt.text), parseInt(angle_txt.text), scaleStyles_cb.value, anchorPosition)");
    makeActiveByIndex(selectedLayers, false);
    previewClicked = true;
    app.refresh();
});
if (selectedLayers.length > 1) {
    if (w.show() == 1) {
        if ((previewClicked) && (((((prevH != parseInt(horizontal_txt.text)) || (prevW != parseInt(vertical_txt.text))) || (prevAngle != parseInt(angle_txt.text))) || (prevScaleStyles != scaleStyles_cb.value)) || (prevAPos != anchorPosition))) {
            doc.activeHistoryState = doc.historyStates[doc.historyStates.length - 2];
            app.activeDocument.suspendHistory("[KAM] Transform Each Script (Learn more: http://blog.kam88.com)", "transformEach(selectedLayers, parseInt(horizontal_txt.text), parseInt(vertical_txt.text), parseInt(angle_txt.text), scaleStyles_cb.value, anchorPosition)");
            makeActiveByIndex(selectedLayers, false);
        }
        if (!previewClicked) {
            app.activeDocument.suspendHistory("[KAM] Transform Each Script (Learn more: http://blog.kam88.com)", "transformEach(selectedLayers, parseInt(horizontal_txt.text), parseInt(vertical_txt.text), parseInt(angle_txt.text), scaleStyles_cb.value, anchorPosition)");
            makeActiveByIndex(selectedLayers, false);
        }
    } else {
        if (previewClicked) {
            doc.activeHistoryState = doc.historyStates[doc.historyStates.length - 2];
        }
    }
} else {
    alert("Ouch!\nPlease select more than 1 layer");
}
