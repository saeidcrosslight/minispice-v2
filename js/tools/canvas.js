/*
    This file deal with methods of the current paper.
    Methods: create(paperId) / 
             showGuide(guideObj) / 
             hideGuide(guideObj) / 
             freshGuide(guideObj)
    author: Alice (xuling@crosslight.com.cn)
    date: 2020-2-13
*/
'use strict';

angular
        .module('tool.canvas', [])
        .factory('canvas', ['$rootScope', function ($rootScope) {
                var factory = {};
                var ToolCanvas = (function(){
                    var ToolCanvas = function(){
                        return new ToolCanvas.fn.canvas();
                    };
    
                    ToolCanvas.fn = ToolCanvas.prototype = {
                        constructor: ToolCanvas,
                        
                        canvas: function(){
                            this.create = function(paperId){
                                $('#paper').append('<div id='+paperId+'></div>'); //this need be added in document before create paper!
                                let paper = new joint.dia.Paper({
                                    el: $('#'+paperId),
                                    model: $rootScope.minispice.graph,
                                    width: 2000,
                                    height: 1400,
                                    gridSize: 10,
                                    drawGrid: {name: 'doubleMesh', args:[{color: 'black', thickness: 0.1}, { color: '#000', scaleFactor: 10, thickness: 0.5 }]},
                                    interactive: function(cellView, method) {
                                        if(cellView.model.attributes.type == 'standard.Circle'){
                                            return;
                                        }
                                        return cellView instanceof joint.dia.ElementView; // Only allow interaction with joint.dia.ElementView instances.
                                    },
                                });

                                let guide = this._createGuide(0,0);
                                this.hideGuide(guide);
                                return {paper: paper, guide: guide};
                            };

                            this.showGuide = function(guideObj){
                                $.each($("#v-3")[0].children, function(aindex, com){
                                    if(($(com).attr('model-id')) == guideObj.horizontalLine.id || ($(com).attr('model-id')) == guideObj.verticalLine.id){
                                        com.style.display='';
                                    }
                                });
                            };

                            this.hideGuide = function(guideObj){
                                $.each($("#v-3")[0].children, function(aindex, com){
                                    if(($(com).attr('model-id')) == guideObj.horizontalLine.id || ($(com).attr('model-id')) == guideObj.verticalLine.id){
                                        com.style.display='none';
                                    }
                                });
                            };

                            this.freshGuide = function(guide,x,y){
                                guide.horizontalLine.set('target', {x: 0, y: y});
                                guide.horizontalLine.set('source', {x: 2000, y: y});
                                guide.verticalLine.set('target', {x: x, y: 0});
                                guide.verticalLine.set('source', {x: x, y: 2000});
                            };
                        },
                        _createGuide: function(x,y){
                            let horizontalLine = new joint.dia.Link(),
                                verticalLine = null;
                            horizontalLine.set('target', {x: 0, y: y});
                            horizontalLine.set('source', {x: 2000, y: y});
                            horizontalLine.attr('.connection/stroke', 'blue');
                            horizontalLine.attr('.connection/strokeDasharray', '3,3');
                            horizontalLine.attr({'.connection': {"pointerEvents" : 'none'}});
                            horizontalLine.addTo($rootScope.minispice.graph);
                            this._hideLinkArrow(horizontalLine);

                            verticalLine = horizontalLine.clone();
                            verticalLine.set('target', {x: x, y: 0});
                            verticalLine.set('source', {x: x, y: 2000});
                            verticalLine.addTo($rootScope.minispice.graph);
                            this._hideLinkArrow(verticalLine);
                            return {horizontalLine:horizontalLine, verticalLine:verticalLine};
                        },
                        _hideLinkArrow: function(link){
                            $.each($("#v-3")[0].children, function(aindex, com){
                                if(($(com).attr('model-id')) == link.id){
                                    com.children[6].style.display='none';
                                    com.children[5].style.display='none';
                                    com.children[4].style.display='none';
                                    com.children[3].style.display='none';
                                }
                            });
                        }
    
                    };
    
                    ToolCanvas.fn.canvas.prototype = ToolCanvas.fn;
    
                    return ToolCanvas;
                })();

                factory.create = function () {
                    return ToolCanvas();
                };

                return factory;
            }]);