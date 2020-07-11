'use strict';

angular
        .module('object.editor', [])
        .factory('editor', function (file) {
            var factory = {};
            var MinispiceEditor = (function(){
                var MinispiceEditor = function(){
                    return new MinispiceEditor.fn.editor();
                }

                MinispiceEditor.fn = MinispiceEditor.prototype = {
                    constructor: MinispiceEditor,

                    editor: function(){
                        this.editors = []; //打开的多个文件
                        this.hideAllEditor = hideAllEditor;
                        this.createEdtior = createEdtior;
                        this.showEditor = showEditor;
                        this.showStartPage = showStartPage;
                        this.getCurrentEditorObject = getCurrentEditorObject;
                        this.clearAllTitleActive = clearAllTitleActive;
                        this.createFileTitle = createFileTitle;
                        this.setFileTitleActive = setFileTitleActive;
                        this.changeFileTitle = changeFileTitle;
                        this.setContent = setContent;
                        this.isFileOpen = isFileOpen;

                        this.hasTheFileInProject = hasTheFileInProject;
                        this.saveCurrentFile = saveCurrentFile;
                        this.saveAllOpenFiles = saveAllOpenFiles;
                        this.saveCurrentContent = saveCurrentContent;
                        this.closeFile = closeFile;
                        this.closeAllFile = closeAllFile;
                        this.startPageInit = startPageInit;
                        this.createStartPage = createStartPage;
                        this.getEditorObject = getEditorObject;
                        this.getEditorArray = getEditorArray;
                        this.undoRedo = undoRedo;
                    }

                }

                MinispiceEditor.fn.editor.prototype = MinispiceEditor.fn;

                return MinispiceEditor;
            })();

            var hideAllEditor = function (editorArrayObject) {
                    angular.forEach(editorArrayObject, function (editorobj) {
                        $(editorobj).hide();
                    });
                },
                showEditor = function (product, fileName, filePath, editorArrayObject, editorID) {
                    //1.show editor
                    for (var i = 0; i < editorArrayObject.length; i++) {
                        if (editorArrayObject[i].id == editorID) {
                            editorArrayObject[i].style.display = "";
                            break;
                        }
                    }
                    //2.show file title
                    changeFileTitle(fileName, filePath, product.openFiles);
                    product.showStartPage = false;
                },
                createEdtior = function (product, fileName, filePath, editorID, editorContainerID, editorArrayObject) {
                    var fileCurrentContent = file.readallsync(filePath);
                    editorContainerID.append("<div id='" + editorID + "' class='editor " + editorArrayObject + "'></div>"); //1.for showing in the UI
                    if(product.editors.editors.length===5)
                        product.editors.editors.splice(0,0,{editorID: editorID, fileName: fileName, filePath: filePath, fileOriginalContent: fileCurrentContent, fileCurrentContent: fileCurrentContent});
                    else
                        product.editors.editors.push(//2. 在这里，如果打开文件超过5个，则插入到第二个位置
                            {editorID: editorID, fileName: fileName, filePath: filePath, fileOriginalContent: fileCurrentContent, fileCurrentContent: fileCurrentContent}); //for comparing content of the editor with old and new
                    setMode_Minispice(editorID);
                    setContent(editorID, fileCurrentContent); //4.
                    createFileTitle(fileName, filePath, editorID, product.openFiles); //5.
                    product.showStartPage = false;
                },
                showStartPage = function (product, fileName, filePath) {
                    var editorArrayObject = getEditorArray(product.productName);
                    hideAllEditor(editorArrayObject);
                    changeFileTitle(fileName, filePath, product.openFiles);
                    product.showStartPage = true;
                },
                getCurrentEditorObject = function (product) {
                    var fileObj = {fileName:'', filePath:''},
                        editorObject = null;
                    for (var i = 0; i < product.openFiles.length; i++) {
                        if (product.openFiles[i].class === 'active') {
                            fileObj.fileName = product.openFiles[i].fileName;
                            fileObj.filePath = product.openFiles[i].filePath;
                            break;
                        }
                    }
                    for (var j = 0; j < product.editors.editors.length; j++) {
                        if (product.editors.editors[j].fileName === fileObj.fileName && product.editors.editors[j].filePath === fileObj.filePath) {
                            editorObject = product.editors.editors[j];
                            break;
                        }
                    }
                    if (fileObj.fileName === 'Start Page')
                        editorObject = {editorID:"", fileName: "Start Page", filePath: "startpage"}
                    return editorObject;
                },
                clearAllTitleActive = function (openFiles) {
                    angular.forEach(openFiles, function (file) {
                        file.class = "";
                    });
                },
                colorObject = ['#7cdeca', '#f8f052', '#f680fc', '#eaaa34', '#c7e79a', '#5ef0e9', '#dbb798', '#defd8f', '#d6c80a', '#a9dd6e', '#3effea', '#fee0d8'],
                getRandomColor = function(){
                    return '#'+(Math.random()*0xffffff<<0).toString(16);
                },
                createFileTitle = function (fileName, filePath, editorID, openFiles) {
                    clearAllTitleActive(openFiles);
                    openFiles.push({"fileName": fileName, "filePath": filePath, "editorID": editorID, "class": "active", "color":""});
                },
                setFileTitleActive = function (fileName, filePath, openFiles) {
                    angular.forEach(openFiles, function (file) {
                        if (file.fileName === fileName && file.filePath === filePath)
                            file.class = "active";
                    });
                },
                changeFileTitle = function (fileName, filePath, openFiles) {
                    clearAllTitleActive(openFiles);
                    setFileTitleActive(fileName, filePath, openFiles);
                },
                setContent = function (editorID, content) {
                    var editor = ace.edit(editorID);
                    editor.getSession().setValue(content);
                },
                setMode_Minispice = function (editorID) {
                    var editor = ace.edit(editorID);
                    editor.setTheme("ace/theme/apsys");
                    editor.getSession().setMode("ace/mode/apsys");
                },
                isFileOpen = function (fileName, filePath, openFiles) {
                    var isopen = false;
                    angular.forEach(openFiles, function (file) {
                        if (file.fileName === fileName && (file.filePath === filePath || file.filePath === filePath.replace(/\\/g, '\\\\')))
                            isopen = true;
                    });
                    return isopen;
                },
                hasTheFileInProject = function(product, fileType){
                    var hasFile = [],
                        files = [];
                    if(product.newPath !== "")
                        files = file.readfoldersync(product.newPath);
                    angular.forEach(files, function(eachfile){
                        if(product.getExtensionName(eachfile) === fileType){
                            hasFile.push(eachfile);
                        }
                    });
                    return hasFile;
                },
                saveCurrentFile = function (product) {
                    var editorObject = getCurrentEditorObject(product);
                    if (editorObject !== null && editorObject.fileName !== 'Start Page') {
                        var filepath = editorObject.filePath;
                        var data = ace.edit(editorObject.editorID).getValue();
                        if (editorObject.fileOriginalContent !== data) {
                            file.writeall(filepath, data, function (err) {
                                if (err)
                                    alert(err);
                                else {
                                    for (var i = 0; i < product.editors.editors.length; i++) {
                                        if (editorObject.fileName === product.editors.editors[i].fileName) {
                                            product.editors.editors[i].fileOriginalContent = data;
                                            product.editors.editors[i].fileCurrentContent = data;
                                        }
                                    }
                                    //alert("Save OK!");
                                }
                            });
                        }
                    }
                },
                saveAllOpenFiles = function (product,isCloseProject) { //call this function when close project
                    for (var i = 0; i < product.editors.editors.length; i++) {
                        if (product.editors.editors[i].fileCurrentContent !== product.editors.editors[i].fileOriginalContent) {
                            product.editors.editors[i].fileOriginalContent = product.editors.editors[i].fileCurrentContent;
                            file.writeallsync(product.editors.editors[i].filePath,product.editors.editors[i].fileCurrentContent);
                        }
                    }
                    if(!isCloseProject)
                        alert("Save OK!");
                },
                saveCurrentContent = function(product){ //call this function after Paste, Cut, Undo, Redo, MaterDefine, CommentOut, RemoveComment
                    var editorObject = getCurrentEditorObject(product);
                    if (editorObject !== null && editorObject.fileName !== 'Start Page') {
                        var data = ace.edit(editorObject.editorID).getValue();
                        for (var i = 0; i < product.editors.editors.length; i++) {
                            if (editorObject.fileName === product.editors.editors[i].fileName) {
                                product.editors.editors[i].fileCurrentContent = data;
                                break;
                            }
                        }
                    }
                },
                closeFile = function (product, fileName, filePath, editorArrayObject) {
                    var isCurrentFile = false,
                        openFiles = product.openFiles;
                    for (var i = 0; i < openFiles.length; i++) {
                        if (openFiles[i].fileName === fileName && openFiles[i].filePath === filePath) {
                            if (openFiles[i].class === 'active')
                                isCurrentFile = true;
                            if (filePath !== "startpage") {
                                for (var j = 0; j < editorArrayObject.length; j++) {
                                    //due to get keyword in editor, the editorID must be format 'name@in', so here need to analysis
                                    var tname = editorArrayObject[j].id.split(product.productName)[1],
                                        tname2 = tname.split("88888");
                                    var tindex = tname2[tname2.length-1].split("99999");
                                    if (tindex[0]+"."+tindex[1] === fileName && openFiles[i].editorID === editorArrayObject[j].id) {
                                        editorArrayObject[j].remove(); //2.delete the editor
                                        break;
                                    }
                                }
                            }
                            openFiles.splice(i, 1);      //1.delete the fileTitle
                            break;
                        }
                    }
                    for(var m=0; m<product.editors.editors.length; m++){
                        if(product.editors.editors[m].fileName === fileName && product.editors.editors[m].filePath === filePath){
                            product.editors.editors.splice(m,1); //delete editor factory from product.editors.editors array
                            break;
                        }
                    }
                    if (isCurrentFile && openFiles.length !== 0) {
                        var lastFile = openFiles[openFiles.length - 1];
                        lastFile.class = "active";
                        for (var i = 0; i < editorArrayObject.length; i++) {
                            if (editorArrayObject[i].id === lastFile.editorID) {
                                editorArrayObject[i].style.display = "";
                                break;
                            }
                        }
                        if (lastFile.filePath === "startpage") {
                            product.showStartPage = true;
                        } else {
                            product.showStartPage = false;
                        }
                    }
                    if (openFiles.length === 0) {
                        product.showStartPage = true;
                        startPageInit(openFiles);
                    }

                },

                closeAllFile = function (editorContainer, openFiles) {
                    openFiles.splice(0, openFiles.length);
                    editorContainer.empty(); //delete all editor
                    startPageInit(openFiles);
                },
                startPageInit = function (openFiles) {
                    openFiles.push({"fileName": "Start Page", "filePath": "startpage", "class": "active", "editorID": ""});
                },
                createStartPage = function (product) {
                    var editorArrayObject = getEditorArray(product.productName);
                    hideAllEditor(editorArrayObject);
                    clearAllTitleActive(product.openFiles);
                    startPageInit(product.openFiles);
                    product.showStartPage = true;
                },
                getEditorObject = function (productName, fileName, filePath) {
                    var index = fileName.lastIndexOf('.');
                    return {
                        //editorID = 'editor_[productName]_[filePath]_[fileName]'
                        editorID: "editor_" + productName + "_" + filePath.replace(":","").replace(".","").replace(/\\\\/g,"88888") + '88888' + fileName.substr(0,index) + "99999" + fileName.substr(index+1),//due to get keyword in editor, the editorID must be format 'name111111in'
                        editorContainerID: $("#editorContainer_" + productName),
                        editorArrayObject: "editor_"+ productName
                    };
                },
                getEditorArray = function (productName) {
                    return $(".editor_" + productName);
                },
                undoRedo = function(product){
                    var editor = ace.edit(product.editors.getCurrentEditorObject(product).editorID);
                    if(editor.session.$undoManager.$redoStack.length!==0){
                        // product.navigations[1].menus[1].useable = true; //redo open
                        // product.quickMenus[5].disabled = "";
                    }else{
                        // product.navigations[1].menus[1].useable = false; //redo close
                        // product.quickMenus[5].disabled = "disabled";
                    }
                    if(editor.session.$undoManager.$undoStack.length!==0){
                        // product.navigations[1].menus[0].useable = true; //undo open
                        // product.quickMenus[4].disabled = "";
                    }else{
                        // product.navigations[1].menus[0].useable = false; //undo close
                        // product.quickMenus[4].disabled = "disabled";
                    }
                };

            factory.createMinispiceEditor = function () {
                return MinispiceEditor();
            };

            return factory;
        });