'use strict';

angular
        .module('object.paper', [])
        .factory('paper', ['$rootScope','drawline', 'canvas', 'paperevents', function ($rootScope, drawline, canvas, paperevents) {
            var factory = {};
            var MinispicePaper = (function(){
                var MinispicePaper = function(){
                    return new MinispicePaper.fn.paper();
                };
                let paperTool = canvas.create(); 
                let drawTool = drawline.createDrawLineTool();               

                MinispicePaper.fn = MinispicePaper.prototype = {
                    constructor: MinispicePaper,

                    paper: function(){
                        /*paper*/
                        this.paperCid = '';   //paper's cid
                        this.paperId = '';    //paper's DOM id
                        this.components = []; //all components in current paper
                        this.links = [];      //all lines in current paper
                        this.nodes = [];      //all nodes(circle in each component)just like this:[{id: , label: , position: },{}...]（点击交叉点后产生）
                        this.paper = null;    //paper object
                        this.guide = null;    //guideline object for paper
                        this.isShow = false;  //show/hide the current paper                        

                        /*link normal*/
                        this.startNormalLink = false;
                        this.normalStartDot = { x: 0, y: 0 };                            
                        this.normalLastDot = { x: 0, y: 0 };
                        this.linkObject = null;
                        this.nodeClicked = false;
                        this.handle = false;

                        /*link auto*/
                        this.autoStartType = '';
                        this.autoEndType = '';
                        this.isAutoStart = false;                        
                        this.startDot = { x: 0, y: 0 };               //连线的开始点
                        this.startDotOppositeObject = { x: 0, y: 0 }; //开始点的所在器件的另一个顶点（如果是元器件上的点）
                        this.endDot = { x: 0, y: 0 };                 //连线的结束点        
                        this.endDotOppositeObject = { x: 0, y: 0 };   //结束点的所在器件的另一个顶点（如果是元器件上的点）
                        this.startLine = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 }}; //line-to-line的起始线
                        this.endLine = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 }};   //line-to-line的结束线
                        this.startDotObject = null;    //保存开始点对象
                        this.isStartLineHorizantal = false;
                        this.isEndLineHorizantal = false;
                        this.rightclickLinkObject = null;
                        this.rightclickComponentObject = null;

                        this.countby = 50; //连线时，如果需要增加转弯，则需要添加一个大一点的间隔数，初始为50，没使用一次后增加10
                        
                        this.initPaper = function(){
                            let paperId = this._createPaperId(),
                                initObj = paperTool.create(paperId);                    
                            this.paper = initObj.paper;
                            this.guide = initObj.guide;
                            this.paperCid = this.paper.cid;
                            this.paperId = paperId;
                            this.isShow = true; 
                            this._initPaper(paperId);
                            $rootScope.minispice.currentPaperId = paperId;                            
                        };
                    },
                    _initPaper: function(paperId){
                        let paper = this.paper;
                        let guide = this.guide;
                        let paperEvent = paperevents.createPaperEventsHandle();

                        $('#'+paperId).on('mousemove', function (e) {//mousemove event
                            if($rootScope.minispice.paintSwitch.type=='wire'){
                                //paperTool.freshGuide(guide, e.pageX-203, e.pageY-134);
                                paperTool.freshGuide(guide, e.pageX-229, e.pageY-134);
                            }
                        });

                        paper.on({'blank:pointerdown': function (evt, x, y ) {//clicks a blank area in the paper
                            paperEvent.blankPointerDown(evt, x, y);
                        }});

                        paper.on({'blank:contextmenu': function (evt, x, y ) {//right-clicks a blank area in the paper
                            paperEvent.blankContextMenu(evt, x, y);
                        }});

                        paper.on({'cell:pointerdown': function (cellView, evt, x, y ) {//click a element
                            paperEvent.cellPointerDown(cellView, evt, x, y);          
                        }});

                        paper.on({'cell:pointermove': function (cellView,evt,x,y) {//drag a element(expect 'shapes.standard.Image')
                            paperEvent.cellPointerMove(cellView, evt, x, y);                              
                        }});

                        paper.on({'cell:contextmenu ': function (cellView,evt,x,y) {//鼠标右击元素时
                            paperEvent.cellContextMenu(cellView,evt,x,y);
                        }});

                        paper.on({'element:mouseenter': function (cellView,evt) {//鼠标移入元素时触发text, rect, shapes, all are elements
                            paperEvent.elementMouseEnter(cellView,evt);
                        }});

                        paper.on({'element:mouseout': function (cellView,evt) {//鼠标移出元素时触发text, rect, shapes, all are elements
                            paperEvent.elementMouseOut(cellView,evt);
                        }});
                    },

                    _createPaperId: function(){
                        return "paper_" + ($('#paper').children().length + 1);
                    },
                    
                    _getComponents: function(){
                        return this.components;
                    }
                }

                MinispicePaper.fn.paper.prototype = MinispicePaper.fn;

                return MinispicePaper;
            })();            

            factory.createMinispicePaper = function () {
                return MinispicePaper();
            };

            return factory;
        }]);