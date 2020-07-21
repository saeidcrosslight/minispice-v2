'use strict';

angular
        .module('tool.drawline', [])
        .factory('drawline', ['$rootScope', 'component', function ($rootScope, component) {
                var factory = {};
                var groundCheck = false;
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
                                let pos = cellView.model.attributes.position;
                                this._normalLink(pos.x+4, pos.y);
                                $("g[model-id='"+cellView.model.id+"']").hide();
                            };

                            this.normalLinkForNode2 = function(cellView, x, y){
                                let paper = $rootScope.minispice.papers[0];
                                paper.startDot = paper.normalStartDot;
                                paper.endDot = cellView.model.attributes.position;
                                paper.endDot.x +=4;
                                this._handleDotToDot();
                                this._resetDots1(cellView.model);
                                if($rootScope.minispice.papers[0].linkObject != null)
                                    $rootScope.minispice.papers[0].linkObject.remove(); //remove last fresh when mousemove line
                                $rootScope.minispice.papers[0].startNormalLink = false;
                                $rootScope.minispice.papers[0].normalStartDot = { x: 0, y: 0 };
                                $rootScope.minispice.papers[0].normalLastDot = { x: 0, y: 0 };
                                $rootScope.minispice.papers[0].linkObject = null;

                                $("g[model-id='"+cellView.model.id+"']").hide();
                            };

                            this.autoLink = function(type, cellView, x, y){
                                let paper = $rootScope.minispice.papers[0],
                                    tempDot;
                                if(paper.autoStartType == ''){//第一个点
                                    if(type == 'standard.Circle'){
                                        paper.autoStartType = 'dot';
                                        this._markStartDot(cellView);                          //1.(1)标记第一个点为红色
                                        //paper.startDot = cellView.model.attributes.position;   //1.(2)获取起始点坐标
                                        for(let i = 0; i < paper.components.length; i++){
                                            if(Math.abs(x - paper.components[i].linkNodes[0].attributes.position.x) < 15 && Math.abs(y - paper.components[i].linkNodes[0].attributes.position.y) < 15){
                                                paper.startDot = {x: paper.components[i].linkNodes[0].attributes.position.x, y: paper.components[i].linkNodes[0].attributes.position.y};
                                            }
                                            if(paper.components[i].type != "ground") {
                                                if (Math.abs(x - paper.components[i].linkNodes[1].attributes.position.x) < 15 && Math.abs(y - paper.components[i].linkNodes[1].attributes.position.y) < 15) {
                                                    paper.startDot = {
                                                        x: paper.components[i].linkNodes[1].attributes.position.x,
                                                        y: paper.components[i].linkNodes[1].attributes.position.y
                                                    };
                                                }
                                            }

                                        }
                                        //paper.startDot = {x: x, y: y};
                                        paper.startDotObject = cellView.model;                 //1.(3)保存第一个点对象
                                        paper.startDot.x = paper.startDot.x + 4;               //处理偏移
                                        paper.startDotOppositeObject = this._getOppositeDot(cellView); //1.(4)获取器件另一个连接点
                                    }
                                    paper.isAutoStart = true;                                  //2.打开连线开关，开始连线
                                }else{//第二个点
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

                        _handleDotToDot: function(){
                            let paper = $rootScope.minispice.papers[0],
                                leftTop = paper.startDot.y < paper.startDotOppositeObject.y, //start dot is top dot, !leftTop is bottom dot
                                rightTop = paper.endDot.y < paper.endDotOppositeObject.y,    //end dot is top dot, !rightTop is bottom dot
                                startDot = paper.startDot,
                                endDot = paper.endDot,
                                startDotOpposite = paper.endDotOppositeObject;
                            let path = this.aStar(startDot, endDot);
                            let deltaX = false;
                            let linePath = [];
                            let tempStartDot;
                            let tempEndDot;
                            //console.log(path);
                            for(let i = 1; i < path.length; i++){
                                if(path[i].i == path[i-1].i){
                                    if((deltaX && linePath.length != 0) || i == path.length-1){
                                        tempStartDot = {x: linePath[0].i, y: linePath[0].j};
                                        tempEndDot = {x: linePath[linePath.length-1].i, y: linePath[linePath.length-1].j};
                                        this._makeLine(tempStartDot, tempEndDot);
                                        linePath.length = 0; //clears the linePath
                                    }
                                    deltaX = false;
                                }
                                else if(path[i].j == path[i-1].j) {
                                    //do the same as above here below
                                    if((!deltaX && linePath.length != 0)|| i == path.length-1){
                                        tempStartDot = {x: linePath[0].i, y: linePath[0].j};
                                        tempEndDot = {x: linePath[linePath.length-1].i, y: linePath[linePath.length-1].j};
                                        this._makeLine(tempStartDot, tempEndDot);
                                        linePath.length = 0; //clears the linePath
                                    }
                                    deltaX = true;
                                }
                                linePath.push(path[i]);

                            }




                            /*if(startDot.x != endDot.x && startDot.y == endDot.y){//两点在同一水平线上
                                this._makeLine(startDot, endDot);                                            
                            }else if(startDot.x == endDot.x && startDot.y != endDot.y){//两点在同一垂直线上
                                let num = this._countbyNum();
                                let tempDotX = startDot.x-num;
                                if(!leftTop && !rightTop)
                                    tempDotX = startDot.x+num;
                                if((leftTop && !rightTop && endDot.y < startDot.y) || (!leftTop && rightTop && endDot.y > startDot.y)){
                                    this._makeLine(startDot, endDot);
                                }else{
                                    this._makeLine(startDot, {x:tempDotX, y:startDot.y});
                                    this._makeLine({x:tempDotX, y:startDot.y}, {x:tempDotX, y:endDot.y});
                                    this._makeLine({x:tempDotX, y:endDot.y}, endDot);
                                }
                            }else{//Other situations
                                if((leftTop && rightTop && startDot.y < endDot.y) ||   //top & top
                                    (!leftTop && !rightTop && startDot.y > endDot.y) || //bottom & bottom
                                    (leftTop && !rightTop && startDot.y > endDot.y) ||  //top & bottom
                                    (!leftTop && rightTop && startDot.y < endDot.y)){   //bottom & top;   MiddleDot:(endDot.x, startDot.y), startDot and endDot both link to MiddleDot
                                        this._makeLine(startDot, {x:endDot.x, y:startDot.y});
                                        this._makeLine({x:endDot.x, y:startDot.y}, endDot);
                                }else if((leftTop && rightTop && startDot.y > endDot.y) ||
                                            (!leftTop && !rightTop && startDot.y < endDot.y)){//MiddleDot:(startDot.x, endDot.y)
                                                this._makeLine(startDot, {x:startDot.x, y:endDot.y});
                                                this._makeLine({x:startDot.x, y:endDot.y}, endDot);
                                }else if((leftTop && !rightTop && startDot.y < endDot.y && endDot.y>startDotOpposite.y) ||
                                            (!leftTop && rightTop && startDot.y > endDot.y && endDot.y>startDotOpposite.y)){ //2 dots added between start and end: (endDot.x+100, startDot.y), (endDot.x+100,endDot.y)
                                                let num = this._countbyNum();
                                                this._makeLine(startDot, {x:endDot.x+num, y:startDot.y});
                                                this._makeLine({x:endDot.x+num, y:startDot.y}, {x:endDot.x+num, y:endDot.y});
                                                this._makeLine({x:endDot.x+num, y:endDot.y}, endDot);
                                }else if((leftTop && !rightTop &&  startDot.y < endDot.y && endDot.y<startDotOpposite.y) ||
                                            (!leftTop && rightTop && startDot.y > endDot.y && endDot.y<startDotOpposite.y)){ //中间加两个点，需要计算中间点
                                        var tempMiddleX = (endDot.x-startDot.x)/2+startDot.x;
                                        if(startDot.x > endDot.x)
                                        tempMiddleX = (startDot.x-endDot.x)/2+endDot.x;
                                        this._makeLine(startDot, {x:tempMiddleX, y:startDot.y});
                                        this._makeLine({x:tempMiddleX, y:startDot.y}, {x:tempMiddleX, y:endDot.y});
                                        this._makeLine({x:tempMiddleX, y:endDot.y}, endDot);                                                
                                }
                            }*/
                        },

                        /*_handleLineToLine: function(){
                            let paper = $rootScope.minispice.papers[0],
                                startLine = paper.startLine,
                                endLine = paper.endLine,
                                startLineDot = paper.startDot,
                                endLineDot = paper.endDot,
                                startHorizontal = false, //起始线是否水平
                                endHorizontal = false;   //结束线是否水平

                            if(paper.startLine == paper.endLine)
                                return;
                                
                            if(startLine.start.x != startLine.end.x && startLine.start.y == startLine.end.y)
                                startHorizontal = true;
                            if(endLine.start.x != endLine.end.x && endLine.start.y == endLine.end.y)
                                endHorizontal = true;

                            if((startHorizontal && endHorizontal && startLineDot.x == endLineDot.x && startLineDot.y != endLineDot.y) ||
                               (!startHorizontal && !endHorizontal && startLineDot.x != endLineDot.x && startLineDot.y == endLineDot.y)){//水平+水平，且x相等；或垂直+垂直，且y相等；则不加辅助点，直接连线
                                this._makeLine(startLineDot, endLineDot);
                            }else if(startHorizontal && !endHorizontal && startLineDot.x != endLineDot.x && startLineDot.y != endLineDot.y){//水平+垂直，增加一个辅助点1，连2条线
                                this._makeLine(startLineDot, {x:startLineDot.x, y:endLineDot.y});
                                this._makeLine({x:startLineDot.x, y:endLineDot.y}, endLineDot);                                            
                            }else if(!startHorizontal && endHorizontal && startLineDot.x != endLineDot.x && startLineDot.y != endLineDot.y){//垂直+水平，增加一个辅助点2，连2条线
                                this._makeLine(startLineDot, {x:endLineDot.x, y:startLineDot.y});
                                this._makeLine({x:endLineDot.x, y:startLineDot.y}, endLineDot);                                            
                            }else if(startHorizontal && endHorizontal && startLineDot.x != endLineDot.x){//水平+水平，增加两个辅助点，连3条线
                                let num = this._countbyNum(),
                                    dot1 = {x:startLineDot.x, y:startLineDot.y-num},
                                    dot2 = {x:endLineDot.x, y:startLineDot.y-num};
                                if(startLineDot.y > endLineDot.y){
                                    dot1.y = endLineDot.y-num;
                                    dot2.y = endLineDot.y-num; 
                                }
                                this._makeLine(startLineDot, dot1);
                                this._makeLine(dot1, dot2);
                                this._makeLine(dot2, endLineDot);
                            }else if(!startHorizontal && !endHorizontal && startLineDot.y != endLineDot.y){//垂直+垂直，增加两个辅助点，连3条线
                                let num = this._countbyNum(),
                                    dot1 = {x:startLineDot.x-num, y:startLineDot.y},
                                    dot2 = {x:startLineDot.x-num, y:endLineDot.y};
                                if(startLineDot.x < endLineDot.x){
                                    dot1.x = endLineDot.x+num;
                                    dot2.x = endLineDot.x+num; 
                                }
                                this._makeLine(startLineDot, dot1);
                                this._makeLine(dot1, dot2);
                                this._makeLine(dot2, endLineDot);
                            }else if(startLineDot.y == endLineDot.y){
                                let dot1={}, dot2={}, dot3={}, num = this._countbyNum();
                                if(startHorizontal && !endHorizontal && startLineDot.x < endLineDot.x){//增加三个辅助点，连4条线
                                    dot1={x:startLineDot.x, y:startLineDot.y-num}, 
                                    dot2={x:endLineDot.x-num, y:startLineDot.y-num}, 
                                    dot3={x:endLineDot.x-num, y:endLineDot.y};
                                }else if(startHorizontal && !endHorizontal && startLineDot.x > endLineDot.x){
                                    dot1={x:startLineDot.x, y:startLineDot.y-num}, 
                                    dot2={x:endLineDot.x+num, y:startLineDot.y-num}, 
                                    dot3={x:endLineDot.x+num, y:endLineDot.y};
                                }else if(!startHorizontal && endHorizontal && startLineDot.x < endLineDot.x){
                                    dot1={x:startLineDot.x+num, y:startLineDot.y}, 
                                    dot2={x:startLineDot.x+num, y:startLineDot.y-num}, 
                                    dot3={x:endLineDot.x, y:endLineDot.y-num};
                                }else if(!startHorizontal && endHorizontal && startLineDot.x > endLineDot.x){
                                    dot1={x:startLineDot.x-num, y:startLineDot.y}, 
                                    dot2={x:startLineDot.x-num, y:startLineDot.y-num}, 
                                    dot3={x:endLineDot.x, y:endLineDot.y-num};
                                }
                                this._makeLine(startLineDot, dot1);
                                this._makeLine(dot1, dot2);
                                this._makeLine(dot2, dot3);
                                this._makeLine(dot3, endLineDot);
                            }                             
                        }

                        _handleDotToLine1: function(){//dot to line 横线-->点 或 点-->横线 111111111111
                            let paper = $rootScope.minispice.papers[0],
                                startDot = paper.startDot,
                                endDot = paper.endDot,
                                endDotOpposite = paper.endDotOppositeObject,
                                startDotOpposite = paper.startDotOppositeObject,
                                endLine = paper.endLine,
                                isStartLineHorizantal = paper.isStartLineHorizantal,
                                isEndLineHorizantal = paper.isEndLineHorizantal,
                                num = this._countbyNum();
                            if(startDot.x != endDot.x && startDot.y == endDot.y){//两点在同一水平
                                let dot1 = { x: startDot.x, y: startDot.y - num },
                                    dot2 = { x: endDot.x, y: startDot.y - num};
                                if((isStartLineHorizantal && endDot.y > endDotOpposite.y) || (isEndLineHorizantal && startDot.y > startDotOpposite.y)){
                                    dot1.y = startDot.y + num;
                                    dot2.y = startDot.y + num;                                    
                                }
                                this._makeLine(startDot, dot1);
                                this._makeLine(dot1, dot2);
                                this._makeLine(dot2, endDot);
                            }else if(startDot.x == endDot.x && startDot.y != endDot.y){//两点在同一垂直线上
                                let dot1, dot2, dot3;
                                if(isStartLineHorizantal){
                                    dot1 = {x: startDot.x, y: startDot.y + num},
                                    dot2 = {x: startDot.x - num, y: startDot.y + num},
                                    dot3 = {x: startDot.x - num, y: endDot.y};
                                    if(startDot.y > endDot.y){
                                        dot1.y = startDot.y - num;
                                        dot2.y = startDot.y - num;
                                    }                                    
                                }else if(isEndLineHorizantal){
                                    dot1 = {x: startDot.x - num, y: startDot.y};
                                    dot2 = {x: startDot.x - num, y: endDot.y + num};
                                    dot3 = {x: endDot.x, y: endDot.Y + num};
                                    if(startDot.y < endDot.y){
                                        dot2.y = endDot.y - num;
                                        dot3.y = endDot.y - num;
                                    }
                                }
                                this._makeLine(startDot, dot1);
                                this._makeLine(dot1, dot2);
                                this._makeLine(dot2, dot3);
                                this._makeLine(dot3, endDot);
                            }else if(startDot.x != endDot.x && startDot.y != endDot.y){
                                let dot = {x: startDot.x, y: endDot.y};
                                if(isEndLineHorizantal)
                                    dot = {x: endDot.x, y: startDot.y};
                                this._makeLine(startDot, dot);
                                this._makeLine(dot, endDot);
                            }
                        },

                        _handleDotToLine2: function(){//line to dot 竖线-->点 或 点-->竖线 222222222222
                            let paper = $rootScope.minispice.papers[0],
                                startDot = paper.startDot,
                                endDot = paper.endDot,
                                endDotOpposite = paper.endDotOppositeObject,
                                num = this._countbyNum();
                            if(startDot.x != endDot.x && startDot.y == endDot.y){//两点在同一水平线上
                                this._makeLine(startDot, endDot);
                            }else if(startDot.x == endDot.x && startDot.y != endDot.y){//两点在同一垂直线上
                                let dot1 = {x: startDot.x - num, y: startDot.y},
                                    dot2 = {x: startDot.x - num, y: endDot.y};
                                this._makeLine(startDot, dot1);
                                this._makeLine(dot1, dot2);
                                this._makeLine(dot2, endDot);
                            }else if(startDot.x != endDot.x && startDot.y != endDot.y){
                                let dot1 = {x: startDot.x + num, y: startDot.y},
                                    dot2 = {x: startDot.x + num, y: endDot.y}
                                if(startDot.x > endDot.x){
                                    dot1.x = startDot.x - num;
                                    dot2.x = startDot.x - num;
                                }
                                this._makeLine(startDot, dot1);
                                this._makeLine(dot1, dot2);
                                this._makeLine(dot2, endDot);
                            }
                        },*/
                        
                        _normalLink: function(x,y){
                            let paper = $rootScope.minispice.papers[0]; //get current paper
                            let linked = false;
                            //let paperEvent = paperevents.createPaperEventsHandle();
                            if(!paper.startNormalLink){//first click on paper
                                let obj = this._newTempLink(x,y);
                                paper.linkObject = obj;
                                paper.normalStartDot = {x: x, y: y};
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
                                        $rootScope.minispice.graph.getCell(paper.components[i].linkNodes[0]).remove();
                                        if($rootScope.minispice.papers[0].linkObject != null)
                                            $rootScope.minispice.papers[0].linkObject.remove(); //remove last fresh when mousemove line
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
                                        //$("g[model-id='"+cellView.model.id+"']").hide();
                                    }
                                    if (!groundCheck) {
                                        if (Math.abs(paper.normalLastDot.x - paper.components[i].linkNodes[1].attributes.position.x) < 12 && Math.abs(paper.normalLastDot.y - paper.components[i].linkNodes[1].attributes.position.y) < 12) {
                                            //alert("hello2");
                                            $rootScope.minispice.graph.getCell(paper.components[i].linkNodes[1]).remove();
                                            if($rootScope.minispice.papers[0].linkObject != null)
                                                $rootScope.minispice.papers[0].linkObject.remove(); //remove last fresh when mousemove line
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
                                            //$("g[model-id='"+cellView.model.id+"']").hide();
                                        }
                                    }
                                }
                                let link = new joint.dia.Link();
                                link.set('source', paper.normalStartDot);
                                link.set('target', paper.normalLastDot);
                                //link.attr({'.connection-wrap': {"pointerEvents": 'none'}});
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
                                    paper.linkObject.set('target', paper.normalLastDot); //this line will make errors in console, but it can work, still don't know why????
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
                           // link.attr({
                                //'.connection-wrap': {"pointerEvents": 'none'}
                           // });
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

                        _makeCircle: function(x,y){//when click on a line, to create a link node for components
                            let circle = new joint.shapes.standard.Circle();
                            circle.position(x-6, y-6);
                            circle.resize(12, 12);
                            circle.attr('body/fill','blue');
                            circle.attr('body/stroke','blue');
                            $rootScope.minispice.graph.addCells(circle);
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
                                    $(com.children[6]).remove();
                                    $(com.children[5]).remove();
                                    $(com.children[4]).remove();
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

                        _markStartLine: function(cellView){
                            let allLinks = $(".joint-type-link");
                            $.each(allLinks, function(lindex, link){
                                if(($(link.children[0]).attr('stroke'))=='blue')
                                    $(link.children[0]).attr('stroke','black');
                                if(($(link).attr('model-id')) == cellView.model.id){
                                    $(link.children[0]).attr('stroke','black');
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

                        _getLineDots: function(cellView){
                            let lineDots = {},
                                tempLine = null,
                                allLinks = $(".joint-type-link");
                            $.each(allLinks, function(lindex, link){                                       
                                if(($(link).attr('model-id')) == cellView.model.id){
                                    tempLine = $(link.children[0]).attr('d').split(/[ ]+/);//获取被点击线段的两端点坐标
                                    lineDots = {start:{x:tempLine[1], y:tempLine[2]}, end:{x:tempLine[4], y:tempLine[5]}};
                                }
                            });
                            return lineDots;
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
                                    /*
                                    if(i < (cols -1)){
                                        this.neighbours.push(grid[i+1][j]);
                                    }
                                    if(i > 0){
                                        this.neighbours.push(grid[i-1][j]);
                                    }
                                    if(j < rows-1){
                                        this.neighbours.push(grid[i][j+1]);
                                    }
                                    if(j > 0){
                                        this.neighbours.push(grid[i][j-1]);
                                    }
                                    */
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
                            let cols = 2000;
                            let rows = 1400;
                            //for efficiency so we don't need to loop over entire paper. Just currently existing elements.
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
                            //buffer
                            xMax += 70;
                            xMin -= 70;
                            yMax += 70;
                            yMin -= 70;

                            //let grid = new Array(cols);
                            /*
                            for(let i = 0; i < cols; i++){
                                grid[i] = new Array(rows);
                            }

                            for(let i = 0; i < cols; i++){
                                for(let j = 0; j < rows; j++){
                                    grid[i][j] = new Spot(i,j);
                                }
                            }
                            for(let i = 0; i < cols; i++){
                                for(let j = 0; j < rows; j++){
                                    grid[i][j].addNeighbours(grid);
                                }
                            }*/
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


                            for(let i = 0; i < paper.links.length; i++){ //walls
                                if(paper.links[i].attributes.source.x == paper.links[i].attributes.target.x){ //vertical line
                                    let min = Math.min(paper.links[i].attributes.source.y,paper.links[i].attributes.target.y);
                                    let max = Math.max(paper.links[i].attributes.source.y,paper.links[i].attributes.target.y);
                                        for (let j = min; j <= max; j++) {
                                            grid[paper.links[i].attributes.source.x][j].wall = true;
                                            /*
                                            if(min > 6 && max < 1394) { //vertical dimensions of paper
                                                grid[paper.links[i].attributes.source.x + 1][j].wall = true; //buffer
                                                grid[paper.links[i].attributes.source.x - 1][j].wall = true; //buffer
                                                grid[paper.links[i].attributes.source.x + 2][j].wall = true; //buffer
                                                grid[paper.links[i].attributes.source.x - 2][j].wall = true; //buffer
                                                grid[paper.links[i].attributes.source.x + 3][j].wall = true; //buffer
                                                grid[paper.links[i].attributes.source.x - 3][j].wall = true; //buffer
                                                grid[paper.links[i].attributes.source.x + 4][j].wall = true; //buffer
                                                grid[paper.links[i].attributes.source.x - 4][j].wall = true; //buffer
                                                grid[paper.links[i].attributes.source.x + 5][j].wall = true; //buffer
                                                grid[paper.links[i].attributes.source.x - 5][j].wall = true; //buffer
                                                grid[paper.links[i].attributes.source.x + 6][j].wall = true; //buffer
                                                grid[paper.links[i].attributes.source.x - 6][j].wall = true; //buffer
                                            }
                                             */
                                        }

                                }
                                if(paper.links[i].attributes.source.y == paper.links[i].attributes.target.y){ //horizontal line
                                    let min = Math.min(paper.links[i].attributes.source.x,paper.links[i].attributes.target.x);
                                    let max = Math.max(paper.links[i].attributes.source.x,paper.links[i].attributes.target.x);
                                    for(let j = min; j <= max; j++){
                                        grid[j][paper.links[i].attributes.source.y].wall = true;
                                        /*
                                        if(min > 6 && max < 1994) { //dimensions of paper
                                            grid[j][paper.links[i].attributes.source.y + 1].wall = true;
                                            grid[j][paper.links[i].attributes.source.y - 1].wall = true;
                                            grid[j][paper.links[i].attributes.source.y + 2].wall = true;
                                            grid[j][paper.links[i].attributes.source.y - 2].wall = true;
                                            grid[j][paper.links[i].attributes.source.y + 3].wall = true;
                                            grid[j][paper.links[i].attributes.source.y - 3].wall = true;
                                            grid[j][paper.links[i].attributes.source.y + 4].wall = true;
                                            grid[j][paper.links[i].attributes.source.y - 4].wall = true;
                                            grid[j][paper.links[i].attributes.source.y + 5].wall = true;
                                            grid[j][paper.links[i].attributes.source.y - 5].wall = true;
                                            grid[j][paper.links[i].attributes.source.y + 6].wall = true;
                                            grid[j][paper.links[i].attributes.source.y - 6].wall = true;
                                        }

                                         */
                                    }
                                }

                            }

                            //Components -- make sure to account for rotating components later

                            for(let i = 0; i < paper.components.length; i++){
                                if (paper.components[i].type != "ground") {
                                    if (Math.abs(paper.components[i].linkNodes[0].attributes.position.x - paper.components[i].linkNodes[1].attributes.position.x) < 6){ //vertical comps
                                        let min = Math.min(paper.components[i].linkNodes[0].attributes.position.y, paper.components[i].linkNodes[1].attributes.position.y);
                                        let max = Math.max(paper.components[i].linkNodes[0].attributes.position.y, paper.components[i].linkNodes[1].attributes.position.y);
                                        for (let j = min + 1; j < max - 1; j++) { //just for a bit of buffer
                                            grid[paper.components[i].linkNodes[0].attributes.position.x][j].wall = true;
                                            if(min > 5 && max < 1995) {
                                                grid[paper.components[i].linkNodes[0].attributes.position.x - 1][j].wall = true; //buffer
                                                grid[paper.components[i].linkNodes[0].attributes.position.x + 1][j].wall = true; //buffer
                                                grid[paper.components[i].linkNodes[0].attributes.position.x - 2][j].wall = true; //buffer
                                                grid[paper.components[i].linkNodes[0].attributes.position.x + 2][j].wall = true; //buffer
                                                grid[paper.components[i].linkNodes[0].attributes.position.x - 3][j].wall = true; //buffer
                                                grid[paper.components[i].linkNodes[0].attributes.position.x + 3][j].wall = true; //buffer
                                                grid[paper.components[i].linkNodes[0].attributes.position.x - 4][j].wall = true; //buffer
                                                grid[paper.components[i].linkNodes[0].attributes.position.x + 4][j].wall = true; //buffer
                                                grid[paper.components[i].linkNodes[0].attributes.position.x - 5][j].wall = true; //buffer
                                                grid[paper.components[i].linkNodes[0].attributes.position.x + 5][j].wall = true; //buffer
                                            }
                                        }
                                    }
                                    else if(Math.abs(paper.components[i].linkNodes[0].attributes.position.y - paper.components[i].linkNodes[1].attributes.position.y) < 6){ //horizontal components
                                        let min = Math.min(paper.components[i].linkNodes[0].attributes.position.x, paper.components[i].linkNodes[1].attributes.position.x);
                                        let max = Math.max(paper.components[i].linkNodes[0].attributes.position.x, paper.components[i].linkNodes[1].attributes.position.x);
                                        for (let j = min + 1; j < max - 1; j++) { //just for a bit of buffer
                                            grid[j][paper.components[i].linkNodes[0].attributes.position.y].wall = true;
                                            if(min > 5 && max < 1995) {
                                                grid[j][paper.components[i].linkNodes[0].attributes.position.y - 1].wall = true; //buffer
                                                grid[j][paper.components[i].linkNodes[0].attributes.position.y + 1].wall = true; //buffer
                                                grid[j][paper.components[i].linkNodes[0].attributes.position.y - 2].wall = true; //buffer
                                                grid[j][paper.components[i].linkNodes[0].attributes.position.y + 2].wall = true; //buffer
                                                grid[j][paper.components[i].linkNodes[0].attributes.position.y - 3].wall = true; //buffer
                                                grid[j][paper.components[i].linkNodes[0].attributes.position.y + 3].wall = true; //buffer
                                                grid[j][paper.components[i].linkNodes[0].attributes.position.y - 4].wall = true; //buffer
                                                grid[j][paper.components[i].linkNodes[0].attributes.position.y + 4].wall = true; //buffer
                                                grid[j][paper.components[i].linkNodes[0].attributes.position.y - 5].wall = true; //buffer
                                                grid[j][paper.components[i].linkNodes[0].attributes.position.y + 5].wall = true; //buffer
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
                                    console.log(path);
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