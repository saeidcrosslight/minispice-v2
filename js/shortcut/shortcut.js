'use strict';

angular
        .module('shortcut.event', [])
        .controller('contentController', ['$rootScope', '$scope', 'file','canvas', function ($rootScope, $scope, file,canvas) {

                let minispice = $rootScope.minispice,
                    cv = canvas.create();
                document.onkeydown = function (event) {
                    var e = event ? event : (window.event ? window.event : null),
                            currKey = 0;
                            //product = simucenter.currentProduct();
                    // var currentEditor = minispice.editors.getCurrentEditorObject(minispice);
                    // if (currentEditor.editorID !== "")
                    //     var editor = ace.edit(currentEditor.editorID);
                    // currKey = e.keyCode || e.which || e.charCode;
                    // if (currKey === 83 && e.ctrlKey) {         //Ctrl+S
                    //     minispice.editors.saveCurrentFile(minispice);
                    // }
                    // minispice.refreshUndoRedo(minispice);
                    // $("#fixNoRefresh").click();
                };
                
                document.onkeyup = function () {//when edit in editor, save current content
                    var minispice = $rootScope.minispice;
                    //minispice.editors.saveCurrentContent(minispice);
                };

                document.onmousedown = function(event){                    
                    if(event.buttons == 2){
                        //reset paintSwitch
                        minispice.paintSwitch.isStartDraw = false;
                        minispice.paintSwitch.type = "";
                        minispice.paintSwitch.cursorIcon = "default";

                        //reset wire tool
                        cv.hideGuide(minispice.papers[0].guide);
                        if(minispice.papers[0].linkObject != null)
                            minispice.papers[0].linkObject.remove(); //remove last fresh when mousemove line
                        minispice.papers[0].startNormalLink = false;
                        minispice.papers[0].normalStartDot = { x: 0, y: 0 };                            
                        minispice.papers[0].normalLastDot = { x: 0, y: 0 };                        
                        minispice.papers[0].linkObject = null;

                        //

                        document.getElementById('paper').style.cursor = "default";
                        //$("#flyPaper").remove();


                    }                    
                }

            }]);