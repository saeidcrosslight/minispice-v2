'use strict';

angular
        .module('popwindow.directive', [])



    .directive('editcircuitcomponentdata', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/popwindow/page/editcircuitcomponentdata.html'
            };
        })


        .directive('usersetting', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/popwindow/page/usersetting.html'
            };
        })

        
        .directive('newproject', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/popwindow/page/newproject.html'
            };
        })
        .directive('newcomponents', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/popwindow/page/newcomponents.html'
            };
        });

        
