'use strict';

angular
        .module('object.minispice', [])
        .factory('minispice', ['$rootScope', 'filetree', 'editor', 'file', 'childprocess', 'paper', function ($rootScope, filetrees, editor, file, childprocess, paper) {
                //var scene, renderer, camera, controls, morefile, macfile;
                //var fs = require('fs');
                var factory = {};

                var MiniSpice = (function(){
                    var MiniSpice = function(){
                        return new MiniSpice.fn.spice();
                    }

                    MiniSpice.fn = MiniSpice.prototype = {
                        constructor: MiniSpice,

                        spice: function(){
                            this.selectedComponentToModify = {};
                            this.title = 'Welcome to MiniSpice';
                            this.productName = 'Minispice';
                            this.appPathName = 'MiniSpicePath';
                            this.showStartPage = true;
                            this.addedCircuitComponents = [];
                            this.createProject = createProject;
                            this.newPath = "";
                            this.init = _init;
                            this.appPath = '';
                            this.projectPath = '';
                            this.openFiles = [];
                            this.quickMenus = angular.fromJson(file.readallsync("json\\quick\\quick.json"));
                            this.filetree = filetrees.createMinispiceFiletree();      //filetree of the current project
                            this.editors = editor.createMinispiceEditor();         //all opened editors
                            this.fileTitles = [];      //all opened files
                            this.graph = new joint.dia.Graph;
                            this.papers = [];          //all opened papers
                            this.currentPaperId = '';  //the current active paper
                            this.rightMenus = angular.fromJson(file.readallsync("json\\rightmenu\\rightmenu.json"));//right-click memu list
                            this.saveCreatedStructure = saveCreatedStructure;
                            this.paintSwitch = {       //switch of the paintbrush
                                isStartDraw : false,
                                type : null,           //wire, capacitor, ground, resistor, inductor, diode
                                cursorIcon : ''
                            };
                            this.createPaper = function(){
                                var newPaper = this._createPaper();
                                this.papers.push(newPaper);
                                return newPaper;
                            };
                            this.togglePaper = function(){
                                return this._togglePaper();
                            };                            
                        },

                        _createPaper: function(){
                            return paper.createMinispicePaper();
                        },

                        _togglePaper: function(){
                            if ($("#drawingTool").parent()[0].style.display === 'none') 
                                $("#regionContent").layout("expand", "west");
                            else
                                $("#regionContent").layout("collapse", "west");                              
                        },

                        
                        _hideAllPaper: function(){
                            
                        },

                        _getCurrentPaper: function(){
                            
                        },

                        _setPaperOn: function(paperId){

                        },

                        _setPaperOff: function(paperId){

                        }

                    };

                    let createProject = function (projectName, projectPath, fileTypes) {
                        if (file.existsfile(projectPath)) {
                            if (confirm("The project path already exists, are sure use it?")) {
                                angular.forEach(fileTypes, function (fileType) {
                                    var filePath = projectPath + "\\" + projectName + "." + fileType;
                                    if (file.existsfile(filePath)) {
                                        if (confirm("The project file already exists, whether or not to replace it?")) {
                                            file.delfile(filePath);
                                            file.writeallsync(filePath, "");
                                        }
                                    } else {
                                        file.writeallsync(filePath, "");
                                    }
                                });
                            }
                        } else {
                            file.mkdirsync(projectPath);
                            angular.forEach(fileTypes, function (fileType) {
                                file.writeallsync(projectPath + "\\" + projectName + "." + fileType, "");
                            });
                        }
                    };

                    let saveCreatedStructure = function(newPath, newProjectName, addCircuitComponents, fileType){
                        //this.editors.saveAllOpenFiles(this, closeProjectFunction());
                        this.editors.saveCurrentFile(this);

                    };

                    let _init = function () {

                        this.filetree.inputfiles = new this.filetree.minispiceInputFileTreeInit;
                        this.editors.startPageInit(this.openFiles);

                    };

                    MiniSpice.fn.spice.prototype = MiniSpice.fn;

                    return MiniSpice;
                })();

                factory.createMiniSpice = function () {
                    return MiniSpice();
                };
                return factory;
            }]);