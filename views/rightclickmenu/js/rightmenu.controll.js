'use strict'

angular.module('rightmenu.controller', [])
        .controller('rightmenuController', ['$rootScope', '$scope', 'canvas', function ($rootScope, $scope, canvas) {

            $scope.rightClickEvent = function (menuid, name, filePath, treeType) {

                switch (menuid) {
                    case 0:
                        deleteLink();
                        break;
                }
            };
                
            const deleteLink = function(){
                $rootScope.minispice.papers[0].rightclickLinkObject.remove();
                $rootScope.minispice.papers[0].rightclickLinkObject = null;
                $(".rightmenu").hide();
            }

            }]);