'use strict';

angular
        .module('object.filetree', [])
        .factory('filetree', ['$rootScope', 'file', 'childprocess', function ($rootScope, file, childprocess) {
                var factory = {};
                var MinispiceFiletree = (function(){
                    var MinispiceFiletree = function(){
                        return new MinispiceFiletree.fn.filetree();
                    }
    
                    MinispiceFiletree.fn = MinispiceFiletree.prototype = {
                        constructor: MinispiceFiletree,
    
                        filetree: function(){                            
                            
                            this.filetree = []; //打开的多个文件
                            this.inputfiles = [];
                            this.minispiceInputFileTreeInit = minispiceInputFileTreeInit;
                            this.createAllFileTree = createAllFileTree;
                            this.resetInputFileTree = resetInputFileTree;
                            this.resetInputOutputFileTree = resetInputOutputFileTree;
                            this.resetAllFileTree = resetAllFileTree;
                            this.openFile = openFile;
                            this.openFileWithEditor = openFileWithEditor;
                            this.openFileWithApp = openFileWithApp;
                        }
    
                    }
    
                    MinispiceFiletree.fn.filetree.prototype = MinispiceFiletree.fn;
    
                    return MinispiceFiletree;
                })();

               var minispiceInputFileTreeInit = function () {
                    return [{"id": "dir-1", "title": "Input Files", "type": "folder",
                        "nodes": [
                        ]}];
                },
                createMinispiceInputFileTree = function (files, treeFolder, path) {
                    var solnum = 0;
                    angular.forEach(files, function (data, index) {
                        var exName = getExtensionName(data);
                        if (data[0] !== "~" && ((exName === "sol" && data.split(".").length === 2) || exName === "BAT" || exName === "bat" || exName === "doping" || exName === "gain" || exName === "geo" || exName === "layer" || exName === "mater" || exName === "mplt" || exName === "msh" || exName === "plt" || exName === "gnu" || exName === "json" || exName === "str" || exName === "jsonstack"|| exName === "stg"  || exName === "asc" )) {
                            treeFolder.nodes.push(addTreeNode(index + 1, data, path, "file", "inputfile"));
                        }
                    });
                },
                addTreeNode = function (index, title, path, type, treeType) {
                    return {"id": "file_" + (index), "title": title, "type": type, "nodes": [], "url": (path + "\\" + title).replace(/\\/g, '\\\\'), "treeType": treeType};
                },
                getExtensionName = function (fileName) {
                    var fn = fileName.split(".");
                    return fn[fn.length - 1];
                },

                createAllFileTree = function (productFiletree, projectPath) {
                    var files = file.readfoldersync(projectPath);
                    createMinispiceInputFileTree(files, productFiletree.inputfiles[0], projectPath);
                },
                resetAllFileTree = function (filetree) {
                    resetInputFileTree(filetree);
                },
                resetInputOutputFileTree = function (filetree) {
                    resetInputFileTree(filetree);
                },
                resetInputFileTree = function (filetree) {
                    filetree.inputfiles.splice(0, filetree.inputfiles.length);
                    filetree.inputfiles = new minispiceInputFileTreeInit;
                },
                openFile = function (product, fileName, filePath) {
                    if (!filePath)
                        return;
                    if (!file.existsfile(filePath)) {
                        alert("This file path is not exist.");
                        return;
                    }
                    var num = filePath.lastIndexOf("\\");
                    openFileWithEditor(product, fileName, filePath, product.editors.getEditorObject(product.productName, fileName, filePath.substring(0, num - 1)), 0);
                    // }
                    product.setFont();
                    $("#fixNoRefresh").click();
                    calculateEditorWidthByTreeClick();
                },
                openFileWithEditor = function (product, fileName, filePath, editorObject, type) {
                    product.editors.hideAllEditor($("." + editorObject.editorArrayObject));
                    if (product.editors.isFileOpen(fileName, filePath, product.openFiles)) { //the file is open already
                        product.editors.showEditor(product, fileName, filePath, $("." + editorObject.editorArrayObject), editorObject.editorID);
                    } else {
                        product.editors.createEdtior(product, fileName, filePath, editorObject.editorID, editorObject.editorContainerID, editorObject.editorArrayObject);
                    }
                    $("#editorID").val(editorObject.editorID);
                    //write and update recentfiles
                    if (type === 0) {
                        product.writeRecentFile(product.productName, fileName, filePath);
                        product.recentFiles = product.getRecentFile(product.productName);
                    }
                },
                openFileWithApp = function (appPath, filePath) {
                    childprocess.callbackground(appPath, filePath, '', function () {
                    }, function () {
                    }, function () {
                    });
                },
                calculateEditorWidthByTreeClick = function () {
                    var tabs = '[id="filetitle"]';
                    var tabAreaWidth = $(".panel-title").width();
                    var tabWidths = 100;
                    var temp = $(tabs).closest( "div" )
                    var activeDiv;
                    $.each(temp, function(i,e){
                        if(!$(e).hasClass("ng-hide")){
                            activeDiv = e;
                        }
                    });
                    var allActiveLi = $(activeDiv).find("ul.filetitle li:visible");
                    var allHiddenLi = $(activeDiv).find("ul.filetitle li:hidden");

                    //Add Up the Tabs' Widths
                    $.each($(allActiveLi), function(idx, obj){
                        tabWidths += $(obj).outerWidth(); //padding
                    });
                    //Find out which ones to hide
                    while(tabWidths > tabAreaWidth) {
                        var hider = $(allActiveLi).first();
                        tabWidths -= $(hider).outerWidth();
                        $(hider).hide();
                        allHiddenLi.push(hider);
                        allActiveLi.splice(0,1);
                    }
                };

                factory.createMinispiceFiletree = function () {
                    return MinispiceFiletree();
                };

                return factory;
            }]);