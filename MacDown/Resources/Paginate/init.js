function addCSSRule(selector, newRule) {
	var mySheet = document.styleSheets[0];
	if (mySheet.addRule) {
		mySheet.addRule(selector, newRule);
	} else {
		ruleIndex = mySheet.cssRules.length;
		mySheet.insertRule(selector + '{' + newRule + ';}', ruleIndex);
	}
}

function splitColumn(w, h) {
	addCSSRule('html', 'padding: 0px; height: '+w+'px; -webkit-column-gap: 0; -webkit-column-width: '+h+'px;');
	addCSSRule('p', 'text-align: justify;');
}

// paginate column auto by <pagey/> 
function paginateY(width, height) {
	splitColumn(width, height);
}

function loadStyles(url) {
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = url;
	document.getElementsByTagName("head")[0].appendChild(link);
}

function hasClass(elem, cls) {
	cls = cls || '';
	if (cls.replace(/\s/g, '').length == 0) 
		return false;
	return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
}

function addClass(elem, cls) {
	if (!hasClass(elem, cls)) {
		elem.className = (elem.className == '' ? cls : elem.className + ' ' + cls);
	}
}


function loadPageCSS(paper){
	addClass(document.body, "document");
	// sheets-of-paper-{a3,a4,uslegal,usletter}.css
	var url = "https://delight-im.github.io/HTML-Sheets-of-Paper/css/sheets-of-paper-"+paper+".css";
	loadStyles(url);
}

// paginate manually by <pagex/>
function paginateX(paper) {
	var text = document.createElement("div");
	text.innerHTML = document.body.innerHTML;

	var ctrl = document.createElement("div");
	ctrl.setAttribute("class", "ctrl");
	for (var i=0; i < text.childNodes.length; i++) {
		var e = text.childNodes[i];
		var ename = e.nodeName.toLowerCase();
		if (ename == "script" || ename == "style") {
			ctrl.appendChild(e); // this will remove e from text.childNodes at the same time.
		}
	}

	// now text have no-script/style nodes
	var htmls = text.innerHTML.split("</pagex>");
	var html = '<div class="page">' + htmls.join('</pagex></div><div class="page">') + '</div>';
	document.body.innerHTML = html;
	document.body.appendChild(ctrl);
	loadPageCSS(paper);
}

function check_html(htmls, emptys, height) {
	var idx = 0;
	if (htmls.length >= 1) {
		idx = htmls.length - 1;
	}
	if (idx >= htmls.length) {
		htmls[idx] = "";
	}
	if (idx >= emptys.length) {
		emptys[idx] = height;
	}
	return idx;
}

function push_html(e, htmls, emptys, idx, height) {
	if (e.outerHTML == undefined)
		return;
	if (htmls[idx] == undefined)
		htmls[idx] = "";
	htmls[idx] += e.outerHTML;
	emptys[idx] -= e.offsetHeight;
	if (emptys[idx] <= 1) {
		idx += 1;
		htmls[idx] = "";
		emptys[idx] = height;
	}
}

function loop_child(e, height, htmls, emptys) {
	if (e.outerHTML == undefined) {
		return;
	}

	var idx = check_html(htmls, emptys, height);
	var need = emptys[idx];

	var ename = e.nodeName.toLowerCase();
	if ((ename == "h1" || ename == "h2") && need < height/4) {
		idx += 1;
		emptys[idx] = height;
	}

	push_html(e, htmls, emptys, idx, height);
}


// paginate auto by <pagez/>
function paginateZ(height, paper) {
	var text = document.createElement("div");
	text.innerHTML = document.body.innerHTML;

	var ctrl = document.createElement("div");
	ctrl.setAttribute("class", "ctrl");
	for (var i=0; i < text.childNodes.length; i++) {
		var e = text.childNodes[i];
		var ename = e.nodeName.toLowerCase();
		if (ename == "script" || ename == "style") {
			ctrl.appendChild(e); // this will remove e from text.childNodes at the same time.
		}
	}

	var htmls = new Array();
	var emptys = new Array();
	for (var i=0; i < document.body.childNodes.length; i++) {
		var e = document.body.childNodes[i];
		var ename = e.nodeName.toLowerCase();
		if (ename == "script" || ename == "style") {
			continue;
		}
		loop_child(e, height, htmls, emptys);
	}

	var html = '<div class="page">' + htmls.join('</div><div class="page">') + '</div>';
	//html = '<div class="page">' + htmls.join("") + '</div>';
	document.body.innerHTML = html;
	document.body.appendChild(ctrl);
	loadPageCSS(paper);
}

function paginate() {
	var pages = ["pagex", "pagez", "pagey"];
	for (var i=0; i < pages.length; i++) {
		var elems = document.getElementsByTagName(pages[i]); 
		if (elems.length <= 0)
			continue;
		var width = parseInt(elems[0].getAttribute("width"));
		var height = parseInt(elems[0].getAttribute("height"));
		if (isNaN(width) || width <= 0) width = 640;
		if (isNaN(height) || height <= 0) height = 480;

		var paper = elems[0].getAttribute("paper");
		if (isNaN(paper)) paper = "a4";
		else if (paper != "a4" && paper != "a3" && paper != "usletter" && paper != "uslegal")
			paper = "a4";

		if (i == 0) {
			paginateX(paper);
			break;
		}else if (i == 1) {
			paginateZ(height, paper);
			break;
		}else {
			paginateY(width, height);
			break;
		}
	}
}

(function () {
	paginate();
})();
