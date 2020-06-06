angular.module('circuit.controller', [])

    .controller('circuitController', ['$scope', '$rootScope', 'file', function ($scope, $rootScope, file) {
        $scope.editCircuitComponent = function () {
            let indexOfPaperToModify = angular.copy($rootScope.minispice.selectedComponentToModify.indexOfPaper);
            let indexOfComponentToModify = angular.copy($rootScope.minispice.selectedComponentToModify.indexOfComponent);
            $rootScope.minispice.papers[indexOfPaperToModify].components[indexOfComponentToModify].otherParameters.properties = angular.copy($rootScope.minispice.selectedComponentToModify.properties);
            $rootScope.minispice.selectedComponentToModify = {};
            $("#editCircuitComponentData").modal('toggle');
        };

        
    }]);


