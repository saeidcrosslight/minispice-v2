'use strict';

angular
        .module('object.component', [])
        .factory('component', ['$rootScope',function ($rootScope) {
            var factory = {};
            var MinispiceComponent = (function(){
                var MinispiceComponent = function(){
                    return new MinispiceComponent.fn.component();
                }

                MinispiceComponent.fn = MinispiceComponent.prototype = {
                    constructor: MinispiceComponent,

                    component: function(){                            
                        this.id = '';
                        this.type = '';
                        this.labels = [];    //all labels for each component
                        this.position = {};
                        this.shapeObj = null; //the shape object
                        this.linkNodes = []; //all link nodes in each component, it is a small circle, like:[{id:,position:,rectObj:}]
                        this.otherParameters = [];
                        this.createShape = function(shapeName,x,y){
                            this.id = this.createLabelName(shapeName);
                            this.type = shapeName;
                            this.labels.push(this.id);
                            this.position = {x:x,y:y};
                            let sp = this._createShape(shapeName,this.id,x,y);
                            //console.log(sp)
                            return {shape:sp,linkNodes:this.linkNodes};
                        }
                    },

                    _createShape: function(shapeName,labelName,x,y){
                        var shape = new joint.shapes.standard.Image();
                        shape.position(x-40, y-10);
                        shape.resize(60, 60);
                        shape.attr({
                            image: {
                                xlinkHref: "images/MiniSpice_quick/"+shapeName+"_default.png",
                                magnet: true
                            },
                            label: {
                                text: labelName,
                                fontSize: 20,
                                'ref-x': 65, 
                                'ref-y': -50,
                                fill: 'black'
                            },
                            
                        });
                        //处理创建图形上的连接点
                        this.createLinkNode(shapeName, x, y);
                        this.shapeObj = shape;
                        return shape;                        
                    },

                    createLinkNode: function(shapeName, x, y){
                        var dots = [];
                        switch(shapeName){
                            case 'capacitor': 
                                dots = [{x: x-14, y: y-10},{x:x-14, y: y+50}]; //capacitor has 2 link nodes
                                break;
                            case 'ground':
                                this.linkNodes.push(this.createCircle(x-14, y));
                                break;
                            case 'resistor':
                                dots = [{x: x-14, y: y-10}, {x:x-14, y:y+50}]; //resistor has 2 link nodes
                                break;
                            case 'inductor':
                                dots = [{x: x-17, y:y-10}, {x:x-17, y:y+50}]; //inductor has 2 link nodes
                                break;
                            case 'diode':
                                dots = [{x: x-2, y:y-10}, {x:x-2, y:y+50}]; //diode has 2 link nodes                                
                                break;
                            default:
                                break;
                        }
                        if(shapeName!='ground'){
                            this.linkNodes.push(this.createCircle(dots[0].x, dots[0].y));
                            this.linkNodes.push(this.createCircle(dots[1].x, dots[1].y));
                        }
                            
                    },

                    createCircle: function(x,y){ //rectangle for linke node
                        var circle = new joint.shapes.standard.Circle();
                            circle.position(x, y);
                            circle.resize(8, 8);
                            //circle.attr('body/fill','blue');
                        return circle;
                    },

                    createLabelName: function(type){
                        var num = 1;
                        var cobj = $rootScope.minispice.papers[0].components;
                        $.each(cobj,function(idx, obj){
                            if(obj.type == type)
                                num++;
                        });
                        return '' + type + num;
                    },

                }

                MinispiceComponent.fn.component.prototype = MinispiceComponent.fn;

                return MinispiceComponent;
            })();       

            factory.createComponent = function () {
                return MinispiceComponent();
            };

            return factory;
        }]);