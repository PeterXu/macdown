function drawFlowChart(classname, inline) {
    var language_flow_list = document.getElementsByClassName(classname);
    for (var i = 0; i < language_flow_list.length; i++) {
        var el = language_flow_list[i];
        var eid = "language-flow-chart-" + i;
        var div = document.createElement("div"); 
        div.id = eid;

        var opts = {};
        var width = el.getAttribute("width");
        var height = el.getAttribute("height");
        if (width != null) {
            opts["line-width"] = parseInt(width);
        }
        if (height != null) {
            opts["line-length"] = parseInt(height);
        }

        var ppnode, pnode = el.parentNode;
        if (pnode.nodeName.toLowerCase() == "pre" && inline) {
            ppnode = pnode;
            pnode = el;
        } else {
            ppnode = pnode.parentNode;
        }

        var diagram = flowchart.parse(el.innerText);
        ppnode.insertBefore(div, pnode);
        pnode.style.display = 'none';
        diagram.drawSVG(eid, opts);
    }
}

(function () {
    drawFlowChart("language-flow", true);
    drawFlowChart("language-flowx", false);
})();
