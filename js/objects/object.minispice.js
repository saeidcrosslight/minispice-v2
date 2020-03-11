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
                            this.title = '';
                            this.appPath = '';
                            this.projectPath = '';
                            this.quickMenus = angular.fromJson(file.readallsync("json\\quick\\quick.json"));
                            this.filetrees = [];       //filetree of the current project
                            this.editors = [];         //all opened editors
                            this.fileTitles = [];      //all opened files
                            this.graph = new joint.dia.Graph;
                            this.papers = [];          //all opened papers
                            this.currentPaperId = '';  //the current active paper
                            this.rightMenus = angular.fromJson(file.readallsync("json\\rightmenu\\rightmenu.json"))[0];      //right-click memu list
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

                    }

                    MiniSpice.fn.spice.prototype = MiniSpice.fn;

                    return MiniSpice;
                })();

                factory.createMiniSpice = function () {
                    return MiniSpice();
                };
                return factory;
            }]);