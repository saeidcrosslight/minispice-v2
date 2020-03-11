'use strict'

angular.module('rightmenu.controller', [])
        .controller('rightmenuController', ['$rootScope', '$scope', 'canvas', function ($rootScope, $scope, canvas) {
                
            $scope.deleteLink = function(){
                $rootScope.minispice.papers[0].rightclickLinkObject.remove();
                $rootScope.minispice.papers[0].rightclickLinkObject = null;
                $(".rightmenu").hide();
            }

            }]);