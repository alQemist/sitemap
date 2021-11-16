/*function  saveChanges (d) {

    let nx = d.x/width
    let ny = d.y/height
    let sdata = []
    origData.forEach(function(xd){

        if(xd.entity_id == d.entity_id){
            xd.fixed_x = nx
            xd.fixed_y = ny
        }else{
            xd.fixed_x = xd.fixed_x/width
            xd.fixed_y = xd.fixed_y/height
        }
        delete xd.x
        delete xd.y
        sdata.push(xd)
    })

    let jsonObj = Object()
    jsonObj['title']=title_text
    jsonObj['style_option']=style_option
    jsonObj['is_fixed']=is_fixed
    jsonObj['data']=sdata

    let jsonstr = JSON.stringify(jsonObj)
    let xdata = new Blob([jsonstr])
    let a = document.getElementById('exportbutton');
    a.href = URL.createObjectURL(xdata)

    load(sdata)

    var data = (d.entity_id).concat("-").concat(d.x/width).concat("-").concat(d.y/height)

    let url = "http://localhost:8888/d3-erd/erd_api.php?data="+data;

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, true);
    xhttp.onreadystatechange = function () {//Call a function when the state changes.

        if (this.readyState === 4 && this.status === 200) {
            var rt = xhttp.responseText;
            console.log(xhttp.responseText)
        }
    }
    return xhttp.send();
}*/
function getJsonData(d) {

    let jsonstr = JSON.stringify(d)
    let xdata = new Blob([jsonstr])
    let a = document.getElementById('exportbutton');
    a.href = URL.createObjectURL(xdata)
    a.download = "Site.json"

    style_option = d.style_option

    let dates = d.timeline.map(d => d.date)
    showdate = dates[0]

    var ds = d3.select(".date-select")
        .on("change", function () {
            let o = d3.select(this)
            showdate = o.node().value
            console.log(showdate, timelineData)
            duration = 0
            addTreeView(timelineData)
        })

        dates.reverse()
        dates.forEach(function (o, i) {
        ds.append("option")
            .html(o)
    })

    showdate = dates[0]
    jsonData = d.timeline[0].data
    timelineData = d
    addTreeView(d);

}

setTimeout(function () {
    d3.json('data/site.json', function (data) {
        getJsonData(data)
    })
}, 100)