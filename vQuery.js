function bindEvent(obj, events, func) {
    if (obj.addEventListener) {

        obj.addEventListener(events, function(event) {
            
            if (func() == false) {

                event.preventDefault();
                event.cancelBubble = true;
            }

        }, false);
    } else {
        obj.attachEvent('on' + events, function(event) {

            if (func() == false) {

                window.event.cancelBubble = true;
                return false;
            }

        });
    }
}

// 队列
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}

function getByClass(oParent, sClass) {
    var arr = [];
    var elems = oParent.getElementsByTagName('*');

    for (let i = 0; i < elems.length; i++) {
        if (elems[i].className == sClass) {
            arr.push(elems[i]);
        }

    }
    return arr;

}

function toArray(elems) {
    var arr = [];
    for (let i = 0; i < elems.length; i++) {
        arr.push(elems[i]);
    }

    return arr;
}

function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return obj.getComputedStyle[attr];
    }
}

function Vquery(vArg) {

    this.elements = []; // 选择元素存储的集合

    switch (typeof vArg) {
        case 'function':
            // window.onload = vArg;
            // bindEvent(window, 'load', vArg);
            addLoadEvent(vArg);
            break;
        case 'string':
            switch (vArg.charAt(0)) {
                case '#': //id
                    this.elements.push(document.getElementById(vArg.substring(1)));
                    break;
                case '.': //class
                    this.elements = getByClass(document, vArg.substring(1));
                    break;
                default: //tag
                    this.elements = toArray(document.getElementsByTagName(vArg));
                    break;
            }
            break;
        case 'object':
            if (vArg.constructor == Array) {

                this.elements = vArg;
            } else {
                
                this.elements.push(vArg);
            }
            break;
        default:
            break;
    }
}

// 面向对象程序的函数应该放在构造函数的原型下

/**
 * css函数, 仿jq的css函数
 */
Vquery.prototype.css = function (attr, value) {

    if (arguments.length == 2) { // 设置

        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].style[attr] = value

        }
    } else if (arguments.length == 1) { // 获取
        if (typeof attr == 'object') {

            for (const key in attr) {
                for (let i = 0; i < this.elements.length; i++) {
                    this.elements[i].style[key] = attr[key];
                }
            }
        } else {
            return getStyle(this.elements[0], attr);
        }
    }

    return this;
}

/**
 * html函数
 */
Vquery.prototype.html = function (html) {

    if (html) { // 设置

        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].innerHTML = html;

        }
    } else { // 获取
        return this.elements[0].innerHTML;
    }

    return this;

}

Vquery.prototype.attr = function (attr, value) {

    if (arguments.length == 2) { // 设置
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].setAttribute(attr, value);

        }
    } else if (arguments.length == 1) { // 获取
        return this.elements[0].getAttribute(attr);
    }

    return this;
}

Vquery.prototype.eq = function (num) {

    return $(this.elements[num]);
}

Vquery.prototype.index = function() {

    // console.log(this.elements[0].parentNode);

    var children = this.elements[0].parentNode.children;
    for (let i = 0; i < children.length; i++) {
        if (children[i] == this.elements[0]) {
            return i;
        }
        
    }
}


Vquery.prototype.find = function(sel) {

    var arr = [];

    if (sel.charAt(0) == '.') {

        for (let i = 0; i < this.elements.length; i++) {
            arr = arr.concat(getByClass(this.elements[i], sel.substring(1)));
            
        }
    } else {

         console.log(this);
         for (let i = 0; i < this.elements.length; i++) {
             
             arr = arr.concat(toArray(this.elements[i].getElementsByTagName(sel)));
         }
    }

    return $(arr);
}



Vquery.prototype.click = function (func) {

    // for (let i = 0; i < this.elements.length; i++) {
    //     bindEvent(this.elements[i], 'click', func);

    // }

    this.on('click', func);
}

Vquery.prototype.mouseover = function (func) {

    // for (let i = 0; i < this.elements.length; i++) {
    //     bindEvent(this.elements[i], 'mouseover', func);

    // }

    this.on('click', mouseover);
}

Vquery.prototype.on = function (events, func) {

    for (let i = 0; i < this.elements.length; i++) {
        bindEvent(this.elements[i], events, func);

    }
}

Vquery.prototype.hide = function () {

    for (let i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'none';

    }
}

Vquery.prototype.show = function () {

    for (let i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'block';

    }
}

Vquery.prototype.hover = function (funcOver, funcOut) {

    funcOver && this.on('mouseover', funcOver);
    funcOut && this.on('mouseout', funcOut);
}

function $(vArg) {
    return new Vquery(vArg);
}

