'use strict';

angular
        .module('header.directive', [])
        .directive('circuitDrawingHeader', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/header/page/header.html'
            };
        })
        
