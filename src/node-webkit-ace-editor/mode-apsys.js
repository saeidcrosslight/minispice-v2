///instruction
///对原先mode-apsys.js文件的改动幅度比较大。原先通过token搜索关键字，我直接通过正则表达式搜索，这样可以根据位置不同显示不同颜色。
//keyLib_fy.json包含key的关键字，我把所有key的简写包含进去了；
//key的简写规则是：长度四位的没有简写。大于等于四位的，从第四位单词开始识别。
//参数因为非常多，这里没有做简写，只加入了几个特例，比如outfile -> outf。


ace.define("ace/mode/apsys_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){
    "use strict";

    var r=e("../lib/oop");
    var i=e("./text_highlight_rules").TextHighlightRules;
    var s=function(){
        /*
         var e="case|do|let|loop|if|else|when";
         var t="eq|neq|and|or";
         var n="null|nil"
         var r="cons|car|cdr|cond|lambda|format|setq|setf|quote|eval|append|list|listp|memberp|t|load|progn";
         var i=this.createKeywordMapper({"keyword.control":e,"keyword.operator":t,"constant.language":n,"support.function":r},"identifier",!0);
         */

        var fs = require('fs');		//为了测试方便我只用nodeJS 没有使用angular
        //var pathParamt = "json\\supremKeyParamt_fy.json";
        //var card = JSON.parse(fs.readFileSync(pathKey,"utf-8")).keywrd;




        this.$rules={
            "start":[
                {
                    token:"comment",
                    regex:"\\$.*$|\\#.*$"
                },
                {
                    token:["storage.type.function-type.apsys","text","entity.name.function.apsys"],
                    regex:"(?:\\b(?:(defun|defmethod|defmacro))\\b)(\\s+)((?:\\w|\\-|\\!|\\?)*)"
                },
                {
                    token:["punctuation.definition.constant.character.apsys","constant.character.apsys"],
                    regex:"(#)((?:\\w|[\\\\+-=<>'\"&#])+)"
                },
                {
                    token:["punctuation.definition.variable.apsys","variable.other.global.apsys","punctuation.definition.variable.apsys"],
                    regex:"(\\*)(\\S*)(\\*)"
                },
                {
                    token:"constant.numeric",
                    regex:"0[xX][0-9a-fA-F]+(?:L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"
                },
                {
                    token:"constant.numeric",
                    regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?(?:L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"
                },
                {
                    token:"keyword.control",
                    regex:"^\\s*\\b(begin|end)\\b\\s*"
                }
            ]

        };

    };
    r.inherits(s,i),t.apsysHighlightRules=s});

ace.define("ace/mode/apsys",["require","exports","module","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/apsys_highlight_rules"],function(e,t,n){
    var r=e("../lib/oop");
    var i=e("./text").Mode;
    var s=e("../tokenizer").Tokenizer;
    var o=e("./apsys_highlight_rules").apsysHighlightRules;
    var u=function(){
        var e=new o;
        this.$tokenizer=new s(e.getRules())
    };
    r.inherits(u,i),function(){}.call(u.prototype),t.Mode=u
});