'use strict';

angular
        .module('paper.events', [])
        .factory('paperevents', ['$rootScope', 'component', 'drawline', 'file', function ($rootScope, component, drawline, file) {
                var factory = {};
                var PaperEvent = (function(){
                    var PaperEvent = function(){
                        return new PaperEvent.fn.tool();
                    };
                    
                    let draw = drawline.createDrawLineTool();
                    let clicked = false;

                    PaperEvent.fn = PaperEvent.prototype = {
                        constructor: PaperEvent,
                        
                        tool: function(){
                            this.blankPointerDown = function(evt, x, y){
                                $(".rightmenu").hide();
                                if(this._paintType().isStartDraw){
                                    switch (this._paintType().type) {
                                        case 'wire':
                                            $rootScope.minispice.papers[0].nodeClicked = true;
                                            draw.normalLink(x, y);
                                            break;
                                        case 'component':
                                            this._createComponent();
                                            break;
                                        default:
                                            this._createBasicComponent(this._paintType().type, x, y, true, false, false, false);
                                            break;
                                    }
                                }
                            };

                            this.blankContextMenu = function(evt, x, y ){
                                $rootScope.minispice.papers[0].nodeClicked = false;
                                $(".rightmenu").hide();
                                let menus = angular.fromJson(file.readallsync("json\\rightmenu\\rightmenu.json"));
                                $.each(menus, function(mindex, menu){
                                    if(menu.name == 'paper')
                                    $rootScope.minispice.rightMenus = menu.list;
                                });
                                
                                console.log($rootScope.minispice.rightMenus);
                                
                                // console.log('blankContextMenu');
                                // console.log(evt);
                                // console.log(x);
                                // console.log(y);
                            };

                            this.cellPointerDown = function(cellView, evt, x, y ){
                                $(".rightmenu").hide();
                                let guide = $rootScope.minispice.papers[0].guide,
                                    isguide = false,
                                    cellid = cellView.el.attributes[0].value;
                                if(guide.horizontalLine.id == cellid || guide.verticalLine.id == cellid)
                                    isguide = true;
                                
                                let type = cellView.model.attributes.type;
                                if(type == 'standard.Circle' && this._paintType().type == 'wire'){
                                    draw.normalLinkForNode(cellView,x,y);//连线状态下点击了元器件，则显示连线鼠标跟随
                                    //draw.autoLink(type,cellView, x, y);
                                    if($rootScope.minispice.papers[0].handle == true){
                                        $rootScope.minispice.papers[0].nodeClicked = false;
                                    }
                                    $rootScope.minispice.papers[0].handle = false;
                                }

                                else if(type == 'standard.Circle'){
                                    draw.autoLink(type, cellView, x, y);
                                }
                            };
                            
                            this.cellPointerMove = function(cellView, evt, x, y ){//drag the label of component to move
                                if(cellView.model.attributes.type == 'standard.Image'){
                                    this._freshLinkNodesPosition(cellView);
                                }
                                /*if(cellView.model.attributes.type == 'standard.Circle'){
                                    evt.stopPropagation();
                                }*/
                            };

                            this.cellContextMenu = function(cellView, evt, x, y ){
                                $(".rightmenu").hide();
                                let menus = angular.fromJson(file.readallsync("json\\rightmenu\\rightmenu.json"));
                                let menuType;
                                if(cellView.model.attributes.type == 'link'){
                                    $rootScope.minispice.papers[0].rightclickLinkObject = cellView;
                                    menuType = 'link';
                                    $.each(menus, function(mindex, menu){
                                        if(menu.name == menuType) {
                                            $rootScope.minispice.rightMenus = menu.list;
                                        }
                                    });
                                    $rootScope.$apply();
                                    $(".rightmenu").css("top", (y+130)+"px");
                                    $(".rightmenu").css("left", (x+215)+"px");
                                    $(".rightmenu").show();
                                }
                                if(cellView.model.attributes.type == 'standard.Image'){
                                    $rootScope.minispice.papers[0].rightclickComponentObject = cellView;
                                    menuType = 'component'
                                    $.each(menus, function(mindex, menu){
                                        if(menu.name == menuType) {
                                            $rootScope.minispice.rightMenus = menu.list;
                                        }
                                    });
                                    $rootScope.$apply();
                                    $(".rightmenu").css("top", (y+130)+"px");
                                    $(".rightmenu").css("left", (x+215)+"px");
                                    $(".rightmenu").show();
                                }
                                // console.log('cellContextMenu');
                                // console.log(evt);
                                // console.log(x);
                                // console.log(y);
                            };

                            this.elementMouseEnter = function(cellView, evt){
                                // console.log('elementMouseEnter');
                                // console.log(evt);
                            };

                            this.elementMouseOut = function(cellView, evt){
                                // console.log('elementMouseOut');
                                // console.log(evt);
                            };
                        },

                        _createBasicComponent: function(type,x,y,node,rotate,connectedTop, connectedBottom){//draw: capacitor, ground, resistor, inductor, diode
                            //debugger;
                            let newComponent = component.createComponent();
                            if(rotate){
                                newComponent.rotated = 1;
                            }
                            let cpt = newComponent.createShape(type, x, y);
                            this._getGraph().addCell(cpt.shape);
                            this._getGraph().addCells(cpt.linkNodes);
                            if(!node){
                                $("g[model-id='"+cpt.linkNodes[0].attributes.id+"']").hide();
                                if(type != 'ground') {
                                    $("g[model-id='" + cpt.linkNodes[1].attributes.id + "']").hide();
                                }
                            }
                            if(!connectedTop){
                                $("g[model-id='"+cpt.linkNodes[0].attributes.id+"']").show();
                            }
                            if(!connectedBottom && type != "ground"){
                                $("g[model-id='" + cpt.linkNodes[1].attributes.id + "']").show();
                            }

                            $.each(this._getPapers(),function(cindex,cobj){
                                if(cobj.isShow)
                                    cobj.components.push(newComponent);
                            });
                            //$rootScope.minispice.enableSaveButton();
                        },

                        _createComponent: function(){//popwindow to choose a component to create

                        },

                        _freshLinkNodesPosition: function(cellView){
                            let ctype = this._getComponentType(cellView);                                
                            $.each(this._getPapers(),function(pindex,pobj){
                                if(pobj.isShow){
                                    $.each(pobj.components,function(cindex,cobj){
                                        if(cobj.shapeObj.cid == cellView.model.cid){
                                            cobj.moved = true;
                                            let allLinkNodes = $(".joint-type-standard-circle")//界面上所有的小圆圈-连接点
                                            
                                            $.each(cobj.linkNodes, function(lindex, linkobj){
                                                let movedPosition = {x:0, y:0},
                                                    getPos = $("g[model-id='"+cobj.shapeObj.id+"']").attr('transform');//获取图形移动时的坐标
                                                    getPos = getPos.substr(0,getPos.length-1).split('(')[1].split(',');
                                                    movedPosition.x = Number(getPos[0]);
                                                    movedPosition.y = Number(parseInt(getPos[1]));
                                                    cobj.position.x = movedPosition.x +40;
                                                    cobj.position.y = movedPosition.y + 4;
                                                linkobj.attributes.position = movedPosition;//更新保存在component.linknodes对象里的坐标
                                                
                                                $.each(allLinkNodes,function(allindex, lnobj){  //fresh nodelink's position                                                      
                                                    if(($(lnobj).attr('model-id')) == linkobj.attributes.id){
                                                        if(cobj.rotated == 0) {
                                                            let tempX = movedPosition.x + 26,
                                                                tempY = movedPosition.y;
                                                            if (ctype == 'inductor')
                                                                tempX = movedPosition.x + 23;
                                                            if (ctype == 'diode')
                                                                tempX = movedPosition.x + 38;
                                                            if (lindex == 1)
                                                                tempY = movedPosition.y + 60;
                                                            if (ctype == 'ground')
                                                                tempY = movedPosition.y + 10;
                                                            $(lnobj).attr('transform', 'translate(' + tempX + ',' + tempY + ')');
                                                            //Important to update the position of the nodes after transform!
                                                            linkobj.attributes.position.x = tempX;
                                                            linkobj.attributes.position.y = tempY;
                                                        }
                                                        else if(cobj.rotated == 1){
                                                            if(lindex == 0) {
                                                                let tempX = movedPosition.x - 4,
                                                                    tempY = movedPosition.y + 30;
                                                                //let tempX = movedPosition.x + 68,
                                                                //    tempY = movedPosition.y + 30;
                                                                if (ctype == 'inductor')
                                                                    tempY -= 2;
                                                                if (ctype == 'diode')
                                                                    tempY += 10;
                                                                if (ctype == 'ground') {
                                                                    tempY = movedPosition.y + 25;
                                                                    tempX += 50;
                                                                }
                                                                $(lnobj).attr('transform', 'translate(' + tempX + ',' + tempY + ')');
                                                                linkobj.attributes.position.x = tempX;
                                                                linkobj.attributes.position.y = tempY;
                                                            }
                                                            if(lindex == 1) {
                                                                let tempX = movedPosition.x + 56,
                                                                    tempY = movedPosition.y + 30;
                                                                //let tempX = movedPosition.x - 4,
                                                                //    tempY = movedPosition.y + 30;
                                                                if (ctype == 'inductor')
                                                                    tempY -= 2;
                                                                    //tempX = movedPosition.x + 23;
                                                                if (ctype == 'diode')
                                                                    tempY += 10;
                                                                $(lnobj).attr('transform', 'translate(' + tempX + ',' + tempY + ')');
                                                                linkobj.attributes.position.x = tempX;
                                                                linkobj.attributes.position.y = tempY;
                                                            }
                                                        }
                                                    }
                                                });
                                            });
                                            cobj.position.y += 6;
                                        }
                                    })
                                }
                            });
                        },

                        _getComponentType: function(cellView){
                            let str = cellView.model.attributes.attrs.image.xlinkHref;
                            return str.split('/')[2].split('_')[0];
                        },

                        _paintType: function(){
                            return $rootScope.minispice.paintSwitch;
                        },

                        _getPapers: function(){
                            return $rootScope.minispice.papers;
                        },

                        _getGraph: function(){
                            return $rootScope.minispice.graph;
                        }
    
                    };
    
                    PaperEvent.fn.tool.prototype = PaperEvent.fn;
    
                    return PaperEvent;
                })();

                factory.createPaperEventsHandle = function () {
                    return PaperEvent();
                };

                return factory;
            }]);