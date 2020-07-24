'use strict'

angular.module('rightmenu.controller', [])
        .controller('rightmenuController', ['$rootScope', '$scope', 'canvas', function ($rootScope, $scope, canvas) {

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
                $rootScope.minispice.papers[0].rightclickLinkObject.remove();
                $rootScope.minispice.papers[0].rightclickLinkObject = null;
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
                $.each($rootScope.minispice.papers,function(pindex,pobj){
                    if(pobj.isShow){
                        indexOfPaper = pindex;
                        $.each(pobj.components,function(cindex,cobj){
                            if(cobj.shapeObj.cid == $rootScope.minispice.papers[0].rightclickComponentObject.model.cid){
                                indexOfComponent = cindex;
                                $.each(cobj.linkNodes, function(lindex, linkobj){
                                    linkobj.rotate(90);
                                })

                            }
                        })
                    }
                });
                $rootScope.minispice.papers[0].rightclickComponentObject.model.rotate(90);
                $rootScope.minispice.papers[0].rightclickComponentObject = null;
                $(".rightmenu").hide();
            };


            }]);