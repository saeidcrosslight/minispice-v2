
angular
        .module('editor.controller', [])
        .controller('editorController', ['$scope', '$rootScope', 'file', function ($scope, $rootScope, file) {

                showFileFunction = function (product, fileName, filePath, editorID) {
                    var editorArrayObject = product.editors.getEditorArray(product.productName);
                    product.editors.hideAllEditor(editorArrayObject);
                    if (filePath === 'startpage') {
                        product.editors.showStartPage(product, fileName, filePath, editorArrayObject);
                    } else {
                        product.editors.showEditor(product, fileName, filePath, editorArrayObject, editorID);
                        product.editors.undoRedo(product);
                    }
                    $("#editorID").val(editorID);
                };

                $scope.showFile = function (product, fileName, filePath, editorID) {
                    //showFileFunction(product, fileName, filePath, editorID);
                    product.refreshUndoRedo(product);
                    product.setFont();
                    showFileFunction(product, fileName, filePath, editorID);
                    calculateEditorWidthByEditorClick(fileName,1);
                };

                $scope.closeFile = function (product, fileName, filePath) {
                    var editorArrayObject = product.editors.getEditorArray(product.productName);
                    product.editors.closeFile(product, fileName, filePath, editorArrayObject);
                    // product.editors.undoRedo(product);
                    product.refreshUndoRedo(product);
                    calculateEditorWidthByEditorClick(fileName,2)

                };

            calculateEditorWidthByEditorClick = function (fileName, type) {
                var tabs = '[id="filetitle"]';
                var tabAreaWidth = $(".panel-title").width();
                var tabWidths = 100;
                var temp = $(tabs).closest( "div" );
                var activeDiv;
                $.each(temp, function(i,e){
                    if(!$(e).hasClass("ng-hide")){
                        activeDiv = e;
                    }
                });
                var allHiddenLi = $(activeDiv).find("ul.filetitle li:hidden");
                //var allLi = $(activeDiv).find("ul.filetitle li");
                if (allHiddenLi.length > 0) {
                    var allActiveLi = $(activeDiv).find("ul.filetitle li:visible");
                    var selectedElement ;
                    var selectedIndex;

                    switch (type){
                        case 1:
                            $.each($(allHiddenLi), function (idx, obj) {
                                if ($(obj).children("a").text() == fileName) {
                                    selectedElement = $(obj);
                                    selectedIndex  = idx;
                                }
                            });
                            $(selectedElement).show();
                            allActiveLi.push(selectedElement);
                            allHiddenLi.splice(selectedIndex, 1);
                            //Add Up the Tabs' Widths
                            $.each($(allActiveLi), function (idx, obj) {
                                tabWidths += $(obj).outerWidth(); //padding
                            });

                            //Find out which ones to hide
                            while (tabWidths > tabAreaWidth) {
                                var hider = $(allActiveLi).first();
                                tabWidths -= $(hider).outerWidth();
                                $(hider).hide();
                                allHiddenLi.push(hider);
                                allActiveLi.splice(0, 1);

                            }
                            break;
                        case 2:
                            var selectedWidth
                            $.each($(allActiveLi), function (idx, obj) {
                                tabWidths += $(obj).outerWidth();

                                if ($(obj).children("a").text() == fileName) {
                                    selectedElement = $(obj);
                                    selectedIndex = idx;
                                    selectedWidth = $(obj).outerWidth()
                                }
                            });
                            tabWidths -= selectedWidth;
                            allActiveLi.splice(selectedIndex, 1);
                            //Find out which ones to hide
                            var adder;
                            while(tabWidths + $(allHiddenLi).last().outerWidth() <= tabAreaWidth && $(allHiddenLi).length ) {
                                adder = $(allHiddenLi).last();
                                tabWidths += $(adder).outerWidth();
                                $(adder).show();
                                allActiveLi.push(adder);
                                allHiddenLi.splice(allHiddenLi.length-1,1);

                            }
                            break;

                    }
                }
            };

                $scope.showRecentPage = function (product, isShow) {
                    product.showRecentFile = isShow;
                };

                $scope.openRecentFile = function (product, fileName, filePath) {
                    var productName = product.productName;
                    product.deleteRecentFile(productName, fileName, filePath);
                    product.recentFiles = product.getRecentFile(productName);
                    if (!file.existsfile(filePath)) {
                        alert("This file is not exist, may be deleted.");
                    } else {
                        var lastIndex = filePath.lastIndexOf("\\");
                        var newFilePath = filePath.substr(0, lastIndex-1);
                        product.filetree.openFileWithEditor(product, fileName, filePath, product.editors.getEditorObject(productName, fileName, newFilePath), 1);
                        $scope.showFile(product, fileName, filePath, product.editors.getEditorObject(productName, fileName, newFilePath).editorID);//to fresh font-size of editor
                    }
                };

            }]);