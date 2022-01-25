var legend_array = [];
var char_width = 8
var dash = 0;
var tooltip
var closebtn = d3.selectAll(".close")
var popup = d3.select(".popup")
var contextmenu = d3.select(".context-menu")
var style_option,jsonData,showdate,timelineData
var duration = 1000

var target = d3.select(".svgContainer")

d3.selectAll(".hlinks")
    .on("click",function(){
        let l = d3.select(this).attr("data-url")
        console.log(l)
        window.open(l,"_blank")
    })

closebtn.on("click", function () {
    hidePopups();
    showTooltip()
})
tooltip.on("mouseleave", function () {
    showTooltip()
})

function hidePopups() {

    popup.style("opacity", 0)
        .style("left", "-4000px")

    setContextMenu()
}

function openURL(u) {
    window.open(u, "_blank")
}

function addTreeView(td) {

    let legend_array = td.legend_keys;
    let legend_key = td.legend_key;

    let dd = td.timeline.filter(function(t){
        if(t.date == showdate)
        return t.data
    })[0]

    let d = dd.data

    const threshold = 80; // max number of nodes to display at opening

    var b = d3.select("body")
    b.selectAll("svg").remove()

    tooltip = d3.select(".tooltip")

    var legend = b.append("svg")
        .classed("legend", true)

    b.selectAll("h4").remove()


    b.append("h4")
        .classed("subtitle", true)
        .html("ENTERPRISE ARCHITECTURE AND GOVERNANCE")


    b.append("h4").classed("vtab", true)
        .style("width", function () {
            return (window.innerHeight * .8) - 80 + "px"
        })
        .html(td.title_text.toUpperCase())

    b.append("span")
        .classed("title", true)

    var icondefs = b.append("svg")
        .classed("iconbox", true)
        .append("defs")


    function setLegend() {

        d3.select(".title")
            .html(function () {
                //return legend_array.join(", ")
            })


        var l = legend.append("g")
        //.attr("x",10)


        let y = 0;
        legend_array.forEach(function (d, i) {
            y = y + 30;
            l.append("rect")
                //.classed("noderect",true)
                .attr("x", 2)
                .attr("y", y+2)
                .attr("rx", function () {
                    let r = 10
                    return r
                })
                .attr("ry", function () {
                    let r = 10
                    return r
                })
                .attr("width", function () {
                    let w = (d.length * char_width) + 65
                    return w
                })
                .attr("height", function () {
                    let h = 20
                    return h
                })
                .style("fill", function () {
                    let c =  colors[legend_array.indexOf(d)]
                    return c;
                })
                .style("stroke-width", "4px")
                .style("stroke", function () {
                    let c =  colors[legend_array.indexOf(d)]
                    return c
                })


        })
             y = 0;
       legend_array.forEach(function (d, i) {
            y = y + 30;
            l.append("text")
                .attr("y", y + 16)
                .attr("x", "30px")
                .text(d)
                .style("font-family","Helvetica")

        })

        y += 30;
       /* indicator_array.forEach(function (d, i) {
            y = y + 30;
            l.append("rect")
                //.classed("noderect",true)
                .attr("x", 2)
                .attr("y", y)
                .attr("rx", function () {
                    var r = 12
                    return r
                })
                .attr("ry", function () {
                    var r = 12
                    return r
                })
                .attr("width", function () {
                    let w = 24
                    return w
                })
                .attr("height", function () {
                    let h = 24
                    return h
                })
                .style("fill", function () {
                    var f = indicator_colors[indicator_array.indexOf(d)]
                    return f;
                })
                .style("stroke-width", function () {
                    let w = "6px"
                    return w
                })
                .style("stroke", function () {
                    var c  = indicator_colors[indicator_array.indexOf(d)]
                    return c
                })

            l.append("text")
                .attr("y", y + 16)
                .attr("x", "30px")
                .text(d)
                .classed("indicator",true)
                .style("font-family","Helvetica")
        })
*/


    }


    function setTreeHeight() {
        var levelWidth = [1];
        var childCount = function (level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function (d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var h = window.innerHeight //- (target_margin.bottom + target_margin.top) ;
        var newHeight = Math.max(h, (d3.max(levelWidth) * 26)); // 20 pixels per line

        var node_width = 1 / (levelWidth.length+.5)

        return [node_width, newHeight];

    }

    function unflatten(arr) {

        var root = {
            name: arr[0].name,
            parents: [],
            parent: arr[0].parent,
            type: arr[0].type,
            description: arr[0].description,
            items: arr[0].items,
            links: arr[0].links,
            state: arr[0].state,
            implemented:arr[0].implemented,
            children: []
        };

        // Put a root node into the tree
        var nodes = arr.map((e) => {

            return {
                name: e.name,
                parent: e.parent,
                parents: [],
                children: [],
                type: e.type,
                description: e.description,
                url: e.url,
                items: e.items,
                links: e.links,
                state:e.state,
                implemented: e.implemented
            };
        });
        nodes.push(root);


        // construct a title index
        let nameIndex = {};
        nodes.forEach(n => {
            let nid = n.nid ? n.nid : n.name;
            nameIndex[nid] = n;
        });


        // Each node will have a list of its parents.  Locate each parent with the index.
        nodes.forEach(n => {
           let nindex = n.parent;

            if (n.parent){
                n.parents.push(nameIndex[nindex]);
            }
            // find all instances of parent and add this node as a child
            //var name = n.name
            let pc = nodes.filter((obj) => obj.name == n.parent )
            if(pc.length > 2){
                //n.parents = [];
                //console.log( n.name,n.parent, pc)

                pc.forEach(function(p,i){
                    //console.log(p)
                    //n.depth = p.depth +1
                   //p.children.push(n)

                })
            }
        });

        // Push each node as a child of all its parents.  Delete the parents list to avoid circular JSON.

        nodes.forEach(n => {
            n.parents.forEach(p => {
                p.children.push(n);
                //if(n.name == p.parent){
               //     n.parents.push(n)
                //}

            });

           // delete n.parents;
        });

        //nodes.forEach((p) =>  p.children = [...new Set(p.children)])


        setTimeout(function(){
            setLegend();
        },200)

        return root;

    }

    var treeData = unflatten(d);


    // ************** Generate the tree diagram	 *****************

    target_margin = {top: 80, right: 200, bottom: 20, left: 250},
        width = window.innerWidth - target_margin.right - target_margin.left,
        height = window.innerHeight //- target_margin.top //- target_margin.bottom - 60


    var i = 0,
        root,
        nodes;

    var tree = d3.layout.tree()
        //.size([height - (target_margin.top + target_margin.bottom), width]);

    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.x, d.y];
        });


    var svg = target
        .append("svg")
        .attr("width", width + target_margin.right + target_margin.left)
        .attr("height", window.innerHeight)
        .append("g")
        .attr("transform", "translate(" + target_margin.left + "," + target_margin.top + ")");

    root = treeData;
    root.x0 = 0 // setTreeHeight() / 3;
    root.y0 = 0;


    d3.select(self.frameElement).style("height", height + "px");

    function update(source) {

        // Compute the new tree layout.
        var node_y = setTreeHeight()[0];
        height = setTreeHeight()[1];

        tree.size([width-target_margin.right, height]);

        root.x0 = (width *.5 )-target_margin.right

        nodes = tree.nodes(root).reverse()
            links = tree.links(nodes);
        // Normalize for fixed-depth.
        nodes.forEach(function (d) {
            d.y = d.depth * (height * node_y);
        });
        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });
        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function () {
               return  "translate(" + (source.x0) + "," + source.y0 + ") rotate(90)"
            })


        nodeEnter.append("rect")
            .classed("nodebg", true)
            .attr("x", function(d){
                let w = (d.name).length *char_width + 50
                let x = d.depth <= 0 ? (w * -.5) +12 : -12
                return x
            })
            .attr("y", -12)
            .attr("rx", function (d) {
                var r = 12
                return r
            })
            .attr("ry", function (d) {
                var r = 12
                return r
            })
            .attr("width", function (d) {
                let w = (d.name).length *char_width + 20
                return w
            })
            .attr("height", function (d) {
                let h = 24
                return h
            })
            .style("fill", function (d) {
                let c = colors[d[legend_key]]
                return c
            })
            .style("stroke", function (d) {
                let c = colors[d[legend_key]]
                return c
            })
            .on("click", click)

        nodeEnter.append("rect")
            .classed("noderect", true)
            .attr("x", -15)
            .attr("y", -15)
            .attr("rx", function (d) {
                var r = 15
                return r
            })
            .attr("ry", function (d) {
                var r = 15
                return r
            })
            .attr("width", function (d) {
                let w = 30
                return w
            })
            .attr("height", function (d) {
                let h = 30
                return h
            })
            .style("fill",function(d){
                var c = colors[d[legend_key]]
                return c
            })
            .style("stroke",function(d){
                var c = colors[d[legend_key]]
                return c
            })
            .style("stroke-width", function () {
                let w = "6px"
                return w
            })


        var t = nodeEnter.append("text")

        t.attr("x", function (d) {
            return   0;
        })
            .attr("dy", ".3em")
            .text(function (d) {
                return d.name;
            })
            .style("font-family","Helvetica")
            .style("text-anchor", function (d) {
                let ta = d.depth > 0 ? "start" : "middle";
                return ta
            })

        t.on("click", click)


        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) {
                let ro = d.depth > 0  ? " rotate(90)" : ""
                return "translate(" + d.x + "," + d.y + ")" + ro;
            })


        nodeUpdate.select("text")
            .style("fill-opacity", 1);
        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit()
            .transition()
            .duration(duration)
            .attr("transform", function (d) {
                let ro = d.depth? " rotate(90)" : ""
                return "translate(" + source.x + "," + source.y + ")" + ro;
            })
            .remove();

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);
        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function (d) {
                return d.target.id;
            });
        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("fill","none")
            .attr("stroke","rgb(150, 150, 150)")
            .attr("stroke-width","2px")
            .attr("d", function (d) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            });
        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);
        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            })
            .remove();
        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

// Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }

    update(root);


    setTimeout(function () {
        loaded();
    }, 30);

    function loaded() {
        nodes.forEach(function (d) {
            if (d.depth === 1 && threshold < nodes.length) {
                d._children = d.children;
                d.children = null;
                update(d);
            }
        });
    }

    target.style("opacity", 0)

    target.transition()
        .style("opacity", 1);

    //var scrollheight = target.property("scrollHeight") * .3;
//var sth = (scroll_y)? scroll_y :scrollheight;

  /*  target.transition()
        .delay(1500)
        .duration(1000)
        .tween("uniquetweenname", scrollTopTween(scrollheight))

    function scrollTopTween(scrollTop) {
        return function () {
            //console.log(this.scrollTop-target_margin)
            var i = d3.interpolateNumber(this.scrollTop, scrollTop);
            return function (t) {
                this.scrollTop = i(t);
            };
        };

    }*/

}
