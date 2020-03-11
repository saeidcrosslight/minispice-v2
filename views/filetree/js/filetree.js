angular.module('filetree', [])

    .controller('filetreeController', ['$scope', '$rootScope', 'file', function ($scope, $rootScope, file) {

        $scope.openFileInEditor = function (fileName, filePath) {
            switchToEditorTool();
             var minispice = $rootScope.minispice,
             filepath = filePath;
             minispice.filetree.openFile(minispice, fileName, filepath);
         };

        $scope.treeNodeClick = function (type, fileName, filePath, treeType, event) {
            if (type === "file" || type === "sysfile") {
                $(".filetreestyle span").css("background-color", "#fff");
                $(".filetreestyle span").css("border", "none");
                $(".filetreestyle span").css("color", "#333");
                $(".filetreestyle i").css("color", "#333");
            }
        };

        var switchToEditorTool = function () {
            if ($("#drawingTool").parent()[0].style.display !== 'none') {
                $("#regionContent").layout("collapse", "west");//show wizard pannel
            }
        };
    }])

    .directive('filetree', function() {
        return {
            restrict: "E",
            templateUrl: "./views/filetree/page/filetree.html"
        };
    });


