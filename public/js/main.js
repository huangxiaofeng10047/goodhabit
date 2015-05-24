$(function () {    var test = new GoodHabitTest($(".question"), $("#conclusion"));    test.initial();});function GoodHabitTest(item, result) {    this.item = item; //各试题    this.conclusion = result;//结果显示div    this.aItemScore = [];//各题得分数    this.oCategoryScore = {};//排序后的各分类对应总分    this.sum = 0; //总得分}GoodHabitTest.prototype = {    constructor: GoodHabitTest,    initial: function () {        this.nextQuestionShow();    },    //点击后，下一题出现    nextQuestionShow: function () {        var _this = this;        var iNum = 0;        var iBtn = true;        this.item.hide().eq(0).show();        this.item.find("input").click(function () {            if (iBtn) {                iBtn = false;                var $that = $(this);                var questionItem = $that.parents(".question");                iNum++;                _this.aItemScore.push([                    questionItem.data("goodhabit"),                    questionItem.data("category"),                    parseInt($that.data("score"))                ]);                var timer = null;                clearTimeout(timer);                timer = setTimeout(function () {                    questionItem.hide().next(".question").show();                    iBtn = true;                }, 300);                if (iNum > _this.item.length - 1) {                    iNum = 0;                    _this.totalScore();                }            }        });    },    //计算分数    totalScore: function () {        var _this = this;        var json = {};//各分类对应总分        var timer = null;        var sum01 = 0, sum02 = 0, sum03 = 0, sum04 = 0, sum05 = 0, sum06 = 0, sum07 = 0;        clearTimeout(timer);        timer = setTimeout(function () {            _this.conclusion.show();        }, 300);        for (var i in this.aItemScore) {            //总分            this.sum += this.aItemScore[i][2];            //主动积极            if (this.aItemScore[i][1] == "01") {                sum01 += this.aItemScore[i][2];                json["主动积极"] = sum01;                //以终为始            } else if (this.aItemScore[i][1] == "02") {                sum02 += this.aItemScore[i][2];                json["以终为始"] = sum02;                //要事第一            } else if (this.aItemScore[i][1] == "03") {                sum03 += this.aItemScore[i][2];                json["要事第一"] = sum03;                //知彼解己            } else if (this.aItemScore[i][1] == "04") {                sum04 += this.aItemScore[i][2];                json["知彼解己"] = sum04;                //双赢思维            } else if (this.aItemScore[i][1] == "05") {                sum05 += this.aItemScore[i][2];                json["双赢思维"] = sum05;                //统合综效            } else if (this.aItemScore[i][1] == "06") {                sum06 += this.aItemScore[i][2];                json["统合综效"] = sum06;                //不断更新            } else if (this.aItemScore[i][1] == "07") {                sum07 += this.aItemScore[i][2];                json["不断更新"] = sum07;            }        }        for (var item in lightFlash) {            //console.log(item);            this.oCategoryScore[item] = json[item];        }        console.log(this.oCategoryScore);        console.log(this.aItemScore);        //将数据渲染到页面        _this.render();        //将数据存储到后台        _this.saveData();    },    //页面内容更新    render: function () {        var totalScore = $(".total-score");        var epilogue = $(".epilogue");        var summaryStart = $(".summary-start");        var summaryEnd = $(".summary-end");        var lightFlashDiv = $(".light-flash");        var goodDiv = $(".light-flash > .good");        var badDiv = $(".light-flash > .bad");        var summaryNarrow = $(".summary-narrow");        var arr02 = [];//发光点（0-2分）        var arr34 = [];//发光点（3-4分）        var arr56 = [];//发光点（5-6分）        //总分        totalScore.find("span").eq(0).text(this.sum + 58).end()            .eq(1).text(parseInt(this.sum * 100 / 42));        //总评语        epilogue.text(summary[0].epilogue);        //导语、结语        if (this.sum < 15) {            summaryStart.show().text(summary[1]["start"]);            summaryEnd.show().text(summary[1]["end"]);        } else if (15 <= this.sum < 35) {            summaryStart.show().text(summary[2]["start"]);            summaryEnd.show().text(summary[2]["end"]);        } else if (35 <= this.sum < 42) {            summaryStart.show().text(summary[3]["start"]);            summaryEnd.show().text(summary[3]["end"]);        }        //发光点与警惕        for (var item in this.oCategoryScore) {            if (this.oCategoryScore[item] > 4) { //发光点（5-6分）                arr56.push(item);            } else if (this.oCategoryScore[item] < 3) {//发光点（0-2分）                arr02.push(item);            } else { //发光点（3-4分）                arr34.push(item);            }        }        if (arr56.length > 0) {            lightFlashDiv.show();            goodDiv.show();            for (var i in arr56) {                goodDiv.append("<p>▪ " + lightFlash[arr56[i]]["good"] + "</p>");            }        }        if (arr02.length > 0) {            lightFlashDiv.show();            badDiv.show();            for (var i in arr02) {                badDiv.append("<p>▪ " + lightFlash[arr02[i]]["bad"] + "</p>");            }        }        //各分类的总分是3-4分的或其他分的，显示以下内容        if (arr56.length == 0 && arr02.length == 0) {            summaryNarrow.show().text(summary[4]["narrow"]);        }    },    //将数据存储    saveData: function () {        $.ajax({            type: "post",            url: "/admin/save",            data: {                "sumScore": this.sum,                "aItemScore": JSON.stringify(this.aItemScore),                "oCategoryScore": JSON.stringify(this.oCategoryScore)            },            success: function (results) {                //console.log(results.success)                if (results.success == 1) {                    console.log("提交成功")                }            }        });        //存储到本地        //window.localStorage.setItem("conclusionHtml", this.conclusion.html());    }};