'use strict';

angular
    .module('object.filereader', [])
    .factory('filereader', ['$rootScope', 'file', 'component', 'paper', 'minispice', 'paperevents', 'canvas', 'drawline',
        function($rootScope, file, component, paper, minispice, paperevents, canvas, drawline){
            let factory = {};
            let filereader =(function(){
                let filereader = function(){
                    return new filereader.fn.reader();
                }

                filereader.fn = filereader.prototype = {
                    constructor: filereader,

                    reader: function(){
                        this.readAscFile = readAscFile;
                        this.parseData = parseData;
                        this.createComponents = createComponents;
                    }
                }

                filereader.fn.reader.prototype = filereader.fn;

                return filereader;



            })();
            //var fs = require('fs');
            //var path = require('path');


            var readAscFile = function(filePath){
                    if (filePath === "")
                        console.log("empty");
                    var newFilePath = filePath.replace(/\\/g, '\\\\');
                    var str;
                    file.readall(newFilePath, (err, data) =>{
                        parseData(data);
                    });

                },

                parseData = function(str){
                    //idea: have an array of each type of component, and each component is an array of coordinates and an id
                    //assume everything for now is unrotated
                    let pageDimensions = [];
                    let wires = []; //array inside of an array
                    let capacitors = [];
                    let grounds = [];
                    let resistors = [];
                    let inductors = [];
                    let diodes = [];
                    pageDimensions.push(parseInt(str.substring(str.indexOf("SHEET") + 7, str.indexOf("SHEET") + 12)));
                    pageDimensions.push(parseInt(str.substring(str.indexOf("SHEET") + 12, str.indexOf("SHEET") + 17)));
                    let currIndex = 0;
                    let placeholder = 0;
                    let elemCount = 0;
                    let components = [capacitors, grounds, resistors, inductors, diodes];
                    //Wires
                    while(str.indexOf("WIRE", currIndex) != -1){
                        //insert code
                        placeholder = str.indexOf("WIRE", currIndex);
                        currIndex = placeholder + 1;
                        for(let i = 0; i < 4; i++){ //looking for 4 coordinate values (x1, y1, x2, y2)
                            wires.push(parseInt(str.substring(placeholder + 4))); //add 4 to prevent NaN
                            placeholder += wires[elemCount].toString().length + 1; // +1 to account for the spacing
                            elemCount++;
                        }

                    }
                    currIndex = 0;
                    placeholder = 0;
                    elemCount = 0;
                    //Capacitors. For now we assume components can't rotate
                    while(str.indexOf("SYMBOL cap", currIndex) != -1){
                        placeholder = str.indexOf("SYMBOL cap", currIndex);
                        currIndex = placeholder + 1;
                        for(let i = 0; i < 2; i++){//two coordinate values
                            capacitors.push(parseInt(str.substring(placeholder + 10))); //to prevent NaN
                            placeholder += capacitors[elemCount].toString().length + 1; // +1 to account for the spacing
                            elemCount++;
                        }
                    }
                    currIndex = 0;
                    placeholder = 0;
                    elemCount = 0;
                    //Grounds
                    while(str.indexOf("FLAG", currIndex) != -1){
                        placeholder = str.indexOf("FLAG", currIndex);
                        currIndex = placeholder + 1;
                        for(let i = 0; i < 2; i++){//two coordinate values
                            grounds.push(parseInt(str.substring(placeholder + 4))); //to prevent NaN
                            placeholder += grounds[elemCount].toString().length + 1; // +1 to account for the spacing
                            elemCount++;
                        }
                    }
                    currIndex = 0;
                    placeholder = 0;
                    elemCount = 0;
                    //Resistors
                    while(str.indexOf("SYMBOL res", currIndex) != -1){
                        placeholder = str.indexOf("SYMBOL res", currIndex);
                        currIndex = placeholder + 1;
                        for(let i = 0; i < 2; i++){//two coordinate values
                            resistors.push(parseInt(str.substring(placeholder + 10))); //to prevent NaN
                            placeholder += resistors[elemCount].toString().length + 1; // +1 to account for the spacing
                            elemCount++;
                        }
                    }
                    currIndex = 0;
                    placeholder = 0;
                    elemCount = 0;
                    //Inductors
                    while(str.indexOf("SYMBOL ind", currIndex) != -1){
                        placeholder = str.indexOf("SYMBOL ind", currIndex);
                        currIndex = placeholder + 1;
                        for(let i = 0; i < 2; i++){//two coordinate values
                            inductors.push(parseInt(str.substring(placeholder + 10))); //to prevent NaN
                            placeholder += inductors[elemCount].toString().length + 1; // +1 to account for the spacing
                            elemCount++;
                        }
                    }
                    currIndex = 0;
                    placeholder = 0;
                    elemCount = 0;
                    //Diodes
                    while(str.indexOf("SYMBOL diode", currIndex) != -1){
                        placeholder = str.indexOf("SYMBOL diode", currIndex);
                        currIndex = placeholder + 1;
                        for(let i = 0; i < 2; i++){//two coordinate values
                            diodes.push(parseInt(str.substring(placeholder + 12))); //to prevent NaN
                            placeholder += diodes[elemCount].toString().length + 1; // +1 to account for the spacing
                            elemCount++;
                        }
                    }

                    createComponents(components, wires);
                },

                createComponents= function(componentsArr, wiresArr){
                    let paperEvent = paperevents.createPaperEventsHandle();
                    let drawTool = drawline.createDrawLineTool();

                    for(let i = 0; i < componentsArr.length; i++){ //This loop displays all the components
                        for(let j = 0; j < componentsArr[i].length; j+=2){
                            if(i == 0){
                                //Height: 60 units, Offset: 10 units right, 6 units down (relative to top node)
                                paperEvent._createBasicComponent("capacitor", componentsArr[i][j], componentsArr[i][j+1], false);
                            }
                            else if(i == 1){
                                //Offset: 10 units right (relative to the single connecting node)
                                paperEvent._createBasicComponent("ground", componentsArr[i][j], componentsArr[i][j+1], false);
                            }
                            else if(i == 2){
                                //Height: 60 units, Offset: 10 units right, 6 units down (relative to top node)
                                paperEvent._createBasicComponent("resistor", componentsArr[i][j], componentsArr[i][j+1], false);
                            }
                            else if(i == 3){
                                //Height: 60 units, Offset: 13 units right, 6 units down (relative to top node)
                                paperEvent._createBasicComponent("inductor", componentsArr[i][j], componentsArr[i][j+1], false);
                            }
                            else if(i == 4){
                                //Height: 60 units, Offset: 2 units left, 6 units down (relative to top node)
                                paperEvent._createBasicComponent("diode", componentsArr[i][j], componentsArr[i][j+1], false);
                            }
                        }
                    }
                    let dot1 = {x: 0, y: 0};
                    let dot2 = {x: 0, y: 0};
                    for(let i = 0; i < wiresArr.length; i+=4){
                        dot1.x = wiresArr[i];
                        dot1.y = wiresArr[i+1];
                        dot2.x = wiresArr[i+2];
                        dot2.y = wiresArr[i+3];
                        drawTool._makeLine(dot1, dot2);
                    }


                };
            factory.createFilereader = function () {
                return filereader();
            };
            return factory;
        }]);