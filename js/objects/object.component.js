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
                        this.otherParameters = {};
                        this.rotated = 0; //0 is default, 1 is the rotated state
                        this.moved = false;
                        this.createShape = function(shapeName,x,y){
                            this.id = this.createLabelName(shapeName);
                            this.type = shapeName;
                            this.otherParameters = this.addOtherParameter(shapeName);
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
                                magnet: true,
                                pointerEvents: 'none',
                            },
                            label: {
                                text: labelName,
                                fontSize: 20,
                                'ref-x': 65, 
                                'ref-y': -50,
                                fill: 'black',
                            },

                            
                        });
                        if(this.rotated == 1){
                            shape.rotate(90);
                        }
                        //shape.rotate(90);
                        //处理创建图形上的连接点
                        this.createLinkNode(shapeName, x, y);
                        this.shapeObj = shape;
                        return shape;                        
                    },

                    createLinkNode: function(shapeName, x, y){
                        var dots = [];
                        if(this.rotated == 0) {
                            switch (shapeName) {
                                case 'capacitor':
                                    dots = [{x: x - 14, y: y - 10}, {x: x - 14, y: y + 50}]; //capacitor has 2 link nodes
                                    break;
                                case 'ground':
                                    this.linkNodes.push(this.createCircle(x - 14, y));
                                    break;
                                case 'resistor':
                                    dots = [{x: x - 14, y: y - 10}, {x: x - 14, y: y + 50}]; //resistor has 2 link nodes
                                    break;
                                case 'inductor':
                                    dots = [{x: x - 17, y: y - 10}, {x: x - 17, y: y + 50}]; //inductor has 2 link nodes
                                    break;
                                case 'diode':
                                    dots = [{x: x - 2, y: y - 10}, {x: x - 2, y: y + 50}]; //diode has 2 link nodes
                                    break;
                                default:
                                    break;
                            }
                        }
                        else if(this.rotated == 1) {
                            switch (shapeName) {
                                case 'capacitor':
                                    dots = [{x: x - 45, y: y + 20}, {x: x + 16, y: y + 20}]; //capacitor has 2 link nodes
                                    break;
                                case 'ground':
                                    this.linkNodes.push(this.createCircle(x + 5, y + 17));
                                    break;
                                case 'resistor':
                                    dots = [{x: x - 45, y: y + 20}, {x: x + 16, y: y + 20}]; //resistor has 2 link nodes
                                    break;
                                case 'inductor':
                                    dots = [{x: x - 45, y: y + 17}, {x: x + 16, y: y + 17}]; //inductor has 2 link nodes
                                    break;
                                case 'diode':
                                    dots = [{x: x -45, y: y + 32}, {x: x + 16, y: y + 32}]; //diode has 2 link nodes
                                    break;
                                default:
                                    break;
                            }
                        }
                        if(shapeName!='ground'){
                            this.linkNodes.push(this.createCircle(dots[0].x, dots[0].y));
                            this.linkNodes.push(this.createCircle(dots[1].x, dots[1].y));
                        }
                            
                    },

                    createCircle: function(x,y){ //rectangle for link node
                        var circle = new joint.shapes.standard.Circle();
                        circle.position(x, y);
                        circle.resize(8, 8);
                        circle.attr({body:{
                               elementMove: "disabled",
                            }
                        });
                        //circle.attr({elementMove: false})
                        //circle.attr({'.connection-wrap': {"pointerEvents": 'none'}});
                        return circle;
                    },

                    compare: function( a, b ) {
                        if ( a.id < b.id ){
                            return -1;
                        }
                        if ( a.id > b.id ){
                            return 1;
                        }
                        return 0;
                    },

                    addOtherParameter: function(shapeName){
                        switch(shapeName){
                            case 'capacitor':
                                return   {
                                    "name": "capacitor",
                                    "indexOfPaper": 0,
                                    "indexOfComponent": 0,

                                    "properties":
                                        {
                                            "Capacitance": 0,
                                            "Voltage Rating": 0

                                        }
                                };
                                break;
                            case 'ground':
                                return {
                                    "indexOfPaper": 0,
                                    "indexOfComponent": 0,
                                    "name": "ground",
                                    "properties":
                                    {
                                        "Global Node": 0,
                                        "COM": 0
                                    }
                                };
                                break;
                            case 'resistor':
                                return   {
                                    "indexOfPaper": 0,
                                    "indexOfComponent": 0,
                                    "name": "resistor",
                                    "properties":
                                        {
                                            "Resistance": 0,
                                            "Tolerance": 0
                                        }
                                };
                                break;
                            case 'inductor':
                                return   {
                                    "indexOfPaper": 0,
                                    "indexOfComponent": 0,
                                    "name": "inductor",
                                    "properties":
                                        {
                                            "Inductance": 0,
                                            "Peak Current": 0

                                        }
                                };
                                break;
                            case 'diode':
                                return   {
                                    "indexOfPaper": 0,
                                    "indexOfComponent": 0,
                                    "name": "diode",
                                    "properties":
                                        {
                                            "Diode": 0
                                        }
                                };
                                break;
                            default:
                                break;
                        }


                    },

                    createLabelName: function(type){
                        var num = 1;
                        var cobj = $rootScope.minispice.papers[0].components;
                        var cptlst = []
                        $.each(cobj,function(idx, obj){
                            if(obj.type == type) {
                                cptlst.push(obj);
                            }
                        });
                        if (cptlst.length >0){

                            cptlst.sort(this.compare);
                            $.each(cptlst,function(idx, obj){
                                    if(num === parseInt(obj.id.match(/\d/g))) {
                                        num++;
                                    }else{
                                        return false;
                                    }
                            });
                        }
                        return '' + type + num;
                    }


                };



                MinispiceComponent.fn.component.prototype = MinispiceComponent.fn;

                return MinispiceComponent;
            })();       

            factory.createComponent = function () {
                return MinispiceComponent();
            };

            return factory;
        }]);