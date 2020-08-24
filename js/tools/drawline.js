'use strict';

angular
        .module('tool.drawline', [])
        .factory('drawline', ['$rootScope', 'component', function ($rootScope, component) {
                var factory = {};
                var groundCheck = false;
                var startNode;
                var startCellView;
                var DrawLineTool = (function(){
                    var DrawLineTool = function(){
                        return new DrawLineTool.fn.tool();
                    };
    
                    DrawLineTool.fn = DrawLineTool.prototype = {
                        constructor: DrawLineTool,
    
                        tool: function(){
                            this.normalLink = function(x,y){
                                this._normalLink(x,y);
                            };

                            this.normalLinkForNode = function(cellView,x,y){
                                let paper = $rootScope.minispice.papers[0];
                                if($rootScope.minispice.papers[0].nodeClicked == false){
                                    let pos = cellView.model.attributes.position;
                                    this._normalLink(pos.x+4, pos.y);
                                    $("g[model-id='"+cellView.model.id+"']").hide();
                                    $rootScope.minispice.papers[0].nodeClicked = true;
                                }
                                else{
                                    paper.startDot = paper.normalStartDot;
                                    paper.endDot = cellView.model.attributes.position;
                                    paper.endDot.x += 4;
                                    this._handleDotToDot();
                                    this._resetDots1(cellView.model);
                                    if ($rootScope.minispice.papers[0].linkObject != null)
                                        $rootScope.minispice.papers[0].linkObject.remove(); //remove last fresh when mousemove line
                                    $rootScope.minispice.papers[0].startNormalLink = false;
                                    $rootScope.minispice.papers[0].normalStartDot = {x: 0, y: 0};
                                    $rootScope.minispice.papers[0].normalLastDot = {x: 0, y: 0};
                                    $rootScope.minispice.papers[0].linkObject = null;

                                    $("g[model-id='" + cellView.model.id + "']").hide();
                                }
                            };
                            //called when wire tool is active, but user clicks on a node
                            this.normalLinkForNode2 = function(cellView, x, y){
                                let paper = $rootScope.minispice.papers[0];
                                if(paper.autoStartType == ''){
                                    let pos = cellView.model.attributes.position;
                                    this._normalLink(pos.x+4, pos.y);
                                    $("g[model-id='"+cellView.model.id+"']").hide();
                                }
                                else {
                                    paper.startDot = paper.normalStartDot;
                                    paper.endDot = cellView.model.attributes.position;
                                    paper.endDot.x += 4;
                                    this._handleDotToDot();
                                    this._resetDots1(cellView.model);
                                    if ($rootScope.minispice.papers[0].linkObject != null)
                                        $rootScope.minispice.papers[0].linkObject.remove(); //remove last fresh when mousemove line
                                    $rootScope.minispice.papers[0].startNormalLink = false;
                                    $rootScope.minispice.papers[0].normalStartDot = {x: 0, y: 0};
                                    $rootScope.minispice.papers[0].normalLastDot = {x: 0, y: 0};
                                    $rootScope.minispice.papers[0].linkObject = null;

                                    $("g[model-id='" + cellView.model.id + "']").hide();
                                }
                            };

                            this.autoLink = function(type, cellView, x, y){

                                let paper = $rootScope.minispice.papers[0],
                                    tempDot;
                                if(paper.autoStartType == ''){//第一个点
                                    if(type == 'standard.Circle'){
                                        paper.autoStartType = 'dot';
                                        this._markStartDot(cellView);
                                        for(let i = 0; i < paper.components.length; i++){
                                            if(Math.abs(x - paper.components[i].linkNodes[0].attributes.position.x) < 15 && Math.abs(y - paper.components[i].linkNodes[0].attributes.position.y) < 15){
                                                paper.startDot = {
                                                    x: paper.components[i].linkNodes[0].attributes.position.x,
                                                    y: paper.components[i].linkNodes[0].attributes.position.y};
                                                startNode = paper.components[i].linkNodes[0];
                                            }
                                            if(paper.components[i].type != "ground") {
                                                if (Math.abs(x - paper.components[i].linkNodes[1].attributes.position.x) < 15 && Math.abs(y - paper.components[i].linkNodes[1].attributes.position.y) < 15) {
                                                    paper.startDot = {
                                                        x: paper.components[i].linkNodes[1].attributes.position.x,
                                                        y: paper.components[i].linkNodes[1].attributes.position.y
                                                    };
                                                    startNode = paper.components[i].linkNodes[1];
                                                }
                                            }

                                        }
                                        //paper.startDot = {x: x, y: y};
                                        paper.startDotObject = cellView.model;
                                        startCellView = cellView;
                                        //paper.startDot.x = paper.startDot.x + 4;
                                        paper.startDotOppositeObject = this._getOppositeDot(cellView);
                                    }
                                    paper.isAutoStart = true;
                                }else{//第二个点
                                    this._recolorDot(startCellView);
                                    this._recolorDot(cellView);
                                    if(type == 'standard.Circle'){
                                        paper.autoEndType = 'dot';
                                        //paper.endDot = cellView.model.attributes.position;
                                        for(let i = 0; i < paper.components.length; i++){
                                            if(Math.abs(x - paper.components[i].linkNodes[0].attributes.position.x) < 15 && Math.abs(y - paper.components[i].linkNodes[0].attributes.position.y) < 15){
                                                paper.endDot = {x: paper.components[i].linkNodes[0].attributes.position.x, y: paper.components[i].linkNodes[0].attributes.position.y};
                                            }
                                            if(paper.components[i].type != "ground") {
                                                if (Math.abs(x - paper.components[i].linkNodes[1].attributes.position.x) < 15 && Math.abs(y - paper.components[i].linkNodes[1].attributes.position.y) < 15) {
                                                    paper.endDot = {
                                                        x: paper.components[i].linkNodes[1].attributes.position.x,
                                                        y: paper.components[i].linkNodes[1].attributes.position.y
                                                    };
                                                }
                                            }

                                        }
                                        //paper.endDot = { x: x, y: y };
                                        paper.startDot.x = startNode.attributes.position.x + 4;
                                        paper.startDot.y = startNode.attributes.position.y;
                                        paper.endDot.x = paper.endDot.x + 4;
                                        paper.endDotOppositeObject = this._getOppositeDot(cellView);
                                    }
                                }

                                if(paper.autoStartType != '' && paper.autoEndType != ''){
                                    if(paper.autoStartType == 'dot' && paper.autoEndType == 'dot'){//dot to dot
                                        this._handleDotToDot();                                    
                                        this._resetDots1(cellView.model);
                                    }
                                }
                            };

                            this.freshLink = function(e){
                                if($rootScope.minispice.paintSwitch.type=='wire' && this.startNormalLink){
                                    testLink.set('target', {x: e.pageX-200, y: e.pageY-130});
                                }
                            }
                        },

                        _handleDotToDot: function() {

                            let paper = $rootScope.minispice.papers[0];
                            $rootScope.minispice.papers[0].nodeClicked = false;
                            $rootScope.minispice.papers[0].handle = false;

                            let startDot = paper.startDot,
                                endDot = paper.endDot,
                                d1 = Math.abs(startDot.x - endDot.x),
                                d2 = Math.abs(startDot.y - endDot.y),
                                manhattanDistance = d1 + d2;
                            //only use algorithm if nodes are relatively close
                            if (manhattanDistance < 600) {
                                let path = this.aStar(startDot, endDot),
                                    deltaX = false,
                                    linePath = [],
                                    tempStartDot,
                                    tempEndDot;
                                //generating the wires from startDot to endDot
                                for (let i = 1; i < path.length; i++) {
                                    if (path[i].i == path[i - 1].i) {
                                        if ((deltaX && linePath.length != 0) || i == path.length - 1) {
                                            tempStartDot = {x: linePath[0].i, y: linePath[0].j};
                                            tempEndDot = {
                                                x: linePath[linePath.length - 1].i,
                                                y: linePath[linePath.length - 1].j
                                            };
                                            this._makeLine(tempStartDot, tempEndDot);
                                            linePath.length = 0; //clears the linePath
                                        }
                                        deltaX = false;
                                    } else if (path[i].j == path[i - 1].j) {
                                        //do the same as above here below
                                        if ((!deltaX && linePath.length != 0) || i == path.length - 1) {
                                            tempStartDot = {x: linePath[0].i, y: linePath[0].j};
                                            tempEndDot = {
                                                x: linePath[linePath.length - 1].i,
                                                y: linePath[linePath.length - 1].j
                                            };
                                            this._makeLine(tempStartDot, tempEndDot);
                                            linePath.length = 0; //clears the linePath
                                        }
                                        deltaX = true;
                                    }
                                    linePath.push(path[i]);
                                }
                            }
                            //nodes are too far
                            else{
                                let offSet = false;
                                let directVertical = false;
                                let directHorizontal = false;
                                //startDot is top left
                                if(startDot.x == endDot.x){
                                    directVertical = true;
                                }
                                else if(startDot.y == endDot.y){
                                    directHorizontal = true;
                                }
                                else{
                                    offSet = true;
                                }
                                if(offSet){
                                        this._makeLine(startDot, {x: startDot.x, y: endDot.y});
                                        this._makeLine({x: startDot.x, y: endDot.y}, endDot);
                                }
                                if(directVertical || directHorizontal){
                                    this._makeLine(startDot, endDot);
                                }
                            }

                        },

                        //called when the wire tool is active
                        _normalLink: function(x,y){
                            let paper = $rootScope.minispice.papers[0]; //get current paper
                            let linked = false;
                            if(!paper.startNormalLink){//first click on paper
                                let obj = this._newTempLink(x,y);
                                paper.linkObject = obj;
                                paper.normalStartDot = {x: x, y: y};
                                //paper.normalLastDot= paper.normalStartDot;
                                paper.startNormalLink = true;
                            }else {
                                //following 2 lines are setting the link to normal style
                                //paper.linkObject.attr('.connection/strokeWidth','1'); //this line would make GUI click 1 more time to jump to next step
                                //paper.linkObject.attr('.connection/stroke','black'); //this line would make GUI click 1 more time to jump to next step
                                this._resetLinkStyle(paper.linkObject);
                                //paper.normalStartDot = paper.normalLastDot;
                                for (let i = 0; i < paper.components.length; i++) {
                                    if (paper.components[i].type == "ground") {
                                        groundCheck = true;
                                    } else {
                                        groundCheck = false;
                                    }
                                    if (Math.abs(paper.normalLastDot.x - paper.components[i].linkNodes[0].attributes.position.x) < 12 && Math.abs(paper.normalLastDot.y - paper.components[i].linkNodes[0].attributes.position.y) < 12) {
                                        $("g[model-id='"+paper.components[i].linkNodes[0].attributes.id+"']").hide();
                                        if ($rootScope.minispice.papers[0].linkObject != null) {
                                            $rootScope.minispice.papers[0].linkObject.remove(); //remove last fresh when mousemove line
                                        }
                                        paper.startDot = paper.normalStartDot;
                                        paper.endDot.x = paper.components[i].linkNodes[0].attributes.position.x + 4;
                                        paper.endDot.y = paper.components[i].linkNodes[0].attributes.position.y;
                                        this._handleDotToDot();
                                        $rootScope.minispice.papers[0].startNormalLink = false;
                                        $rootScope.minispice.papers[0].normalStartDot = {x: 0, y: 0};
                                        $rootScope.minispice.papers[0].normalLastDot = {x: 0, y: 0};
                                        $rootScope.minispice.papers[0].linkObject = null;
                                        linked = true;
                                        break;
                                    }
                                    if (!groundCheck) {
                                        if (Math.abs(paper.normalLastDot.x - paper.components[i].linkNodes[1].attributes.position.x) < 12 && Math.abs(paper.normalLastDot.y - paper.components[i].linkNodes[1].attributes.position.y) < 12) {
                                            $("g[model-id='"+paper.components[i].linkNodes[1].attributes.id+"']").hide();
                                            if($rootScope.minispice.papers[0].linkObject != null){
                                                $rootScope.minispice.papers[0].linkObject.remove(); //remove last fresh when mousemove line
                                            }
                                            paper.startDot = paper.normalStartDot;
                                            paper.endDot.x = paper.components[i].linkNodes[1].attributes.position.x + 4;
                                            paper.endDot.y = paper.components[i].linkNodes[1].attributes.position.y;
                                            this._handleDotToDot();
                                            $rootScope.minispice.papers[0].startNormalLink = false;
                                            $rootScope.minispice.papers[0].normalStartDot = {x: 0, y: 0};
                                            $rootScope.minispice.papers[0].normalLastDot = {x: 0, y: 0};
                                            $rootScope.minispice.papers[0].linkObject = null;
                                            linked = true;
                                            break;
                                        }
                                    }
                                }
                                let link = new joint.dia.Link();
                                link.set('source', paper.normalStartDot);
                                link.set('target', paper.normalLastDot);
                                link.attr({'.connection': {"pointerEvents": 'none'}});
                                link.attr('.connection/strokeWidth', '1');
                                paper.links.push(link);
                                paper.normalStartDot = paper.normalLastDot;
                                let obj = this._newTempLink(paper.normalLastDot.x, paper.normalLastDot.y);
                                paper.linkObject = obj;

                            }
                            $('#'+$rootScope.minispice.currentPaperId).on('mousemove', function (e) {                        
                                if($rootScope.minispice.paintSwitch.type=='wire' && paper.startNormalLink){                                        
                                    let horizontalLength = (e.pageX-200) - paper.normalStartDot.x; //get length of horizontal after moving
                                    if(horizontalLength < 0) horizontalLength = 0 - horizontalLength;

                                    let verticalLength = (e.pageY-130) - paper.normalStartDot.y;//get length of vertical after moving
                                    if(verticalLength < 0) verticalLength = 0 - verticalLength;
                                    
                                    if(horizontalLength >= verticalLength)//compare the difference value between horizontalLength and verticalLength
                                        paper.normalLastDot = {x: e.pageX-200, y: paper.normalStartDot.y};
                                    else
                                        paper.normalLastDot = {x: paper.normalStartDot.x, y: e.pageY-130};
                                    let a = paper.linkObject;
                                    let c = paper.normalLastDot;
                                    paper.linkObject.set('target', paper.normalLastDot);//this line will make errors in console, but it can work, still don't know why????

                                }
                            });
                        },

                        _resetLinkStyle: function(linkObj){
                            $($("g[model-id='"+linkObj.id+"']")[0].children[0]).attr('stroke', 'black');
                            $($("g[model-id='"+linkObj.id+"']")[0].children[0]).attr('stroke-width', '1');
                        },

                        _makeLine: function(startDot, endDot){//for normal
                            let link = new joint.dia.Link();
                            link.set('target', {x: startDot.x, y: startDot.y});
                            link.set('source', {x: endDot.x, y: endDot.y});
                            link.attr('.connection/strokeWidth', '1');
                            link.attr('.connection/pointerEvents', 'none');
                            link.addTo($rootScope.minispice.graph); 
                            $.each($("#v-3")[0].children, function(aindex, com){
                                if(($(com).attr('model-id')) == link.id){//mark the startDot
                                    $(com.children[6]).remove();
                                   $(com.children[5]).remove();
                                    $(com.children[4]).remove();
                                }
                            });
                            $rootScope.minispice.papers[0].links.push(link);
                            //$rootScope.minispice.enableSaveButton();
                            return link;
                        },

                        _newTempLink: function(x,y){
                            let link = new joint.dia.Link();
                            link.set('source', {x: x, y: y});
                            link.set('target', {x: x, y: y});
                            link.attr('.connection/strokeWidth','1');
                            link.attr('.connection/stroke','blue');
                            //link.attr('.connection-wrap/pointerEvents', 'none');
                            //link.attr({'.connection': {pointerEvents: 'none'}});
                            link.addTo($rootScope.minispice.graph);
                            $.each($("#v-3")[0].children, function(aindex, com){
                                if(($(com).attr('model-id')) == link.id){//mark the startDot
                                    $(com.children[6]).hide();
                                    $(com.children[5]).hide();
                                    $(com.children[4]).hide();
                                }
                            });
                            return link;
                        },

                        _markStartDot: function(cellView){
                            let allComponent = $("#v-3")[0].children;
                            $.each(allComponent, function(aindex, com){
                                if(($(com).attr('model-id')) == cellView.model.id){//mark the startDot
                                    $(com.children[0]).attr('fill','red');
                                    $(com.children[0]).attr('stroke','red');
                                }
                            });
                        },
                        _recolorDot: function(cellView){
                            let allComponent = $("#v-3")[0].children;
                            $.each(allComponent, function(aindex, com){
                                if(($(com).attr('model-id')) == cellView.model.id){//mark the startDot
                                    $(com.children[0]).attr('fill','white');
                                    $(com.children[0]).attr('stroke','black');
                                }
                            });
                        },

                        _getOppositeDot: function(cellView){
                            let tempOppositeDot = {};
                            $.each($rootScope.minispice.papers[0].components, function(ctindex, ct){
                                $.each(ct.linkNodes, function(clnindex, cln){
                                    if(ct.linkNodes.length>1 && cln.cid == cellView.model.cid){
                                        if(clnindex === 0)
                                            tempOppositeDot = ct.linkNodes[1].attributes.position;
                                        else if(clnindex === 1)
                                            tempOppositeDot = ct.linkNodes[0].attributes.position;
                                    }
                                });
                            });
                            return tempOppositeDot;
                        },

                        _resetDots1: function(cellobj){
                            let paper = $rootScope.minispice.papers[0];
                            $("g[model-id='"+cellobj.id+"']").hide();    //hide end dot
                            if(paper.startDotObject != null)
                                $("g[model-id='"+paper.startDotObject.id+"']").hide(); //hide start dot
                            this._resetPaper();
                        },

                        _resetDots2: function(){
                            let allLinks = $(".joint-type-link");
                            $.each(allLinks, function(lindex, link){
                                if(($(link.children[0]).attr('stroke'))=='red')
                                    $(link.children[0]).attr('stroke','black');
                            });
                            this._resetPaper();
                        },

                        _resetDots3: function(cellView){
                            let paper = $rootScope.minispice.papers[0];
                            if(paper.autoStartType == 'dot')
                                this._resetDots1(paper.startDotObject);
                            else if(paper.autoEndType == 'dot')
                                this._resetDots1(cellView.model);
                            this._resetPaper();
                        },

                        _resetPaper: function(){
                            let paper = $rootScope.minispice.papers[0];
                            paper.autoStartType = '';
                            paper.autoEndType = '';
                            paper.isAutoStart = false;                        
                            paper.startDot = { x: 0, y: 0 }; 
                            paper.startDotOppositeObject = { x: 0, y: 0 };
                            paper.endDot = { x: 0, y: 0 };                
                            paper.endDotOppositeObject = { x: 0, y: 0 };  
                            paper.startLine = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 }};
                            paper.endLine = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 }};  
                            paper.startDotObject = null; 
                            paper.countby = 50;
                        },

                        _countbyNum: function(){
                            let paper = $rootScope.minispice.papers[0];
                            paper.countby = paper.countby + 20;
                            if(paper.countby>300)
                                paper.countby = 50;
                            return paper.countby;
                        },
                        //function that generates the path from startDot to endDot, returns an array
                        aStar: function(startDot, endDot){
                            function heuristic(a, b){
                                var d1 = Math.abs (a.i - b.i);
                                var d2 = Math.abs (a.j - b.j);
                                return d1 + d2;
                            }
                            function Spot(i,j){
                                this.i = i;
                                this.j = j;
                                this.f = 0;
                                this.g = 0;
                                this.h = 0;
                                this.neighbours = [];
                                this.addNeighbours = function(grid){
                                    var i = this.i;
                                    var j = this.j;
                                    if(i < (xMax - 1)){
                                        this.neighbours.push(grid[i+1][j]);
                                    }
                                    if(i > xMin){
                                        this.neighbours.push(grid[i-1][j]);
                                    }
                                    if(j < (yMax - 1)){
                                        this.neighbours.push(grid[i][j+1]);
                                    }
                                    if(j > yMin){
                                        this.neighbours.push(grid[i][j-1]);
                                    }
                                }
                                this.previous = undefined;
                                this.wall = false;

                            }
                            function removeFromArray(arr, elt){
                                for(let i = arr.length-1; i >= 0; i--){
                                    if(arr[i] == elt){
                                        arr.splice(i,1);
                                    }
                                }
                            }
                            let paper = $rootScope.minispice.papers[0];
                            //For efficiency so we don't need to loop over entire paper; just the currently existing elements.
                            //We are looking for the x,y minimum and maximums for all components/wires.
                            let xMin = 10000;
                            let xMax = 0;
                            let yMin = 10000;
                            let yMax = 0;

                            for(let i = 0; i < paper.links.length; i++){ //wires
                                if(paper.links[i].attributes.source.x > xMax){
                                    xMax = paper.links[i].attributes.source.x;
                                }
                                if(paper.links[i].attributes.source.x < xMin){
                                    xMin = paper.links[i].attributes.source.x;
                                }
                                if(paper.links[i].attributes.target.x > xMax){
                                    xMax = paper.links[i].attributes.target.x;
                                }
                                if(paper.links[i].attributes.target.x < xMin){
                                    xMin = paper.links[i].attributes.target.x;
                                }
                                if(paper.links[i].attributes.source.y > yMax){
                                    yMax = paper.links[i].attributes.source.y;
                                }
                                if(paper.links[i].attributes.source.y < yMin){
                                    yMin = paper.links[i].attributes.source.y;
                                }
                                if(paper.links[i].attributes.target.y > yMax){
                                    yMax = paper.links[i].attributes.target.y;
                                }
                                if(paper.links[i].attributes.target.y < yMin){
                                    yMin = paper.links[i].attributes.target.y;
                                }
                            }

                            for(let i = 0; i < paper.components.length; i++){ //components
                                    if(paper.components[i].linkNodes[0].attributes.position.x > xMax){
                                        xMax = paper.components[i].linkNodes[0].attributes.position.x;
                                    }
                                    if(paper.components[i].linkNodes[0].attributes.position.x < xMin){
                                        xMin = paper.components[i].linkNodes[0].attributes.position.x;
                                    }
                                    if(paper.components[i].linkNodes[0].attributes.position.y > yMax){
                                        yMax = paper.components[i].linkNodes[0].attributes.position.y;
                                    }
                                    if(paper.components[i].linkNodes[0].attributes.position.y < yMin){
                                        yMin = paper.components[i].linkNodes[0].attributes.position.y;
                                    }
                                    if(paper.components[i].type != "ground"){
                                        if(paper.components[i].linkNodes[1].attributes.position.x > xMax){
                                            xMax = paper.components[i].linkNodes[1].attributes.position.x;
                                        }
                                        if(paper.components[i].linkNodes[1].attributes.position.x < xMin){
                                            xMin = paper.components[i].linkNodes[1].attributes.position.x;
                                        }
                                        if(paper.components[i].linkNodes[1].attributes.position.y > yMax){
                                            yMax = paper.components[i].linkNodes[1].attributes.position.y;
                                        }
                                        if(paper.components[i].linkNodes[1].attributes.position.y < yMin){
                                            yMin = paper.components[i].linkNodes[1].attributes.position.y;
                                        }
                                }
                            }


                            //include startDot in case of first wire
                            if(startDot.x >= xMax){
                                xMax = startDot.x;
                            }
                            if(startDot.x <= xMin){
                                xMin = startDot.x;
                            }
                            if(startDot.y >= yMax){
                                yMax = startDot.y;
                            }
                            if(startDot.y <= yMin){
                                yMin = startDot.y;
                            }
                            //buffer
                            xMax += 70;
                            xMin -= 70;
                            yMax += 70;
                            yMin -= 70;
                            let grid = new Array(xMax - xMin);
                            for(let i = xMin; i < xMax; i++){
                                grid[i] = new Array(yMax - yMin);
                            }
                            for(let i = xMin; i < xMax; i++){
                                for(let j = yMin; j < yMax; j++){
                                    grid[i][j] = new Spot(i,j);
                                }
                            }
                            for(let i = xMin; i < xMax; i++){
                                for(let j = yMin; j < yMax; j++){
                                    grid[i][j].addNeighbours(grid);
                                }
                            }

                            //Making the wires "walls"
                            for(let i = 0; i < paper.links.length; i++){
                                if(paper.links[i].attributes.source.x == paper.links[i].attributes.target.x){ //vertical line
                                    let min = Math.min(paper.links[i].attributes.source.y,paper.links[i].attributes.target.y);
                                    let max = Math.max(paper.links[i].attributes.source.y,paper.links[i].attributes.target.y);
                                        for (let j = min; j <= max; j++) {
                                                grid[paper.links[i].attributes.source.x][j].wall = true;
                                        }

                                }
                                if(paper.links[i].attributes.source.y == paper.links[i].attributes.target.y){ //horizontal line
                                    let min = Math.min(paper.links[i].attributes.source.x,paper.links[i].attributes.target.x);
                                    let max = Math.max(paper.links[i].attributes.source.x,paper.links[i].attributes.target.x);
                                    for(let j = min; j <= max; j++){
                                            grid[j][paper.links[i].attributes.source.y].wall = true;
                                    }
                                }

                            }
                            //Making the components "walls"

                            for(let i = 0; i < paper.components.length; i++){
                                if (paper.components[i].type != "ground") {
                                    if (Math.abs(paper.components[i].linkNodes[0].attributes.position.x - paper.components[i].linkNodes[1].attributes.position.x) < 6){ //vertical comps
                                        let min = Math.min(paper.components[i].linkNodes[0].attributes.position.y, paper.components[i].linkNodes[1].attributes.position.y);
                                        let max = Math.max(paper.components[i].linkNodes[0].attributes.position.y, paper.components[i].linkNodes[1].attributes.position.y);
                                        for (let j = min + 1; j < max - 1; j++) { //buffer to ensure endpoints are not walls
                                            grid[paper.components[i].linkNodes[0].attributes.position.x][j].wall = true;
                                            if(min > 5 && max < 1995) {
                                                for (let k = 1; k <= 7; k++){
                                                    grid[paper.components[i].linkNodes[0].attributes.position.x - k][j].wall = true; //buffer
                                                    grid[paper.components[i].linkNodes[0].attributes.position.x + k][j].wall = true; //buffer
                                                }
                                                grid[paper.components[i].linkNodes[0].attributes.position.x + 8][j].wall = true; //buffer
                                                grid[paper.components[i].linkNodes[0].attributes.position.x + 9][j].wall = true; //buffer
                                                grid[paper.components[i].linkNodes[0].attributes.position.x + 10][j].wall = true; //buffer
                                                grid[paper.components[i].linkNodes[0].attributes.position.x + 11][j].wall = true; //buffer
                                                grid[paper.components[i].linkNodes[0].attributes.position.x + 12][j].wall = true; //buffer
                                            }
                                        }
                                    }
                                    else if(Math.abs(paper.components[i].linkNodes[0].attributes.position.y - paper.components[i].linkNodes[1].attributes.position.y) < 6){ //horizontal components
                                        let min = Math.min(paper.components[i].linkNodes[0].attributes.position.x, paper.components[i].linkNodes[1].attributes.position.x);
                                        let max = Math.max(paper.components[i].linkNodes[0].attributes.position.x, paper.components[i].linkNodes[1].attributes.position.x);
                                        for (let j = min + 6; j < max - 1; j++) { //buffer to ensure endpoints are not walls
                                            grid[j][paper.components[i].linkNodes[0].attributes.position.y].wall = true;
                                            if(min > 5 && max < 1995) {
                                                for(let k = 1; k <= 7; k++){
                                                    grid[j][paper.components[i].linkNodes[0].attributes.position.y - k].wall = true; //buffer
                                                    grid[j][paper.components[i].linkNodes[0].attributes.position.y + k].wall = true; //buffer
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            var openList = [];
                            var closedList = [];
                            var start = grid[startDot.x][startDot.y];
                            var end = grid[endDot.x][endDot.y];
                            openList.push(start);
                            var path = [];

                            while(openList.length > 0){
                                var winner = 0; //lowest index
                                for(let i = 0; i < openList.length; i++){
                                    if(openList[i].f < openList[winner].f){
                                        winner = i;
                                    }
                                }
                                var current = openList[winner];

                                if(current === end){
                                    path = [];
                                    var temp = current;
                                    path.push(temp);
                                    while(temp.previous){
                                        path.push(temp.previous);
                                        temp = temp.previous;
                                    }
                                    //console.log(path);
                                    grid.length = 0;
                                    openList.length = 0;
                                    closedList.length = 0;
                                    return path;
                                }
                                removeFromArray(openList, current);
                                closedList.push(current);
                                var neighbours = current.neighbours;
                                for(let i = 0; i < neighbours.length; i++){
                                    var actualWall = false;
                                    let neighbour = neighbours[i];
                                    if(i == 0){
                                        if(neighbour.wall && neighbour.neighbours[0].wall){
                                            actualWall = true;
                                        }
                                    }
                                    if(i == 1){
                                        if(neighbour.wall && neighbour.neighbours[1].wall){
                                            actualWall = true;
                                        }
                                    }
                                    if(i == 2){
                                        if(neighbour.wall && neighbour.neighbours[2].wall){
                                            actualWall = true;
                                        }
                                    }
                                    if(i == 3){
                                        if(neighbour.wall && neighbour.neighbours[3].wall){
                                            actualWall = true;
                                        }
                                    }
                                    if(!actualWall && !closedList.includes(neighbour)) {
                                        let tempG = current.g + 1;

                                        if (openList.includes(neighbour)) {
                                            if (tempG < neighbour.g) {
                                                neighbour.g = tempG;
                                            }
                                        }
                                        else{
                                            neighbour.g = tempG;
                                            openList.push(neighbour);
                                        }
                                        neighbour.h = heuristic(neighbour, end);
                                        neighbour.f = neighbour.h + neighbour.g;
                                        neighbour.previous = current;
                                    }
                                }
                            }
                            //if not solved during the loop, no solution
                            grid.length = 0;
                            openList.length = 0;
                            closedList.length = 0;
                            return [];
                        },
                    };
    
                    DrawLineTool.fn.tool.prototype = DrawLineTool.fn;
    
                    return DrawLineTool;
                })();

                factory.createDrawLineTool = function () {
                    return DrawLineTool();
                };

                return factory;
            }]);