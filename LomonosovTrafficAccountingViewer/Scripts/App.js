function compareUsersIn(usrA, usrB) //for sort with key input
{
    return usrB.packets_in - usrA.packets_in;
}

function compareUsersOut(usrA, usrB) //for sort with key output
{
    return usrB.packets_out - usrA.packets_out;
}

function compareSummary(usrA, usrB) //sort by summary in and out
{
    return usrB.packets - usrA.packets;
}
//------------------------------------------------------------------------------------------


function getStructure() //parsing. Return value users structure
{
    var i, j, i1 = -1, j1 = 0, pos1 = 0, counter = 0;
    var dataString;
    var users = [];
	

    var dataStringIn = this.csvData();
    //check
    if (!dataStringIn) {
        return [];
    }

    //cutting header---
    var strP = dataStringIn.indexOf("\n", 0);
    dataString = dataStringIn.substring(strP+1,dataStringIn.length);
    //-----------------
	
    var dataArr = dataString.split('\n');

    for (i=0; i<dataArr.length-1; i++)
    {
        var subArr = dataArr[i].split(',');
        if (subArr[0]!=" ")
            counter++;
    }
	
    for (i=0; i<counter; i++)
    {
        users.push({});
        users[i].user = [];
    }

    for (i=0; i<dataArr.length-1; i++)
    {
        var elemArr = dataArr[i].split(',');
        if (elemArr[0] != " ")
        {
            i1++;
            j1 = 0;
            users[i1].data = elemArr[0]; //document.write("!"+elemArr[0]+"!"); document.write("<br>");
            users[i1].time = elemArr[1];
        }
        users[i1].user.push({});
        users[i1].user[j1].UID = elemArr[4];
        users[i1].user[j1].bytes_in = elemArr[5];
        users[i1].user[j1].packets_in = elemArr[6];
        users[i1].user[j1].bytes_out = elemArr[7];
        users[i1].user[j1].packets_out = elemArr[8];
        j1++;
    }
	
    return users;
}

function getTop(mode, startD, startT, endD, endT, usrList)  //just sort. If sort by input info, then insert 1 as "input". If sort by output - "input" = 0. StartD, endD - start and end data
    //startT, endT - start and end time. usrList - our structure.
    //IMPORTANT!!! start, end time must be exactly like in the measurements! 
    //TODO: make time choosing according to measurement's time. (Not random)
{
    var i, j, idxStart = -1, idxEnd = -1;
    var topUsers = [];
    i = usrList.length - 1;
    if (i === -1)
        return [];
    for (j = 0; j < usrList[i].user.length; j++) {
        topUsers.push({});
    }

    for (i = 0; i < usrList.length; i++) {
        if ((usrList[i].data == startD) && (usrList[i].time == startT)) {
            idxStart = i;
            break;
        }
    }
    for (i = 0; i < usrList.length; i++) {
        if ((usrList[i].data == endD) && (usrList[i].time == endT)) {
            idxEnd = i;
            break;
        }
    }

    i = idxStart;
    while (i <= idxEnd) {
        for (j = 0; j < usrList[i].user.length; j++) {
            topUsers[j].packets_in = 0;
            topUsers[j].packets_out = 0;
            topUsers[j].bytes_in = 0;
            topUsers[j].bytes_out = 0;
        }
        i++;
    }

    i = idxStart;
    while (i <= idxEnd) {
        for (j = 0; j < usrList[i].user.length; j++) {
            topUsers[j].UID = usrList[i].user[j].UID;
            topUsers[j].packets_in = topUsers[j].packets_in * 1 + usrList[i].user[j].packets_in * 1;
            topUsers[j].packets_out = topUsers[j].packets_out * 1 + usrList[i].user[j].packets_out * 1;
            topUsers[j].bytes_in = topUsers[j].bytes_in * 1 + usrList[i].user[j].bytes_in * 1;
            topUsers[j].bytes_out = topUsers[j].bytes_out * 1 + usrList[i].user[j].bytes_out * 1;
        }
        i++;
    }

    if (mode === "input") {
        topUsers.sort(compareUsersIn)
    }
    else if (mode === "output") {
        topUsers.sort(compareUsersOut);
    }

    return topUsers;
}

function getTopSummary(startD, startT, endD, endT, usrList)  //Like previous, but sort by summary in and out
{
    var i, j, idxStart = -1, idxEnd = -1;
    var topUsers = [];
    i = usrList.length - 1;
    for (j = 0; j < usrList[i].user.length; j++) {
        topUsers.push({});
    }

    for (i = 0; i < usrList.length; i++) {
        if ((usrList[i].data == startD) && (usrList[i].time == startT)) {
            idxStart = i;
            break;
        }
    }
    for (i = 0; i < usrList.length; i++) {
        if ((usrList[i].data == endD) && (usrList[i].time == endT)) {
            idxEnd = i;
            break;
        }
    }

    i = idxStart;
    while (i <= idxEnd) {
        for (j = 0; j < usrList[i].user.length; j++) {
            topUsers[j].packets = 0;
            topUsers[j].bytes = 0;
            topUsers[j].packets_in = 0;
            topUsers[j].packets_out = 0;
            topUsers[j].bytes_in = 0;
            topUsers[j].bytes_out = 0;
        }
        i++;
    }

    i = idxStart;
    while (i <= idxEnd) {
        for (j = 0; j < usrList[i].user.length; j++) {
            topUsers[j].UID = usrList[i].user[j].UID;
            topUsers[j].packets_in = topUsers[j].packets_in * 1 + usrList[i].user[j].packets_in * 1;
            topUsers[j].packets_out = topUsers[j].packets_out * 1 + usrList[i].user[j].packets_out * 1;
            topUsers[j].bytes_in = topUsers[j].bytes_in * 1 + usrList[i].user[j].bytes_in * 1;
            topUsers[j].bytes_out = topUsers[j].bytes_out * 1 + usrList[i].user[j].bytes_out * 1;
            topUsers[j].packets = topUsers[j].packets * 1 + usrList[i].user[j].packets_in * 1 + usrList[i].user[j].packets_out * 1;
            topUsers[j].bytes = topUsers[j].bytes * 1 + usrList[i].user[j].bytes_in * 1 + usrList[i].user[j].bytes_out * 1;
        }
        i++;
    }

    topUsers.sort(compareSummary);

    return topUsers;
}


function AppViewModel() {
    var _this = this;
    this.csvData = ko.observable("");
    this.endDate = ko.observable("12 04 2016");
    this.endTime = ko.observable("17:34:31");
    this.isBoth = ko.pureComputed(function () {
        if (_this.mode() === "both")
            return true;
        return false;
    })
    this.mode = ko.observable("input");
    this.startDate = ko.observable("12 04 2016");
    this.startTime = ko.observable("17:34:16");
    this.users = ko.pureComputed(getStructure, this);
    this.selectedUsers = ko.pureComputed(function () {
        if (this.mode() === "both")
            return getTopSummary(this.startDate(), this.startTime(), this.endDate(), this.endTime(), this.users());
        return getTop(this.mode(), this.startDate(), this.startTime(), this.endDate(), this.endTime(), this.users());
    }, this);

    var plot = InteractiveDataDisplay.asPlot("idd");

    this.graphic = ko.computed(function () {
       // plot.clear();
        var x = [], y = [];
       
        plot.polyline("sum", { x: ["a", "b"], y: [2, 3] });

    }, this);
    
    $.get("trafficFile-2016-04-16.csv", function (data) {
        _this.csvData(data);
    });

}

$(document).ready(function () {
    $("#datepicker").datepicker();
    $("#slider").slider();
    // Activates knockout.js
    ko.applyBindings(new AppViewModel());
});