/*
* Decompiled with Jsxer
* Version: 1.4.1
* JSXBIN 2.0
*/

function rotateMe3(dAngle, groupLayers, layer, radius, rotateRelativePath, saveOriginal, steps) {
    var startRadius = radius;
    var endRadius = radius;
    var totalAngleAmount = 360;
    angle = totalAngleAmount / steps;
    decay = (startRadius - endRadius) / steps;
    radius = startRadius;
    layerSize = getSize(aLayer);
    radius += (Math.max(layerSize.width, layerSize.height) / 2);
    if (layerSize.width < layerSize.height) {
        aLayer.rotate(90);
        restoreRotationFlag = true;
    }
    else {
        restoreRotationFlag = false;
    }
    if (groupLayers) {
        layerGroup = app.activeDocument.layerSets.add();
        layerGroup.name = layer.name + " (" + steps + " copies)";
    }
    for (var i = 0; i < steps; i += 1) {
        radius -= decay;
        coords = unitCircle(radius, angle * i);
        newLayer = aLayer.duplicate();
        newLayer.translate(coords[0], coords[1]);
        newLayer.name = layer.name + " (" + i + 1 + ")";
        if (rotateRelativePath) {
            newLayer.rotate((angle * i) + dAngle);
        }
        else {
            newLayer.rotate(dAngle - 90);
        }
        if (groupLayers) {
            newLayer.move(layerGroup, ElementPlacement.INSIDE);
        }
    }
    if (restoreRotationFlag) {
        aLayer.rotate(-90);
    }
    if (!saveOriginal) {
        aLayer.remove();
    }
}
function drawRectangle(color, height, width, x, y) {
    var tmpColor = app.foregroundColor;
    app.foregroundColor = color;
    var idMk = charIDToTypeID("Mk  ");
    var desc9 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref7 = new ActionReference();
    var idcontentLayer = stringIDToTypeID("contentLayer");
    ref7.putClass(idcontentLayer);
    desc9.putReference(idnull, ref7);
    var idUsng = charIDToTypeID("Usng");
    var idType = charIDToTypeID("Type");
    var desc10 = new ActionDescriptor();
    var idsolidColorLayer = stringIDToTypeID("solidColorLayer");
    desc10.putClass(idType, idsolidColorLayer);
    var idShp = charIDToTypeID("Shp ");
    var desc11 = new ActionDescriptor();
    var idTop = charIDToTypeID("Top ");
    var idPxl = charIDToTypeID("#Pxl");
    desc11.putUnitDouble(idTop, idPxl, y);
    var idLeft = charIDToTypeID("Left");
    var idPxl = charIDToTypeID("#Pxl");
    desc11.putUnitDouble(idLeft, idPxl, x);
    var idBtom = charIDToTypeID("Btom");
    var idPxl = charIDToTypeID("#Pxl");
    desc11.putUnitDouble(idBtom, idPxl, y + height);
    var idRght = charIDToTypeID("Rght");
    var idPxl = charIDToTypeID("#Pxl");
    desc11.putUnitDouble(idRght, idPxl, x + width);
    var idElps = charIDToTypeID("Rctn");
    desc10.putObject(idShp, idElps, desc11);
    var idcontentLayer = stringIDToTypeID("contentLayer");
    desc9.putObject(idUsng, idcontentLayer, desc10);
    executeAction(idMk, desc9, DialogModes.NO);
    app.foregroundColor = tmpColor;
    return app.activeDocument.activeLayer;
}
function drawEllipse(color, height, width, x, y) {
    var tmpColor = app.foregroundColor;
    app.foregroundColor = color;
    var idMk = charIDToTypeID("Mk  ");
    var desc9 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref7 = new ActionReference();
    var idcontentLayer = stringIDToTypeID("contentLayer");
    ref7.putClass(idcontentLayer);
    desc9.putReference(idnull, ref7);
    var idUsng = charIDToTypeID("Usng");
    var idType = charIDToTypeID("Type");
    var desc10 = new ActionDescriptor();
    var idsolidColorLayer = stringIDToTypeID("solidColorLayer");
    desc10.putClass(idType, idsolidColorLayer);
    var idShp = charIDToTypeID("Shp ");
    var desc11 = new ActionDescriptor();
    var idTop = charIDToTypeID("Top ");
    var idPxl = charIDToTypeID("#Pxl");
    desc11.putUnitDouble(idTop, idPxl, y);
    var idLeft = charIDToTypeID("Left");
    var idPxl = charIDToTypeID("#Pxl");
    desc11.putUnitDouble(idLeft, idPxl, x);
    var idBtom = charIDToTypeID("Btom");
    var idPxl = charIDToTypeID("#Pxl");
    desc11.putUnitDouble(idBtom, idPxl, y + height);
    var idRght = charIDToTypeID("Rght");
    var idPxl = charIDToTypeID("#Pxl");
    desc11.putUnitDouble(idRght, idPxl, x + width);
    var idElps = charIDToTypeID("Elps");
    desc10.putObject(idShp, idElps, desc11);
    var idcontentLayer = stringIDToTypeID("contentLayer");
    desc9.putObject(idUsng, idcontentLayer, desc10);
    executeAction(idMk, desc9, DialogModes.NO);
    app.foregroundColor = tmpColor;
    return app.activeDocument.activeLayer;
}
function unitCircle(angle, radius) {
    var x = Math.cos(radians(angle)) * radius;
    var y = Math.sin(radians(angle)) * radius;
    return [x, y];
}
function radians(angle) {
    return (angle * Math.PI) / 180;
}
function degrees(theta) {
    return (theta * 180) / Math.PI;
}
function getSize(layer) {
    var topX = layer.bounds[0] + 1;
    var topY = layer.bounds[1] + 1;
    var bottomX = layer.bounds[2] - 1;
    var bottomY = layer.bounds[3] - 1;
    var layerWidth = parseInt(bottomX - topX);
    var layerHeight = parseInt(bottomY - topY);
    return { height: layerHeight, width: layerWidth };
}
if (app.activeDocument.activeLayer.layers == undefined) {
    var UI_res = "dialog{ text: \'RotateMe 3\', preferredSize:[-1, -1],\
            controls: Panel { text:\'Properties\', orientation: \'column\', alignment:\'fill\', alignChildren:\'right\',\
                steps: Group {orientation: \'row\',\
                    label: StaticText {text:\'Copies:\'},\
                    slider: Slider {value:12, maxvalue:72, minvalue:0, preferredSize:[150, -1]},\
                    txt: EditText {text:\'12\', characters: 6},\
                },\
                radius: Group {orientation: \'row\',\
                    label: StaticText {text:\'Radius:\'},\
                    slider: Slider {value:0, maxvalue:1000, minvalue:0, preferredSize:[150, -1]},\
                    txt: EditText {text:\'0 px\', characters: 6},\
                },\
                rotation: Group {orientation: \'row\',\
                    label: StaticText {text:\'Rotation:\'},\
                    slider: Slider {value:0, maxvalue:360, minvalue:-360, preferredSize:[150, -1]},\
                    txt: EditText {text:\'0\u02da\', characters: 6},\
                },\
            }\
            options: Panel { text:\'Options\', orientation: \'column\', alignment:\'fill\', alignChildren:\'left\',\
                row1: Group {orientation: \'row\', alignChildren:\'left\',\
                    rotateRelativePath: Checkbox {text:\'Rotate Relative to Center\', value: true},\
                    groupLayers: Checkbox {text:\'Group Layers\', value: true},\
                }\
                row2: Group {orientation: \'row\', alignChildren:\'left\',\
                    saveOriginal: Checkbox {text:\'Save Original Layer\'},\
                }\
            }\
            buttons: Group{ orientation: \'row\', alignment:\'center\',\
                about_btn: Button {text: \'?\', preferredSize:[50,-1]},\
                group: Group { margins:[60,-1,-1,-1],\
                    ok_btn: Button {text:\'OK\'},\
                    cancel_btn: Button {text:\'Cancel\'},\
                }\
            }\
        }"
    try {
        var win = new Window(UI_res);
        var steps_sl = win.controls.steps.slider;
        var steps_txt = win.controls.steps.txt;
        var radius_sl = win.controls.radius.slider;
        var radius_txt = win.controls.radius.txt;
        var rotation_sl = win.controls.rotation.slider;
        var rotation_txt = win.controls.rotation.txt;
        var rotateRelativePath = win.options.row1.rotateRelativePath;
        var saveOriginal = win.options.row2.saveOriginal;
        var groupLayers = win.options.row1.groupLayers;
        var about_btn = win.buttons.about_btn;
        var preview_btn = win.buttons.preview_btn;
        var aLayer = app.activeDocument.activeLayer;
        var aLayerSize = getSize(aLayer);
        var sizes = [aLayerSize.width, aLayerSize.height];
    } catch (e) {
        alert(e);
    }
    about_btn.onClick = (function () {
        alert("Rotate Me 3.0\nCreated by Kamil Khadeyev (@darkwark)");
    });
    steps_sl.onChanging = (function () {
        this.value = Math.round(this.value);
        steps_txt.text = this.value;
    });
    steps_txt.onChange = (function () {
        this.text = parseInt(this.text);
        if (isNaN(this.text)) {
            this.text = steps_sl.value;
        }
        if (this.text > steps_sl.maxvalue) {
            this.text = steps_sl.maxvalue;
        }
        if (this.text < steps_sl.minvalue) {
            this.text = steps_sl.minvalue;
        }
        steps_sl.value = this.text;
    });
    radius_sl.onChanging = (function () {
        this.value = Math.round(this.value);
        radius_txt.text = this.value + " px";
    });
    radius_txt.onChange = (function () {
        this.text = parseInt(this.text);
        if (isNaN(this.text)) {
            this.text = radius_sl.value;
        }
        if (this.text > radius_sl.maxvalue) {
            this.text = radius_sl.maxvalue;
        }
        if (this.text < radius_sl.minvalue) {
            this.text = radius_sl.minvalue;
        }
        radius_sl.value = this.text;
        this.text += " px";
    });
    rotation_sl.onChanging = (function () {
        this.value = Math.round(this.value);
        rotation_txt.text = this.value + "\u02da";
    });
    rotation_txt.onChange = (function () {
        this.text = parseInt(this.text);
        if (isNaN(this.text)) {
            this.text = rotation_sl.value;
        }
        if (this.text > rotation_sl.maxvalue) {
            this.text = rotation_sl.maxvalue;
        }
        if (this.text < rotation_sl.minvalue) {
            this.text = rotation_sl.minvalue;
        }
        rotation_sl.value = this.text;
        this.text += "\u02da";
    });
    if (win.show() == 1) {
        app.activeDocument.suspendHistory("[KAM] RotateMe 3 Script (Learn more: http://blog.kam88.com)",
            "rotateMe3(rotation_sl.value,  groupLayers.value, aLayer,  radius_sl.value, rotateRelativePath.value, saveOriginal.value, steps_sl.value)");
    }
}
else {
    alert("Opps!\nPlease select regular layer");
}