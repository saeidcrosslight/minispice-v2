'use strict';

angular
        .module('rightmenu.directive', [])



    .directive('rightmenu', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/rightclickmenu/page/rightmenu.html'
            };
        });
        