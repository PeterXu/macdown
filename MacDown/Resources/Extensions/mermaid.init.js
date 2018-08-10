// init mermaid

(function () {

  mermaid.initialize({
    startOnLoad:false,
    flowchart:{
      htmlLabels: false,
      useMaxWidth: true
    }
  });

  var init = function() {
    drawMermaid(".language-mermaid", true);
    drawMermaid(".language-mermaidx", false);
    drawDoubleArrow();
  }
  function drawMermaid(classname, inline) {
    var domAll = document.querySelectorAll(classname);
    for (var i = 0; i < domAll.length; i++) {
    var dom = domAll[i];
    if (dom.tagName != "CODE") continue;
    var theme = dom.getAttribute("theme");
    if (theme != null) dom.removeAttribute("theme");
    var graphSource = dom.innerText || dom.textContent;
 
    dom = dom.parentElement;
    if (dom.tagName === "PRE" && inline) {
      dom = dom.parentElement;
    }
 
    var insertSvg = function(svgCode, bindFunctions){
      this.innerHTML = svgCode;
    };

    if (theme != null && theme.length >= 3) {
      mermaid.mermaidAPI.getConfig().theme = theme;
    }
    var graph = mermaid.mermaidAPI.render('graphDiv' + i, graphSource, insertSvg.bind(dom))
    }
  };

  function drawDoubleArrow() {
    var paths = document.querySelectorAll('path.path');
    for (let k = 0; k < paths.length; k++) {
      const path = paths[k];
      var dstr = path.getAttribute('d');
      var attr = path.getAttribute('marker-end');
      if (dstr == null || attr == null || attr.length <= 4)
        continue;
      var idx = attr.replace(/url\((\S+)\)/, "$1x");
      if (idx == null || idx.length <= 4)
        continue;
      var attrx = document.querySelector(idx);
      if (attrx == null) 
        continue;
      var angle = compute_d_angle(dstr);
      if (angle != null) {
        attrx.setAttribute('orient', angle+'deg');
        path.setAttribute('marker-start', 'url('+idx+')');
      }
    }
  };
  function compute_d_angle(dstr) {
    var dlist = [];
    for (let k=0; k < dstr.length; k++) {
      let ch = dstr[k];
      if (ch === 'M' || ch === 'L' || ch === ',') {
        dlist.push(parseFloat(dstr.slice(k+1)));
      }
    }
    if (dlist.length < 6) return null;

    let angle = 0;
    let dx = dlist[2] - dlist[0];
    let dy = dlist[3] - dlist[1];
    if (Math.abs(dx) <= 0.01) {
      if (dy > 0) angle = 90;
      else angle = 270;
    }else {
      angle = (Math.atan(Math.abs(dy/dx)) / Math.PI * 180);
      if (dy > 0) {
        if (dx > 0) angle = 0 + angle;
        else angle = 180 - angle;
      }else {
        if (dx > 0) angle = 360 - angle;
        else angle = 180 + angle;
      }
    }
    angle = (angle + 180) % 360;
    return angle;
  };
 
  if (typeof window.addEventListener != "undefined") {
    window.addEventListener("load", init, false);
  } else {
    window.attachEvent("onload", init);
  }
})();
