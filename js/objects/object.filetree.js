'use strict';

angular
        .module('object.filetree', [])
        .factory('filetree', ['$rootScope', 'file', 'childprocess', function ($rootScope, file, childprocess) {
                var factory = {};
                var MinispiceFiletree = (function(){
                    var MinispiceFiletree = function(){
                        return new MinispiceFiletree.fn.filetree();
                    }
    
                    MinispiceFiletree.fn = MinispiceFiletree.prototype = {
                        constructor: MinispiceFiletree,
    
                        filetree: function(){                            
                            
                            this.filetrees = []; //打开的多个文件
                        }
    
                    }
    
                    MinispiceFiletree.fn.filetree.prototype = MinispiceFiletree.fn;
    
                    return MinispiceFiletree;
                })();

                factory.createMinispiceFiletree = function () {
                    return MinispiceFiletree();
                };

                return factory;
            }]);