'use strict'

angular.module('rightmenu.controller', [])
        .controller('rightmenuController', ['$rootScope', '$scope', 'canvas', 'component', function ($rootScope, $scope, canvas, component) {

            $scope.rightClickEvent = function (menuid, name) {

                switch (menuid) {
                    case 0:
                        deleteLink();
                        break;
                    case 1:
                        console.log('update');
                        break;
                    case 2:
                        console.log('test');
                        break;
                    case 3:
                        console.log('testmenu');
                        break;
                    case 4:
                        deleteComponent();
                        break;
                    case 5:
                        console.log('change component type');
                        break;
                    case 6:
                        modifyComponent();
                        break;
                    case 7:
                        rotateComponent();
                        break;
                }
            };
                
            const deleteLink = function(){
                let paper = $rootScope.minispice.papers[0];
                //make nodes show if adjacent wires are removed
                let source = paper.rightclickLinkObject.model.attributes.source;
                let target = paper.rightclickLinkObject.model.attributes.target;
                for(let i = 0; i < paper.components.length; i++){
                    if(Math.abs(source.x - paper.components[i].linkNodes[0].attributes.position.x) <= 5 && Math.abs(source.y - paper.components[i].linkNodes[0].attributes.position.y) <= 5){
                        $("g[model-id='"+paper.components[i].linkNodes[0].attributes.id+"']").show();
                    }
                    if(Math.abs(target.x - paper.components[i].linkNodes[0].attributes.position.x) <= 5 && Math.abs(target.y - paper.components[i].linkNodes[0].attributes.position.y) <= 5){
                        $("g[model-id='"+paper.components[i].linkNodes[0].attributes.id+"']").show();
                    }
                    if(paper.components[i].type != 'ground'){
                        if(Math.abs(source.x - paper.components[i].linkNodes[1].attributes.position.x) <= 5 && Math.abs(source.y - paper.components[i].linkNodes[1].attributes.position.y) <= 5){
                            $("g[model-id='"+paper.components[i].linkNodes[1].attributes.id+"']").show();
                        }
                        if(Math.abs(target.x - paper.components[i].linkNodes[1].attributes.position.x) <= 5 && Math.abs(target.y - paper.components[i].linkNodes[1].attributes.position.y) <= 5){
                            $("g[model-id='"+paper.components[i].linkNodes[1].attributes.id+"']").show();
                        }
                    }

                }
                for(let i = 0; i < paper.links.length; i++){
                    let a = paper.links[i].attributes.source;
                    let b = paper.links[i].attributes.target;
                    if(source.x == paper.links[i].attributes.source.x && source.y == paper.links[i].attributes.source.y && target.x == paper.links[i].attributes.target.x && target.y == paper.links[i].attributes.target.y){
                        paper.links.splice(i, 1);
                    }
                }
                paper.rightclickLinkObject.remove();
                paper.rightclickLinkObject = null;
                $(".rightmenu").hide();
            };

            const modifyComponent  = function () {
                let indexOfPaper;
                let indexOfComponent;
                $.each($rootScope.minispice.papers,function(pindex,pobj){
                    if(pobj.isShow){
                        indexOfPaper = pindex;
                        $.each(pobj.components,function(cindex,cobj){
                            if(cobj.shapeObj.cid == $rootScope.minispice.papers[0].rightclickComponentObject.model.cid){
                                indexOfComponent = cindex;
                            }
                        })
                    }
                });
                let currentComponents = $rootScope.minispice.papers[indexOfPaper].components[indexOfComponent];
                $rootScope.minispice.selectedComponentToModify = angular.copy(currentComponents.otherParameters);
                $rootScope.minispice.selectedComponentToModify.indexOfPaper = indexOfPaper;
                $rootScope.minispice.selectedComponentToModify.indexOfComponent = indexOfComponent;
                $("#editCircuitComponentData").modal('toggle');
                $rootScope.minispice.papers[0].rightclickComponentObject = null;
                $(".rightmenu").hide();

            };

            const deleteComponent = function(){
                let indexOfPaper;
                let indexOfComponent;
                $.each($rootScope.minispice.papers,function(pindex,pobj){
                    if(pobj.isShow){
                        indexOfPaper = pindex;
                        $.each(pobj.components,function(cindex,cobj){
                            if(cobj.shapeObj.cid == $rootScope.minispice.papers[0].rightclickComponentObject.model.cid){
                                indexOfComponent = cindex;
                                $.each(cobj.linkNodes, function(lindex, linkobj){
                                    linkobj.remove();
                                })

                            }
                        })
                    }
                });
                $rootScope.minispice.papers[0].rightclickComponentObject.remove();
                $rootScope.minispice.papers[indexOfPaper].components.splice(indexOfComponent,1);
                $rootScope.minispice.papers[0].rightclickComponentObject = null;
                $(".rightmenu").hide();

            };

            const rotateComponent = function(){
                let indexOfPaper;
                let indexOfComponent;
                let index = 0;
                let comp = component.createComponent();
                $.each($rootScope.minispice.papers,function(pindex,pobj){
                    if(pobj.isShow){
                        indexOfPaper = pindex;
                        $.each(pobj.components,function(cindex,cobj){
                            if(cobj.shapeObj.cid == $rootScope.minispice.papers[0].rightclickComponentObject.model.cid){
                                indexOfComponent = cindex;
                                if(cobj.rotated == 1){
                                    $rootScope.minispice.papers[0].rightclickComponentObject.model.rotate(-90);
                                    //$rootScope.minispice.papers[0].rightclickComponentObject = null;
                                    $(".rightmenu").hide();
                                    cobj.rotated = 0;
                                }
                                else{
                                    $rootScope.minispice.papers[0].rightclickComponentObject.model.rotate(90);
                                   //$rootScope.minispice.papers[0].rightclickComponentObject = null;
                                    $(".rightmenu").hide();
                                    cobj.rotated+= 1;
                                }
                                $.each(cobj.linkNodes, function(lindex, linkobj){
                                    linkobj.attr('fill','white'); //this doesn't always work properly; not sure why
                                    linkobj.attr('stroke','black');
                                    $("g[model-id='"+linkobj.id+"']").show();
                                    if(cobj.type == 'capacitor' || cobj.type == 'resistor') {
                                        if (cobj.rotated == 1) {
                                            if(cobj.moved == true) {
                                                if (index == 0) {
                                                    linkobj.position(cobj.position.x - 45, cobj.position.y + 20);
                                                    index++;
                                                } else if (index == 1) {
                                                    linkobj.position(cobj.position.x + 16, cobj.position.y + 20);
                                                    index = 0;
                                                }
                                            }
                                            else{
                                                if (index == 0) {
                                                    linkobj.position(cobj.position.x - 45, cobj.position.y + 20);
                                                    index++;
                                                } else if (index == 1) {
                                                    linkobj.position(cobj.position.x + 16, cobj.position.y + 20);
                                                    index = 0;
                                                }
                                            }
                                        }
                                        else { //if you rotate, and rotate back this is relevant
                                            if(cobj.moved == false) {
                                                if (index == 0) {
                                                    linkobj.position(cobj.position.x - 14, cobj.position.y - 10);
                                                    index++;
                                                } else if (index == 1) {
                                                    linkobj.position(cobj.position.x - 14, cobj.position.y + 50);
                                                    index = 0;
                                                }
                                            }
                                            else{
                                                if (index == 0) {
                                                    linkobj.position(cobj.position.x - 14, cobj.position.y -11);
                                                    index++;
                                                } else if (index == 1) {
                                                    linkobj.position(cobj.position.x - 14, cobj.position.y + 49);
                                                    index = 0;
                                                }
                                            }
                                        }
                                    }

                                    if(cobj.type == 'inductor') {
                                        if (cobj.rotated == 1) {
                                            if(cobj.moved == true) {
                                                if (index == 0) {
                                                    linkobj.position(cobj.position.x - 45, cobj.position.y + 17);
                                                    index++;
                                                } else if (index == 1) {
                                                    linkobj.position(cobj.position.x + 16, cobj.position.y + 17);
                                                    index = 0;
                                                }
                                            }
                                            else{
                                                if (index == 0) {
                                                    linkobj.position(cobj.position.x - 45, cobj.position.y + 17);
                                                    index++;
                                                } else if (index == 1) {
                                                    linkobj.position(cobj.position.x + 16, cobj.position.y + 17);
                                                    index = 0;
                                                }
                                            }
                                        }
                                        else { //if you rotate, and rotate back this is relevant
                                            if(cobj.moved == false) {
                                                if (index == 0) {
                                                    linkobj.position(cobj.position.x - 16, cobj.position.y - 10);
                                                    index++;
                                                } else if (index == 1) {
                                                    linkobj.position(cobj.position.x - 16, cobj.position.y + 50);
                                                    index = 0;
                                                }
                                            }
                                            else{
                                                if (index == 0) {
                                                    linkobj.position(cobj.position.x - 16, cobj.position.y -11);
                                                    index++;
                                                } else if (index == 1) {
                                                    linkobj.position(cobj.position.x - 16, cobj.position.y + 49);
                                                    index = 0;
                                                }
                                            }
                                        }
                                    }if(cobj.type == 'diode') {
                                        if (cobj.rotated == 1) {
                                            if(cobj.moved == true) {
                                                if (index == 0) {
                                                    linkobj.position(cobj.position.x - 45, cobj.position.y + 31);
                                                    index++;
                                                } else if (index == 1) {
                                                    linkobj.position(cobj.position.x + 16, cobj.position.y + 31);
                                                    index = 0;
                                                }
                                            }
                                            else{
                                                if (index == 0) {
                                                    linkobj.position(cobj.position.x - 45, cobj.position.y + 32);
                                                    index++;
                                                } else if (index == 1) {
                                                    linkobj.position(cobj.position.x + 16, cobj.position.y + 32);
                                                    index = 0;
                                                }
                                            }
                                        }
                                        else { //if you rotate, and rotate back this is relevant
                                            if(cobj.moved == false) {
                                                if (index == 0) {
                                                    linkobj.position(cobj.position.x -2, cobj.position.y - 10);
                                                    index++;
                                                } else if (index == 1) {
                                                    linkobj.position(cobj.position.x -2, cobj.position.y + 50);
                                                    index = 0;
                                                }
                                            }
                                            else{
                                                if (index == 0) {
                                                    linkobj.position(cobj.position.x - 2, cobj.position.y -11);
                                                    index++;
                                                } else if (index == 1) {
                                                    linkobj.position(cobj.position.x - 2, cobj.position.y + 49);
                                                    index = 0;
                                                }
                                            }
                                        }
                                    }
                                    if(cobj.type == 'ground') {
                                        if (cobj.rotated == 1) {
                                            if(cobj.moved == true) {
                                                    linkobj.position(cobj.position.x + 5, cobj.position.y + 16);
                                                    index++;
                                            }
                                            else{
                                                    linkobj.position(cobj.position.x + 5, cobj.position.y + 17);
                                                    index++;
                                            }
                                        }
                                        else { //if you rotate, and rotate back this is relevant
                                            if(cobj.moved == false) {
                                                    linkobj.position(cobj.position.x -12, cobj.position.y + 2);
                                                    index++;
                                            }
                                            else{
                                                    linkobj.position(cobj.position.x -12, cobj.position.y + 1);
                                                    index++;
                                            }
                                        }
                                    }
                                    linkobj.attr('fill','white');
                                    linkobj.attr('stroke','black');
                                })
                            }
                            //$rootScope.minispice.papers[0].rightclickComponentObject.model.rotate(90);
                            //$rootScope.minispice.papers[0].rightclickComponentObject = null;
                            //$(".rightmenu").hide();
                        })
                        $rootScope.minispice.papers[0].rightclickComponentObject = null;
                    }
                });
            };


            }]);