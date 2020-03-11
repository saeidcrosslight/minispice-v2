'use strict';

angular
        .module('object.editor', [])
        .factory('editor', function (file) {
            var factory = {};
            var MinispiceEditor = (function(){
                var MinispiceEditor = function(){
                    return new MinispiceEditor.fn.editor();
                }

                MinispiceEditor.fn = MinispiceEditor.prototype = {
                    constructor: MinispiceEditor,

                    editor: function(){                            
                        
                        this.editors = []; //打开的多个文件
                    }

                }

                MinispiceEditor.fn.editor.prototype = MinispiceEditor.fn;

                return MinispiceEditor;
            })();       

            factory.createMinispiceEditor = function () {
                return MinispiceEditor();
            };

            return factory;
        });