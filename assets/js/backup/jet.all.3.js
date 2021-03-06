//加入 jattr jstyle jroot
//bug: 对于数组，若是没有绑定元素，则无法使用$push等方法
//      对于数组，直接对数组赋值，ui不会改变
//jui checkbox 由于以上两点bug 很难完成
//jui select 对绑定的选项进行$push 或其他操作，ui不变


//暂不支持路由的嵌套
//暂不支持动态添加元素的渲染 已通过init解决
//暂不支持jrepeat 重复单个元素
//jdom获取样式有待改进
//jif jshow jattr jstyle 数组中不支持index
//jimg 的想法 已通过js修改图片的src解决

//2018
//1-25 修复了一个for的bug 没有包裹each时，元素的孩子和文字顺序会混乱
//2-1 新增了ondatachange；修复了 jif中attr的不能正确移除属性的bug
//2-3 新增jdom 
//2-5 jrun jon 支持多个函数，支持js代码，jon支持绑定多个事件
//2-6 jload 修复了子模版使用父模版元素的bug
//2-6 可以越过作用域一级一级向上查找属性，不会直接报错
//2-7 新增jhtml属性, text元素设置html值
//2-7 新增$makeChange方法，手动触发某值改变的回调函数
//2-8 发现并修复空值不会渲染的bug
//2-9 修复多层循环 使用 $.$par.$index 的bug

//修复bug：jetterjs 验证express 不会显示正确的错误提示
//修复bug：jetterjs 验证decimal ->float

//Jet新增 $jui()

//18-3-20:
// 路由配置 默认与名称一样
// 新增 css.conf 文件 可以设置css变量和函数 设置路由模板的公共样式
// Jet.$route Jet.$route.back Jet.$route.forward
//valid 可以设置 useJUI
//$remove 支持元素
//18-3-21
//新增jui page tab
//18 3-22
//修复一个ie上的hash模式时的页面不会正确加载的bug
//3-23 新增了 $r 获取根元素数据，修改了get方法
//JUI msg新增 hover参数 默认为true 鼠标移上时不会自动消失

//18 3-27 完善了ajax $ajax $ajax.get $ajax.post 
//j-icon font-size 初始值为 inherit
// 修复了 for 的关于索引的 bug 
// for 的直接孩子 bind元素现在可以正确的在属性中使用 $ 来代替其所绑定的数据 ,对数组操作进行了完善

/*3-28 修复了jload和路由组件模式下 JUI绑定的bug 现在如果jui-bind的属性不在当前Jet元素的数据中，则会在子Jet元素中寻找，如果都没有则会忽略掉
  子页面的Jet最好使用 ele:jdom 指定Jet绑定的html元素，这样可以很好地解决子页面与父页面和子页面与子页面之间的命名冲突的问题
  增加了Jet name属性，用于生成一个在Jet.$ele 中的以 name属性命名的 Jet元素变量
*/
//3-30 jattr和jstyle添加 $r 的支持
//3-31 新增Jet.valid.useOnInput
/*4-2 新增 Jet.prototype.$init 对动态添加的元素 初始化
  新增 Jet.prototype.$cookie 操作cookie
  新增 Jet.prototype.$storage 操作localStorage
  修复了 input类型元素 绑定的是数字 后可能会导致的类型紊乱的错误
  修复了 input类型元素输入焦点会到最后面的bug
*/
//4-4 修复了 数组元素的国际化 bug
// 国际化现在可以包含一个json或者数组，而不只是一个值类型

//(function(){
  var _JT = {
    cls: function(a) {
      return _checkSelect(document.getElementsByClassName(a))
    },
    id: function(a) {
      return _checkSelect(document.getElementById(a))
    },
    tag: function(a) {
      return _checkSelect(document.getElementsByTagName(a))
    },
    attr: function(a) {
      return _checkSelect(document.querySelectorAll("[" + a + "]"))
    },
    name: function(a) {
      return _checkSelect(document.getElementsByName(a))
    },
    select: function(a) {
      return _checkSelect(document.querySelectorAll(a))
    },
    body: function() {
      return document.body
    },
    type:_type,
    ct: _create,
    ajax:_ajax,
    cookie:_cookie,
    load:_load,
    clone:_clone,
    html5:function(){
      if (window.applicationCache) {
        return true;
      }
      return false;
    },
    urlParam: _getUrlParam
  };
  function _clone(obj){
    if(obj==undefined){
      return undefined;
    }
    var type=_type(obj);
    if(type=="htmlelement"||type=="array"){
      return obj._JT_clone();
    }else if(type=="json"||type=="object"){
      var a=new Object();
      for(var attr in obj){
        if(obj[attr]==null||obj[attr]==undefined){
          a[attr]=obj[attr];
        }else if(_type(obj[attr])=="array"){
          a[attr]=obj[attr].clone();
        }else if(_type(obj[attr])=="json"||_type(obj[attr])=="object"){
          a[attr]=_clone(obj[attr]);
        }else{
          a[attr]=obj[attr];
        }
      }
      return a;
    }else if(type=="number"||type=="boolean"||type=="string"||type=="function"){
      return obj;
    }else{
      return obj;
    }
  };
  function _storage(a,b){
    if(b===undefined){
      var d=localStorage.getItem(a);
      try{
        return JSON.parse(d)
      }catch(e){
        if(d===parseFloat(d).toString()){
          return parseFloat(d);
        }
        return d;
      }
    }else{
      if(typeof b==='object'){
        localStorage.setItem(a, JSON.stringify(b))
      }else{
        localStorage.setItem(a, b)
      }
      return b
    }
  }
  function _cookie(a, b, d, e) {
    if (arguments.length == 1) {
      if (document.cookie.length > 0) {
        var f = document.cookie.indexOf(a + "=");
        if (f != -1) {
          f = f + a.length + 1;
          var g = document.cookie.indexOf(";", f);
          if (g == -1) g = document.cookie.length;
          return unescape(document.cookie.substring(f, g))
        }
      }
      return ""
    } else {
      if (b == null) {
        _cookie(a, "", -1)
      } else {
        var c = a + "=" + escape(b);
        if (d != undefined) {
          var h = new Date();
          h.setDate(h.getDate() + d);
          c += ";expires=" + h.toGMTString()
        }
        if (e != undefined) {
          if (_type(e)=="boolean") {
            if (e) {
              c += (";path=/")
            }
          } else {
            c += (";path=" + e)
          }
        }
        document.cookie = c;
        return a + "=" + b
      }
    }
  };
  function _ajax(a) {
    var b = {
      type: a.type || "get",
      url: a.url || "",
      async: a.async || true,
      data: a.data || null,
      dataType: a.dataType || "text",
      contentType: a.contentType || "application/x-www-form-urlencoded",
      beforeSend: a.beforeSend ||function() {},
      success: a.success ||function() {},
      error: a.error ||function() {}
    };
    b.beforeSend();
    var c;
    if (window.XMLHttpRequest) {
      c =new XMLHttpRequest()
    } else if (window.ActiveXObject) {
      c = ActiveXObject("Microsoft.XMLHTTP")
    }
    var _d=_convertData(b.data);
    if(b.type.toLowerCase()=='get'&&_d!==''){
      b.url=b.url+'?'+_d;
    }
    c.open(b.type, b.url, b.async);
    c.responseType = b.dataType;
    c.setRequestHeader("Content-Type", b.contentType);
    if(b.type.toLowerCase()=='get'){
      c.send();
    }else{
      c.send(_d);
    }
    c.onreadystatechange = function() {
      if (c.readyState == 4) {
        if (c.status == 200) {
          b.success(c.response||c.responseText)
        } else {
          b.error(c.response||c.responseText)//errInfo
        }
      }
    }
    return c;
  };
  function _load(name,call,ecall){
    return _JT.ajax({ 
      url : name, 
      async:true,
      success : function(result){ 
        call(result);
      },
      base:false,
      error : function(err){ 
        if(ecall!=undefined)
          ecall(err);
        console.warn("加载失败:"+name);
      },
    })
  };
  function _create(a) {
    return document.createElement(a)
  };
  function _convertData(a) {
    if(a==undefined){
      return "";
    }
    if (_JT.type(a)=="json") {
      var b = "";
      for (var c in a) {
        b += c + "=" + a[c] + "&"
      }
      b = b.substring(0, b.length - 1);
      return b
    } /*else if(_JT.type(a)=="formdata"){
      if(a.entries!=undefined){
        var b = "";
        for (var i of a.entries()) {
          b += i[0] + "=" + i[1] + "&"
        }
        b = b.substring(0, b.length - 1);
        return b
      }
      return a;
    }*/else{
      return a;
    }
  }
  function _checkFunction(a){
    if(a==undefined){
      return function(){};
    }else{
      var b=_JT.type(a);
      if(b=="function"){
        return a;
      }else if(b=="string"){
        return new Function(a);
      }else{
        return function(){};
      }
    }
  }
  function _formatParams(a) {
    var b = [];
    for (var c in a) {
      b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a[c]))
    }
    return b.join("&")
  }
  
  function _checkSelect(b) {
    if(b==null||b==undefined){
      return [];
    }else if (b.length == 1) {
      return b[0]
    }
    return b
  };
  
  HTMLElement.prototype._JT_css = function(d, a) {
    if (a == undefined) {
      if (_JT.type(d)=="json") {
        for (var b in d) {
          if (d[b]._JT_has("!important")) {
            this.style.setProperty(b, _checkCssValue(this, b, d[b].substring(0, d[b].indexOf("!important"))), "important")
          } else {
            this.style.setProperty(b, _checkCssValue(this, b, d[b]))
          }
        }
        return this
      } else {
        return getComputedStyle(this)[d]
      }
    } else {
      if (a._JT_has("!important")) {
        this.style.setProperty(d, _checkCssValue(this, d, a.substring(0, a.indexOf("!important"))), "important")
      } else {
        this.style.setProperty(d, _checkCssValue(this, d, a))
      }
      return this
    }
  };

  function _checkCssValue(a, c, d) {
    if (d._JT_has("-=")||d._JT_has("+=")) {
      var e = _getCssNumberValue(d.substring(d.indexOf("=") + 1));
      if (d._JT_has("-=")) {
        e[0] = -e[0]
      }
      var b;
      if (d._JT_has("%")) {
        b = _getCssNumberValue(a.style[c])
      } else {
        b = _getCssNumberValue(getComputedStyle(a)[c])
      }
      return (e[0] + b[0]) + e[1]
    }
    return d
  };

  function _getCssNumberValue(a, b) {
    if (a == "" || a == undefined) {
      a = "0%"
    }
    if (b == undefined) {
      if (a._JT_has("px")) {
        b = "px"
      } else if (a._JT_has("%")) {
        b = "%"
      } else if (a._JT_has("em")) {
        b = "em"
      } else {
        return [parseFloat(a), "px"]
      }
    }
    return [parseFloat(a.substring(0, a.indexOf(b))), b]
  };

  function _checkStyleName(b) {
    var a = b.split("-");
    if (a.length <= 1) {
      return b
    } else {
      var c = a[0];
      for (var i = 1; i < a.length; i++) {
        c += (a[i].charAt(0).toUpperCase() + a[i].substring(1))
      }
      return c
    }
  };
  HTMLElement.prototype._JT_attr = function(c, b) {
    if (b == undefined) {
      if (_JT.type(c)=="json") {
        for (var a in c) {
          if(a.trim()!=='')
            this.setAttribute(a, c[a])
        }
        return this
      } else {
        return this.getAttribute(c)
      }
    } else {
      if(c.trim()!=='')
        this.setAttribute(c, b);
      return this
    }
  };
  HTMLCollection.prototype._JT_attr = NodeList.prototype._JT_attr = function(d, c) {
    if (c == undefined && _JT.type(d)!="json") {
      var a = [];
      this._JT_each(function(b) {
        a._JT_append(b._JT_attr(d))
      });
      return a
    } else {
      this._JT_each(function(a) {
        a._JT_attr(d, c)
      });
      return this
    }
  };
  HTMLElement.prototype._JT_hasAttr = function(a) {
    return this.hasAttribute(a)
  };
  HTMLElement.prototype._JT_removeAttr = function(b) {
    var c = b.split(" ");
    if (c.length > 1) {
      var d = this;
      c._JT_each(function(a) {
        d.removeAttribute(a)
      })
    } else {
      this.removeAttribute(b)
    }
    return this
  };
  HTMLCollection.prototype._JT_removeAttr = NodeList.prototype._JT_removeAttr = function(b) {
    this._JT_each(function(a) {
      a._JT_removeAttr(b)
    });
    return this
  };
  HTMLElement.prototype._JT_findTag = function(a) {
    return _checkSelect(this.getElementsByTagName(a))
  };
  HTMLElement.prototype._JT_findAttr = function(a) {
    return _checkSelect(this.querySelectorAll("[" + a + "]"))
  };
  HTMLElement.prototype._JT_findClass = function(a) {
    return _checkSelect(this.getElementsByClassName(a))
  };
  HTMLElement.prototype._JT_select = function(a) {
    return _checkSelect(this.querySelectorAll(a))
  };
  HTMLElement.prototype._JT_addClass = function(a) {
    if(a._JT_has(" ")){
      var b = a.split(" ");
      var c = this;
      b._JT_each(function(i) {
        c._JT_addClass(i)
      });
    }else if(a.trim()!==""){
      if(_JT.html5()){
        this.classList.add(a)
      }else{
        if (!this._JT_hasClass(a)) {
          this.className += " " + a
        }
      }
    }
    return this
  };
  HTMLCollection.prototype._JT_addClass = NodeList.prototype._JT_addClass = function(a) {
    this._JT_each(function(b) {
      b._JT_addClass(a)
    });
    return this
  };
  HTMLElement.prototype._JT_removeClass = function(a) {
    if (a == undefined) {
      this.className = ""
    } else if(a.trim()!==""){
      if(a._JT_has(" ")){
        var c = a.split(" ");
        var d = this;
        c._JT_each(function(i) {
          d._JT_removeClass(i)
        })
      }else {
        if(_JT.html5()){
          this.classList.remove(a)
        }else{
          if (this._JT_hasClass(a)) {
            var b = new RegExp("(\\s|^)" + a + "(\\s|$)");
            this.className = this.className.replace(b, " ").trim()
          }
        }
      }
    }
    return this
  };
  HTMLCollection.prototype._JT_removeClass = NodeList.prototype._JT_removeClass = function(a) {
    this._JT_each(function(b) {
      b._JT_removeClass(a)
    });
    return this
  };
  HTMLElement.prototype._JT_val = function(a) {
    if (a == undefined && arguments.length == 0) {
      return this.value
    } else {
      if (this.tagName == "INPUT" || this.tagName == "TEXTAREA"||this.tagName == "SELECT") {
        this.value = _checkArg(a, "")
      }
      return this
    }
  };
  HTMLCollection.prototype._JT_val = NodeList.prototype._JT_val = function(v) {
    if (v == undefined) {
      var a = [];
      this._JT_each(function(b) {
        a._JT_append(b._JT_val())
      });
      return a
    } else {
      this._JT_each(function(b) {
        b._JT_val(v)
      });
      return this
    }
  };
  HTMLElement.prototype._JT_txt = function(a) {
    if (a == undefined && arguments.length == 0) {
      return this.innerText
    } else {
      this.innerText = _checkArg(a, "");
      return this
    }
  };
  HTMLCollection.prototype._JT_txt = NodeList.prototype._JT_txt = function(v) {
    if (v == undefined && arguments.length == 0) {
      var a = [];
      this._JT_each(function(b) {
        a._JT_append(b._JT_txt())
      });
      return a
    } else {
      this._JT_each(function(b) {
        b._JT_txt(v)
      });
      return this
    }
  };

  HTMLElement.prototype._JT_html = function(a) {
    if (a == undefined) {
      return this.innerHTML
    } else {
      this.innerHTML = a;
      return this
    }
  };
  HTMLCollection.prototype._JT_html = NodeList.prototype._JT_html = function(v) {
    if (v == undefined) {
      var a = [];
      this._JT_each(function(b) {
        a._JT_append(b._JT_html())
      });
      return a
    } else {
      this._JT_each(function(b) {
        b._JT_html(v)
      });
      return this
    }
  };
  HTMLElement.prototype._JT_allHtml = function(a) {
    if (a == undefined) {
      return this.outerHTML;
    } else {
      this.outerHTML=a;
      return this;
    }
  };
  HTMLCollection.prototype._JT_allHtml = NodeList.prototype._JT_allHtml = function(v) {
    var a = [];
    this._JT_each(function(b) {
      a._JT_append(b._JT_allHtml(v))
    });
    return a
  };
  HTMLElement.prototype._JT_hasClass = function(a) {
    if(a.trim()===""){
      return true;
    }
    if(_JT.html5()){
      return this.classList.contains(a);
    }
    return new RegExp("(\\s|^)" + a + "(\\s|$)").test(this.className)
  };
  HTMLElement.prototype._JT_next = function(i) {
    if (i != undefined) {
      return this._JT_parent()._JT_child(this._JT_index() + i)
    } else {
      return this._JT_parent()._JT_child(this._JT_index() + 1)
    }
  };
  HTMLElement.prototype._JT_prev = function(i) {
    if (i != undefined) {
      return this._JT_parent()._JT_child(this._JT_index() - i)
    } else {
      return this._JT_parent()._JT_child(this._JT_index() - 1)
    }
  };

  function _checkArg(a, b) {
    return (a == undefined) ? b : a
  };
  HTMLElement.prototype._JT_child = function(i) {
    if (i == undefined) {
      return this.children
    } else {
      return this.children[i]
    }
  };
  HTMLElement.prototype._JT_clone = function() {
    return this.cloneNode()._JT_html(this._JT_html());
  };
  HTMLElement.prototype._JT_parent = function(i) {
    if (i == undefined) {
      return this.parentElement
    } else {
      var p = this;
      for (var j = 0; j < i; j++) {
        p = p.parentElement
      }
      return p
    }
  };
  HTMLElement.prototype._JT_prepend = function(a) {
    var t=_JT.type(a);
    if (t=="array"||t=="htmlcollection"||t=="nodelist") {
      var b = this;
      a._JT_each(function(item) {
        b.insertBefore(_checkHtmle(item), b.children[0])
      })
    } else if(t=="string"){
      this.insertBefore(_checkHtmle(a),this.children[0])
    }else{
      this.insertBefore(_checkHtmle(a), this.children[0])
    }
    return this
  };
  HTMLCollection.prototype._JT_prepend = NodeList.prototype._JT_prepend = function(a) {
    this._JT_each(function(c) {
      c._JT_prepend(a)
    });
    return this
  };
  HTMLElement.prototype._JT_append = function(b, a) {
    if (a == undefined) {
      var type=_JT.type(b);
      if (type=="array"||type=="htmlcollection"||type=="nodelist") {
        for(var i=0;i<b.length;i++){
          this._JT_append(b[i]);
        }
      } else if(type=="string"){
        this._JT_append(_checkHtmle(b))
      }else{
        this.appendChild(_checkHtmle(b))
      }
    } else {
      this.insertBefore(_checkHtmle(b), this.children[a])
    }
    return this
  };
  HTMLElement.prototype._JT_toArray=function(){
    return [this];
  };
  HTMLCollection.prototype._JT_toArray = NodeList.prototype._JT_toArray = function(bool) {
    if(bool!=false){
      var a=[];
      for(var i=0;i<this.length;i++){
        a.push(this[i])
      }
      return a
    }else{
      return this;
    }
  };
  function _checkHtmle(a){
    if(_JT.type(a)=="string"){
      var e=_JT.ct("div")._JT_html(a);
      if(e._JT_child().length==1){
        return e._JT_child(0);
      }else{
        return e._JT_child()._JT_toArray();
      }
    }
    return a;
  };
  HTMLCollection.prototype._JT_append = NodeList.prototype._JT_append = function(b, a) {
    this._JT_each(function(c) {
      c._JT_append(b, a)
    });
    return this
  };
  HTMLElement.prototype._JT_index = function() {
    var a = this._JT_parent()._JT_child();
    for (var i = 0; i < a.length; i++) {
      if (a[i] == this) {
        return i
      }
    }
    return -1
  };
  HTMLElement.prototype._JT_on = function(a, b,d) {
    if(_JT.type(a)=="string"){
      return this._JT_event("on"+a,b,d);
    }else{
      for (var c in a) {
        a["on"+c]=a[c];
        delete a[c];
      }
      return this._JT_event(a,b);
    }
  };
  HTMLCollection.prototype._JT_on = NodeList.prototype._JT_on = function(a, c,d) {
    this._JT_each(function(b) {
      b._JT_on(_JT.clone(a), c,d)
    });
    return this
  };
  HTMLElement.prototype._JT_clk = function(b,d) {
    return this._JT_event("onclick",b,d);
  };
  HTMLCollection.prototype._JT_clk = NodeList.prototype._JT_clk = function(a, c) {
    this._JT_each(function(b) {
      b._JT_clk(a, c)
    });
    return this
  };
  
  HTMLElement.prototype._JT_event = function(a, b,d) {
    if(_JT.type(a)=="string"){
      if(d==true){
        _attachEvent(this,a,b);
      }else{
        this[a]=_checkFunction(b);
      }
    }else{
      for (var c in a) {
        if (a[c] != undefined) {
          if(b==true){
            _attachEvent(this,c,a[c]);
          }else{
            this[c]=_checkFunction(a[c]);
          }
        }
      }
    }
    return this
  };
  function _attachEvent(obj,event,fun){
    if (document.addEventListener) {
      obj.addEventListener(event.substring(2), _checkFunction(fun), false);
    } else if (document.attachEvent) {
      obj.attachEvent(event,  _checkFunction(fun));
    }
  };
  HTMLCollection.prototype._JT_event = NodeList.prototype._JT_event = function(a, c,d) {
    this._JT_each(function(b) {
      b._JT_event(a, c,d)
    });
    return this
  };
  HTMLElement.prototype._JT_empty = function() {
    return this._JT_html("")
  };
  HTMLCollection.prototype._JT_empty = NodeList.prototype._JT_empty = function() {
    this._JT_each(function(a) {
      a._JT_empty()
    });
    return this
  };
  HTMLElement.prototype._JT_remove = function() {
    this.parentNode.removeChild(this)
  };
  HTMLCollection.prototype._JT_remove = NodeList.prototype._JT_remove = function(a) {
    if (a == undefined) {
      for (var i = 0; i < this.length;) {
        this[i]._JT_remove()
      }
    } else {
      if (_JT.type(a)=="number") {
        for (var i = 0; i < this.length; i++) {
          if (i == a) {
            this[i]._JT_remove();
            return this
          }
        }
      } else {
        for (var i = 0; i < this.length; i++) {
          if (this[i] == a) {
            this[i]._JT_remove();
            return this
          }
        }
      }
    }
  };
  HTMLElement.prototype._JT_each = function(b,d) {
    b(this, 0,d);
    return this
  };
  HTMLCollection.prototype._JT_each = NodeList.prototype._JT_each = function(b,d) {
    var arr=this._JT_toArray();//removeClass 情况下
    for (var a = 0; a < arr.length; a++) {
      b(arr[a], a,d)
    }
    return this
  };
  Array.prototype._JT_each = function(b,d) {
    for (var a = 0; a < this.length; a++) {
      b(this[a], a,d)
    }
    return this
  };
  Array.prototype._JT_clone = function() {
    var a=new Array();
    this.forEach(function(item){
      a.push(_clone(item));
    });
    return a;
  };
  Array.prototype._JT_empty = function(b) {
    this.length = 0;
    return this;
  };
  HTMLElement.prototype._JT_last =function(){
    return this._JT_child()._JT_last();
  };
  HTMLElement.prototype._JT_first =function(){
    return this._JT_child()._JT_first();
  };
  HTMLCollection.prototype._JT_last = NodeList.prototype._JT_last =Array.prototype._JT_last = function(b) {
    return this[this.length-1];
  };
  HTMLCollection.prototype._JT_first = NodeList.prototype._JT_first =Array.prototype._JT_first = function(b) {
    return this[0];
  };
  Array.prototype._JT_remove = function(b,order) {
    var index=this.indexOf(b)
    if(order==false){
      this[a]=this[this.length--];
    }else{
      this._JT_removeByIndex(index);
    }
    return this
  };
  Array.prototype._JT_removeByIndex = function(b) {
    this.splice(b,1);
    return this
  };
  Array.prototype._JT_insert = function(b, i) {
    this.splice(i,0,b);
    return this
  };
  Array.prototype._JT_insertArray = function(arr,i) {
    var index=i;
    var n=arr.length;
    for (var a = this.length - 1; a >= index; a--) {
      this[a + n] = this[a]
    }
    for(var j=0;j<n;j++){
      this[index+j] = arr[j];
    }
    return this
  };
  Array.prototype._JT_append = function() {
    Array.prototype.push.apply(this,arguments)
    return this
  };
  Array.prototype._JT_prepend = function(b) {
    if(arguments.length==1){
      return this._JT_insert(b, 0)
    }else{
      return this._JT_insertArray(arguments, 0)
    }
  };
  function _each(obj,fun,arg){
    var type=_JT.type(obj);
    if(type=="json"||type=="object"){
      var k=0;
      for (var a in obj) {
        if(_JT.type(obj[a])!="function"){
          fun(obj[a], a,k,obj)
        }
        k++;
      }
    }else if(type=="number"||type=="boolean"||type=="string"||type=="function"){
      fun(obj, 0,arg);
    }else{
      obj._JT_each(fun,arg);
    }
    return obj;
  };
  function _type(obj){
    if(arguments.length==0){
      _throw("This function need a argument");
    }else{
      var type=typeof obj;
      if(type=="object"){
        if(obj===null){
          return "null";
        }else{
          var con = obj.constructor;
          switch(con){
            case Object:type="json";break;
            case Array:type="array";break;
            case HTMLCollection:type="htmlcollection";break;
            case NodeList:type="nodelist";break;
            //case FormData:type="formdata";break;
            case Error:type="error";break;
            case Date:type="date";break;
            default:if(obj.nodeType===1&&typeof obj.nodeName === 'string'){
                      type="htmlelement";
                    }else{
                      type="object";
                    };break;
          }
        }
      }
      return type;
    }
  };
  String.prototype._JT_has = function(s) {
    if (_JT.type(s)=="string") {
      if (this.includes == undefined) {
        return (this.indexOf(s) != -1)
      } else {
        return this.includes(s)
      }
    } else {
      if (this.match(s) == null) {
        return false
      } else {
        return true
      }
    }
  };
  String.prototype._JT_replaceAll = function(a, b) {
    if (_JT.type(b)=="array") {
      if (_JT.type(a)=="string") {
        var s = this.split(a);
        var d = s[0];
        s._JT_each(function(a, i) {
          if (i > 0) {
            d += (b[i - 1] + a)
          }
        });
        return d
      } else {
        var e = "";
        var f = this;
        var g = this.match(a);
        if (g != null) {
          g._JT_each(function(a, i) {
            var c = f.split(a);
            e += (f.substring(0, f.indexOf(a)) + b[i]);
            f = f.substring(f.indexOf(a) + a.length)
          });
          e += f;
          return e
        }
        return this
      }
    } else {
      if (_JT.type(a)=="string") {
        return this.replace(new RegExp(a, "g"), b)
      } else {
        return this.replace(a, b)
      }
    }
  };
  


  HTMLElement.prototype._JT_exist = function(call,callf){
    if(call!=undefined){
      _checkFunction(call)(this);
    }
    return true;
  };
  HTMLCollection.prototype._JT_exist = NodeList.prototype._JT_exist= Array.prototype._JT_exist= function(call,callf){
    if(this.length>0){
      if(this.length==1){
        _checkFunction(call)(this[0]);
      }else{
        _checkFunction(call)(this);
      }
      return true;
    }
    _checkFunction(callf)();
    return false;
  };
  
  function _getUrlParam() {
    var search='';
    if(location.search!=''){
      search=location.search.substring(1)
    }else if(location.hash._JT_has('?')){
      search=location.hash.substring(location.hash.indexOf("?")+1);
    }
    if (search=='') {
      return null
    } else {
      var d = decodeURI(search).split("&");
      var a = {};
      for (var c = 0; c < d.length; c++) {
        var b = d[c].split("=");
        a[b[0]] = b[1]
      }
      return a
    }
  };

  HTMLElement.prototype._JT_content = function(a) {
    if (this.tagName == "INPUT" || this.tagName == "TEXTAREA"|| this.tagName == "SELECT") {
      if (a == undefined && arguments.length == 0) {
        return this.value
      } else {
        try{
          this.value = _checkArg(a, "")
        }catch(e){
          
        }
      }
    } else {
      if (a == undefined && arguments.length == 0) {
        return this.innerText
      } else {
        this.innerText = _checkArg(a, "")
      }
    }
    return this
  };
  
  

 _JT.tag("head")._JT_append(_JT.ct("style")._JT_txt(".jet-hide{display:none!important}.jet-unpass{border-color:#f20!important;border-style:solid!important;background-color:rgba(255,0,0,.1)!important;color:red!important}"));
   
/*define*********************************************************************************/

function _define(obj,data,calls) {
  if(!calls._func)calls._func=[];
  for(var k in data){
    _defineCom(obj,k,data,calls);
  }
}
function _defineArray(obj,data,calls){
  _defineArrayFormIndex(obj,data,calls);
}
function _defineArrayFormIndex(obj,data,calls,index){
  if(!calls._func)calls._func=[];
  for(var k=index||0;k<data.length;k++){
    _defineCom(obj,k,data,calls);
  }  
}
function _defineCom(obj,k,data,calls){
  var type=_JT.type(data[k]);
  if(type=="json"){
    var _o={};
    if(!calls[k])calls[k]={};
    _defineBase(obj,data,k,_o,calls[k]);
    _define(_o,data[k],calls[k]);
  }else if(type=='array'){
    var _o=[];
    if(!calls[k])calls[k]=[];
    _o._calls=calls[k];
    _o._data=data[k];
    _defineBase(obj,data,k,_o,calls[k]);
    _defineArray(_o,data[k],calls[k]);
  }else{
    if(!calls[k]||!calls[k]._func)calls[k]={_func:[]};
    defineFinal(obj,data,k,calls[k])
  }
}
function _defineBase(obj,data,key,temp,calls){
  Object.defineProperty(obj, key, {
    configurable:true,
    enumerable:true,
    get: function () {
      return temp;
    },
    set: function (val) {
      data[key] = val;
      _copyValue(temp,val,calls);
      calls._func._JT_each(function(call){
        call(key,val);
      })
    }
  });
}
function defineFinal(obj,data,key,calls){
  Object.defineProperty(obj, key, {
    configurable:true,
    enumerable:true,
    get: function () {
      var v=data[key];
      if(_checkIn(data[key],'type',_lang)){
        return data[key].data[Jet.lang.type]
      }else{
        return data[key];
      }
    },
    set: function (val) {
      if(_checkIn(data[key],'type',_lang)){
        data[key].data[Jet.lang.type]=val;
      }else{
        data[key] = val;
      }
      calls._func._JT_each(function(call){
        call(key,val);
      })
    }
  })
}
function _checkIn(data,key,value){//data[key]===value
    var _in=(data!=null&&typeof data=='object'&&key in data);
    if(arguments.length==2){
      return _in
    }else{
      return (_in&&data[key]===value);
    }
}

function _copyValue(a,b,calls){
  if(_checkType(a,b)=='json'){
    _copyValueJson(a,b,calls);
  }else{
    _copyValueArr(a,b,calls);
  }
}
function _copyValueJson(a,b,calls){
  for(var k in b){
    _copyCom(a,b,k,calls);
  }
}
function _copyValueArr(a,b,calls){
  for(var k=0;k<b.length;k++){
    _copyCom(a,b,k,calls);
  }
}
function _copyCom(a,b,k,calls){
  if(a[k]){
    var t=_JT.type(a[k]);
    if(t=='json'){
      _copyValueJson(a[k],b[k],calls[k]);
    }else if(t=='array'){
      _copyValueArr(a[k],b[k],calls[k]);
    }else{
      a[k]=b[k];
    }
  }else{
    _defineCom(a,k,b,calls)
  }
}

function _checkType(a,b){
  var a_t=_JT.type(a);
  var b_t=_JT.type(b);
  if(a_t!=b_t){
    _throw('不允许前后设置的值类型不一致');
  }
  return a_t;
}
/*jet*********************************************************************************/
//

// j-bind
// j-for
// j-switch
// j-case
// j-input  j-type
// j-text 
// $each
// $index
// $value

// j-if = exp:class[a,b|b];attr[a=b,a=b|a];func
// $  class[a|b]  attr[a|b]  function
// j-on 
// j-run

var _bind="J",
  _for="Jfor",
  _input="Jinput",
  _text="Jtext",
  _if="Jif",
  _on="Jon",
  _run="Jrun",

  _attr="Jattr",
  _style="Jstyle",

  _show="Jshow",
  
  _root='Jroot',

  _each="$each",
  _value="$value",
  _index="$index",
  _dom='jdom',
  _html='jhtml',
  _reg=new RegExp("({{)((.|\\n)*?)(}})","g"),
  _numReg=new RegExp("(\\[)((.|\\n)*?)(\\])","g");
function _throw(err){
  throw new Error(err);
}

// var opt={data:JL({
//   en:{
//     	a1:'a',
//       a2:{a:1},
//       a3:{a:1,b:[1,2,3]},
//       a4:[1,2,3],
//       a5:[{a:1},{a:2}],
//       a0:[{a:[1,2,3]},{a:[3,2,1]}],
//   },
//   cn:{
//     	a1:'啊',
//       a2:{a:1},
//       a3:{a:1,b:[1,2,3]},
//       a4:[1,2,3],
//       a5:[{a:1},{a:2}],
//       a0:[{a:[1,2,3]},{a:[3,2,1]}],
//   },
// })};_checkDataForData(opt)
function _checkDataForData(opt){
  var d=opt.data;
  if(_checkIn(d,'type',_lang)){
    var newd={};
    var path='';
    var _d=_JT.clone(d.data[Jet.lang.list[0]]);
    _addDataWrapper(_d,newd,path,d.data);
    opt.data=newd;
  }else{
    _searchData(d);
  }
}
function _searchData(d){
  for(var k in d){
    _searchDataBase(d,k)
  }
}
function _searchDataArray(d){
  for(var i=0;i<d.length;i++){
    _searchDataBase(d,i)
  }
}
function _searchDataBase(d,k){
  var t=_JT.type(d[k]);
  if(_checkIn(d[k],'type',_lang)){
    var newd={};
    var path='';
    var _d=_JT.clone(d[k].data[Jet.lang.list[0]]);
    if(typeof _d==='object'){
      _addDataWrapper(_d,newd,path,d[k].data);
      d[k]=newd;
    }
  }else if(t==='json'){
    _searchData(d[k])
  }else if(t==='array'){
    _searchDataArray(d[k])
  }
}
function _addDataWrapper(data,newd,path,base){
  if(typeof data==='object'){
    for(var k in data){
      _addDataBase(data,newd,path,base,k)
    }
  }
}
function _addDataWrapperArray(data,newd,path,base){
  for(var i=0;i<data.length;i++){
    _addDataBase(data,newd,path,base,i)
  }
}
function _addDataBase(data,newd,path,base,key){
  var t=_JT.type(data[key]);
  if(typeof key==='string'){
    path+=('.'+key);
  }else{
    path+=('['+key+']');
  }
  if(t==='json'){
    newd[key]={};
    newd=newd[key];
    data=data[key];
    _addDataWrapper(data,newd,path,base);
  }else if(t==='array'){
    newd[key]=[];
    newd=newd[key];
    data=data[key];
    _addDataWrapperArray(data,newd,path,base);
  }else if(t==='string'||t==='number'||t==='boolean'){
    newd[key]=_concatLangObj(base,path);
    newd=newd[key];
  }else{
    _throw(t+'数据类型错误：'+data[key])
  }
}
function _concatLangObj(base,path){
  var obj={};
  for(var k in base){
    obj[k]=(new Function('d',"return d"+path))(base[k]);
  }
  return JL(obj);
}
window.Jet=function(opt){
  if(opt===undefined)opt={};
  _checkDataForData(opt);
  opt.ele=(opt.ele)?_getJdomEle(opt.ele):document.documentElement;
  opt.ele.__jet=this;
  if(opt.name){
    if(Jet[opt.name]&&Jet[opt.name].$DOM==undefined){//避免与Jet.Input等冲突
      _throw('Jet name 属性等于'+opt.name+'已存在，请重新命名');
    }
    Jet[opt.name]=this;
  }
  this._tools={
    _jets:[],
    _jetTools:[],
    _calls:{},
    _data:opt.data,
    //_ele:(opt.ele=='')?Jet.__tempRoot:_getJdomEle(opt.ele)
    _ele:opt.ele
  }
  this.$dom={};
  var _this=this;
  _define(this,opt.data,this._tools._calls);
  if(opt.func){
    for(var key in opt.func){
      if(this[key]){
        _throw('data 不能与 func 有重名属性');
      }else{
        this[key]=opt.func[key]
      }
    }
  }
  var _this=this;
  Jet.load.init(function(){
    _initJet.call(_this,opt,_this._tools._calls);
  })
};Jet.prototype.$get=function(){
  return this;
};Jet.prototype.$makeChange=function(s){
  var call=(new Function('call','return call.'+s+'._func'))(this._tools._calls);
  call.forEach(function(f){
    f();
  });
};
Jet.prototype.$DOM=function(ele){//用于判断是否是Jet元素，不可轻易删除
  return new Jet.DOM({ele:ele,jet:this});
};Jet.prototype.$cookie=_cookie;
Jet.prototype.$storage=_storage;
Jet.prototype.$ajax=function(opt){
  if(opt.base!=false&&Jet.prototype.$ajax.base!==undefined){
    opt.url=Jet.prototype.$ajax.base+opt.url;
  }
  Jet.prototype.$ajax.xhr=_ajax(opt);
  return Jet.prototype.$ajax.xhr;
};Jet.prototype.$ajax.get=function(url,data,sc,fc){
  return Jet.prototype.$ajax({
    data:data,
    url:url,
    success:sc,
    error:fc
  });
};
Jet.prototype.$ajax.post=function(url,data,sc,fc){
  return Jet.prototype.$ajax({
    type:'post',
    data:data,
    url:url,
    success:sc,
    error:fc
  });
};Jet.prototype.$ajax.abort=function(){
  if(Jet.prototype.$ajax.xhr){
    Jet.prototype.$ajax.xhr.abort();
    Jet.prototype.$ajax.xhr=null;
  }
};Jet.prototype.$jui=function(s){
  return _getJdomEle(s,this._tools._ele).$jui;
};
Jet.prototype.$init=function(ele){
  _initJetEle.call(this,ele);
};
function _findParJet(ele){
  var par=ele._JT_parent();
  while(typeof par.__jet==='undefined'){
    par=par._JT_parent();
  }
  return par.__jet;
}
Jet.prototype.$route=function(s,isOpen){
  Jet.router.route(s,isOpen);
};
Jet.prototype.$route.back=function(s){
  Jet.router.back();
};
Jet.prototype.$route.forward=function(s){
  Jet.router.forward();
};
Jet.prototype.$=_JT;
Jet.prototype.$regist=function(name,call){
  var isDisable=false;
  if(arguments.length==2){
    if(name._JT_has('.')){
      var a=name.split('.');
      var _call=this._tools._calls;
      for(var i=1;i<a.length;i++){
          _call=_getCallback(_call,a[i])//_call[a[i]];
          if(_call==null){
            isDisable=true;
            console.log('忽略了一个元素');
            //this.disable();
            break;
          }
      }
      if(!isDisable)
        _call._func.push(call);
    }else{
      if(_JT.type(call)!='function'){
        _throw('call参数必须为函数');
      }
      var _call=_getCallback(this._tools._calls,name)
      if(_call==null){
        isDisable=true;
        console.log('忽略了一个元素');
        //this.disable();
      }else{
        _call._func.push(call);
      }
    }
  }else{
    if(_JT.type(name)!='function'){
      _throw('call参数必须为函数');
    }
    this._tools._calls._func.push(name);
  }
};
Jet.$=_JT;

//html text class attr css 
//
  //
  Jet.DOM=function(opt){
    this.jet=opt.jet;
    this.ele=opt.ele;
    this.name=opt.ele._JT_attr(_dom);
    //this.ele._JT_removeAttr(_dom);
    var _this=this;
    Object.defineProperties(this,{
      'html':{
        get:function(){
          return _this.ele.innerHTML;
        },set:function(v){
          _this.ele.innerHTML=v;
        }
      },'text':{
        get:function(){
          return _this.ele.innerText;
        },set:function(v){
          _this.ele.innerText=v;
        }
      },'value':{
        get:function(){
          return _this.ele.value;
        },set:function(v){
          _this.ele.value=v;
        }
      },'class':{
        get:function(){
          return _this.ele._JT_attr('class');
        },set:function(v){
          if(v[0]!='+'&&v[0]!='-'){
            _this.ele._JT_attr('class',v);
          }else{
            var a=v.split(';');
            a.forEach(function(c){
              if(c[0]!='+'&&c[0]!='-'){
                _throw('添加或删除类 第一个字符必须是+或者-');
              }
              if(c[0]=='+'){
                _this.ele._JT_addClass(c.substring(1));
              }else{
                _this.ele._JT_removeClass(c.substring(1));
              }
            });
          }
        }
      },'outerHtml':{
        get:function(){
          return _this.ele.outerHTML;
        },set:function(v){
          console.error('outerHtml 不允许赋值');
        }
      },'attr':{
        get:function(){
          var a={};
          for(var i=0;i<_this.ele.attributes.length;i++){
            a[_this.ele.attributes[i].name]=_this.ele.attributes[i].textContent;
          }
          return a;
        },set:function(v){
          var a=v.split(';');
          a.forEach(function(c){
            if(c[0]=='-'){
              _this.ele._JT_removeAttr(c.substring(1));
            }else{
              var pair=c.split('=');
              if(pair.length==0)pair[1]='';
              if(pair[0]=='+'){
                _this.ele._JT_attr(pair[0].substring(1),pair[1]);
              }else{
                _this.ele._JT_attr(pair[0],pair[1]);
              }
            }
          });
        }
      },'css':{
        get:function(){
          return _this.ele.style;
        },set:function(v){
          var a=v.split(';');
          a.forEach(function(c){
            var pair=c.split('=');
            _this.ele._JT_css(pair[0],pair[1]);
          });
        }
      }
    });
  };
  function _initJetDom(ele){
    var doms;
    var type=_JT.type(ele);
    if(type!=='undefined'){
      if(type==='string'){
        var s=ele;
        ele=_JT.attr(_dom+'='+s);
        if(!ele._JT_exist()){
          ele=_JT.id(s);
        }
      }
    }
    var _this=this;
    if(ele){
      doms=ele._JT_findAttr(_dom);
    }else{
      doms=_JT.attr(_dom);
    }
    doms._JT_each(function(item){
      if(item._hasDom!==true){
        _this.$dom[item._JT_attr(_dom)]=new Jet.DOM({ele:item,jet:_this});
        item._hasDom=true;
      }
    });
  }
function _initJet(opt,calls){
  if(typeof opt.ele=='string'&&opt.ele!=''){
    opt.ele=_JT.attr(_dom+'='+opt.ele);
  }
  if(opt.beforeinit){
    opt.beforeinit.call(this);
  }
  _initJetDom.call(this,opt.ele)
  var _this=this;
  var bindList,ifList,showList,onList,runList,attrList,styleList;
  if(opt.ele){
    bindList=opt.ele._JT_findAttr(_bind);
    ifList=opt.ele._JT_findAttr(_if);
    showList=opt.ele._JT_findAttr(_show);
    onList=opt.ele._JT_findAttr(_on);
    runList=opt.ele._JT_findAttr(_run);
    attrList=opt.ele._JT_findAttr(_attr);
    styleList=opt.ele._JT_findAttr(_style);
  }else{
    bindList=_JT.attr(_bind);
    ifList=_JT.attr(_if);
    showList=_JT.attr(_show);
    onList=_JT.attr(_on);
    runList=_JT.attr(_run);
    attrList=_JT.attr(_attr);
    styleList=_JT.attr(_style);
  }
  //var temp=[];
  //var dom=document.createDocumentFragment();
  // bindList._JT_each(function(item,index){
  //   temp.push({
  //     par:item._JT_parent(),
  //     index:item._JT_index(),
  //     item:item
  //   });
  // });
  bindList._JT_each(function(item,index){
    if(!item._hasBind){
      //dom.appendChild(item);
      var attr=item._JT_attr(_bind);
      if(opt.data==undefined||attr==''){
        var _opt=_jetOpt(_this,item,attr,{_func:[]});
        item.__isRoot=true;
        _this._tools._jets.push(new Jet.Bind(_opt));
      }else if(attr in opt.data){
        var type=_JT.type(opt.data[attr]);
        var _opt=_jetOpt(_this,item,attr,calls[attr]);
        var _jet;
        switch(type){
          case 'json':_jet=new Jet.Bind(_opt);break;
          case 'array':_jet=new Jet.For(_opt);break;
          default:{
            if(isInput(item)){
              _jet=new Jet.Input(_opt);
            }else{
              _jet=new Jet.Text(_opt);
            }
          };break;
        }
        item.__isRoot=true;//为了记录根元素的初始位置，忽略非根元素
        _this._tools._jets.push(_jet);
      }else{
        item.__isRoot=true;
        //if(item._JT_find)
        //_throw('原数据没有'+attr+'属性');
      }
    }
  });
  //如果属性jet元素是 绑定数据的jet元素，则给绑定数据处理，否则交给父元素
  ifList._JT_each(function(item){
    if(!item._hasIf){//不需要加root判断 因为本来就是root
      _this._tools._jetTools.push(new Jet.If(_jetOpt(_this,item)));
    }
  });
  showList._JT_each(function(item){
    if(!item._hasShow){
      _this._tools._jetTools.push(new Jet.Show(_jetOpt(_this,item),true));
    }
  });
  onList._JT_each(function(item){
    if(!item._hasOn){
      _this._tools._jetTools.push(new Jet.On(_jetOpt(_this,item)));
    }
  });
  runList._JT_each(function(item){
    if(!item._hasRun){
      _this._tools._jetTools.push(new Jet.Run(_jetOpt(_this,item)));
    }
  });
  attrList._JT_each(function(item){
    if(!item._hasAttr){
      _this._tools._jetTools.push(new Jet.Attr(_jetOpt(_this,item)));
    }
  });
  styleList._JT_each(function(item){
    if(!item._hasStyle){
      _this._tools._jetTools.push(new Jet.Style(_jetOpt(_this,item),true));
    }
  });
  if(opt.beforemount){
    opt.beforemount.call(this);
  }
  // temp._JT_each(function(json){
  //   if(json.item.__isRoot==true&&json.item._hasRemove!=true){
  //     json.par._JT_append(json.item,json.index);
  //     Jet.valid.init(json.item);
  //   }
  // });
  Jet.$.id('__preload_j')._JT_remove();
  
  if(opt.ondatachange){
    this.ondatachange=opt.ondatachange;
    for(var k in opt.ondatachange){
      Jet.Base.prototype.$regist.call(this,'.'+k,function(key,value){
        opt.ondatachange[k].call(_this,value,key)
      });
    }
  }
  if(opt.onready){
    _domSatte.ready(opt.onready,this);
  }
  if(opt.onload){
    _domSatte.load(opt.onload,this);
  }
  if(opt.onmounted){
    opt.onmounted.call(this);
  }
  if(opt.onroute){
    Jet.router.onroute(opt.onroute,this);
  }
  if(opt.onrouted){
    Jet.router.onrouted(opt.onrouted,this);
  }
  if('undefined'!=typeof JUI){
    JUI.useBind(this);
  }
};


function _getInitData(item,attr,_this){
  var jet=_findParJet(item);
  var isJet=(typeof jet.$DOM!=='undefined');
  if(!isJet&&jet.type!==_bind){
    _throw('只可在Jet元素或Bind元素作用于域下动态插入DOM元素初始化，当前插入作用域为'+jet.type);
  }
  var _data=(isJet)?jet._tools._data:jet._data[jet.name];
  var _j_opt=(attr===undefined)?_jetOpt(jet,item):_jetOpt(jet,item,attr,jet._tools._calls[attr]);
  var _opt=(isJet)?_j_opt:_bindOpt(jet,item,attr,jet._tools._calls[attr]);
  return {
    isRoot:isJet,
    jet:jet,
    data:_data,
    opt:_opt
  }
}

function _initJetEle(ele){
  ele=ele||this._tools._ele;
  if(typeof ele==='string'){
    ele=_getJdomEle(ele);
  }
  _initJetDom.call(this,ele);
  var _this=this;
  var bindList=ele._JT_findAttr(_bind),
    ifList=ele._JT_findAttr(_if),
    showList=ele._JT_findAttr(_show),
    onList=ele._JT_findAttr(_on),
    runList=ele._JT_findAttr(_run),
    attrList=ele._JT_findAttr(_attr),
    styleList=ele._JT_findAttr(_style);
  bindList._JT_each(function(item,index){
    if(!item._hasBind){
      //dom.appendChild(item);
      var attr=item._JT_attr(_bind);
      var opt=_getInitData(item,attr,_this);
      if(opt.data==undefined||attr==''){
        var _opt=_jetOpt(_this,item,attr,{_func:[]});
        item.__isRoot=true;
        opt._tools._jets.push(new Jet.Bind(_opt));
      }else if(attr in opt.data){
        var type=_JT.type(opt.data[attr]);
        var _jet;
        switch(type){
          case 'json':_jet=new Jet.Bind(opt.opt);break;
          case 'array':_jet=new Jet.For(opt.opt);break;
          default:{
            if(isInput(item)){
              _jet=new Jet.Input(opt.opt);
            }else{
              _jet=new Jet.Text(opt.opt);
            }
          };break;
        }
        if(opt.isRoot)
          item.__isRoot=true;//为了记录根元素的初始位置，忽略非根元素
        opt.jet._tools._jets.push(_jet);
      }else{
        item.__isRoot=true;
      }
    }
  });
  ifList._JT_each(function(item){
    if(!item._hasIf){//不需要加root判断 因为本来就是root
      var opt=_getInitData(item,undefined,_this);
      opt.jet._tools._jetTools.push(new Jet.If(opt.opt));
    }
  });
  showList._JT_each(function(item){
    if(!item._hasShow){
      var opt=_getInitData(item,undefined,_this);
      opt.jet._tools._jetTools.push(new Jet.Show(opt.opt,true));
    }
  });
  onList._JT_each(function(item){
    if(!item._hasOn){
      var opt=_getInitData(item,undefined,_this);
      opt.jet._tools._jetTools.push(new Jet.On(opt.opt));
    }
  });
  runList._JT_each(function(item){
    if(!item._hasRun){
      var opt=_getInitData(item,undefined,_this);
      opt.jet._tools._jetTools.push(new Jet.Run(opt.opt));
    }
  });
  attrList._JT_each(function(item){
    if(!item._hasAttr){
      var opt=_getInitData(item,undefined,_this);
      opt.jet._tools._jetTools.push(new Jet.Attr(opt.opt));
    }
  });
  styleList._JT_each(function(item){
    if(!item._hasStyle){
      var opt=_getInitData(item,undefined,_this);
      opt.jet._tools._jetTools.push(new Jet.Style(opt.opt,true));
    }
  });
  if(typeof JUI!=='undefined'){
    JUI.init(ele);
    JUI.useBind(this);
  }
  Jet.valid.init(ele);
  Jet.lang.init(ele);
  Jet.load.init(ele);
}

var _domSatte={
  ready: (function() {
    var b = [];
    var d = false;
    var jet=null;
    function c(g) {
      if (d) {
        return
      }
      if (g.type === "onreadystatechange" && document.readyState !== "complete") {
        return
      }
      for (var f = 0; f < b.length; f++) {
        b[f].call(jet)
      }
      d = true;
      b = null
    }
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", c, false);
      document.addEventListener("readystatechange", c, false);
      window.addEventListener("load", c, false)
    } else {
      if (document.attachEvent) {
        document.attachEvent("onreadystatechange", c);
        window.attachEvent("onload", c)
      }
    }
    return function a(e,j) {
      jet=j;
      if (d) {
        e.call(jet)
      } else {
        b.push(e)
      }
    }
  })(),
  load: function(a,jet) {
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", function() {
        document.removeEventListener("DOMContentLoaded", arguments, false);
        a.call(jet)
      }, false)
    } else {
      if (document.attachEvent) {
        document.attachEvent("onreadystatechange", function() {
          if (document.readyState == "complete") {
            document.detachEvent("onreadystatechange", arguments);
            a.call(jet)
          }
        })
      }
    }
  }
}

function _jetOpt(_this,item,name,calls){
  return {
    jet:_this,
    par:_this,
    ele:item,
    data:_this,
    _data:_this._tools._data,
    name:name,
    calls:calls||_this._tools._calls
    //indexs:[]
  };
}
function isInput(obj){
  var tag=obj.tagName;
  return (tag=="INPUT"||tag=="TEXTAREA"||tag=="SELECT"||(obj._JT_hasAttr('contenteditable')&&obj._JT_attr('contenteditable')!='false'))
}
Jet.Base=function(opt,type){
  this.jet=opt.jet;
  this.par=opt.par;
  this.ele=opt.ele;
  this._data=opt._data;
  this.data=opt.data;
  this.type=type;
  this.name=opt.name;
  this.index=opt.index;
  if(type==_for||type==_input||type==_text){
      type=_bind;
  }
  this._tools={
    _jets:[],
    _jetTools:[],
    _calls:opt.calls
  }
  this._attrVal=this.ele._JT_attr(type);
  this.ele._JT_removeAttr(type);
  //this.indexs=opt.indexs;
  switch(this.type){
    case _if:this.ele._hasIf=true;break;
    case _on:this.ele._hasOn=true;break;
    case _run:this.ele._hasRun=true;break;
    case _attr:this.ele._hasAttr=true;break;
    case _style:this.ele._hasStyle=true;break;
    case _show:this.ele._hasShow=true;break;
    default:this.ele._hasBind=true;break;
  }
  if(this.ele._JT_hasAttr(_root)){
      this.par=this.jet;
      this.data=this.jet;
      //this._tools._calls=this.jet._tools._calls[this.name];
      if(this.name){
        this._tools._calls=this.jet._tools._calls[this.name];
      }else{
        this._tools._calls=this.jet._tools._calls;
      }
  }
  if(this.type==_bind||this.type==_for||this.type==_text||this.type==_input){
      this.ele.__jet=this;
  }
};Jet.Base.prototype.$makeChange=function(s){
  var call;
  if(s==undefined){
    call=this._tools._calls._func
  }else{
    call=(new Function('$','return '+s+'._func'))(this._tools._calls);
  }
  call.forEach(function(f){
    f();
  });
};Jet.Base.prototype.disable=function(){
  console.warn('忽略了一个元素');
  this.disable=true;
  this.ele._JT_attr(this.type,this._attrVal);
  switch(this.type){
    case _if:this.ele._hasIf=false;break;
    case _on:this.ele._hasOn=false;break;
    case _run:this.ele._hasRun=false;break;
    case _attr:this.ele._hasAttr=false;break;
    case _style:this.ele._hasStyle=false;break;
    case _show:this.ele._hasShow=false;break;
    default:this.ele._hasBind=false;break;
  }
  if(this.type==_bind){
    this.par._tools._jets._JT_remove(this)
  }else{
    this.par._tools._jetTools._JT_remove(this)
  }
  this.ele.__jet=undefined;
};Jet.Base.prototype.$regist=function(name,call){
  var isDisable=false;
  if(arguments.length==2){
    // if(name._JT_has(_each)){
    //   name=name._JT_replaceAll("\\"+_each,"$."+this.ele.__jet.par.name+"["+this.ele.__jet.name+"]")
    // }
    if(name._JT_has('.')){
      var a=name.split('.');
      var _call=this._tools._calls;
      for(var i=1;i<a.length;i++){
          _call=_getCallback(_call,a[i])//_call[a[i]];
          if(_call==null){
            isDisable=true;
            if(!this.$DOM)this.disable();
            break;
          }
      }
      if(!isDisable)
        _call._func.push(call);
    }else{
      if(_JT.type(call)!='function'){
        _throw('call参数必须为函数');
      }
      var _call=_getCallback(this._tools._calls,name)
      if(_call==null){
        isDisable=true;
        if(!this.$DOM)this.disable();
      }else{
        _call._func.push(call);
      }
    }
  }else{
    if(_JT.type(name)!='function'){
      _throw('call参数必须为函数');
    }
    this._tools._calls._func.push(name);
  }
};Jet.Base.prototype.setDataIndex=function(i){
  this.name=i;
};
function _getCallback(call,s){
  var a=s.match(_numReg);
  if(a==null){
      if(!call[s]){
        //_throw('没有'+s+'属性');
        return null;
      }
      return call[s];
  }else{
      var _c=call;
      a.forEach(function(item){
          var _ss=item.substring(1,item.length-1);
          var attr=s.substring(0,s.indexOf('['));
          if(!call[attr][_ss]){
            //_throw('索引为'+s+'的位置没有值');
            return null;
          }
          _c=call[attr][_ss]
      });
      return _c;
  }
}
var Super = function(){};
Super.prototype = Jet.Base.prototype;
Array.prototype.$push=function(d){
  var _f=this._jet;
  var data,_data,_call,_un=(typeof _f==='undefined');
  if(_un){
    data=this;
    _data=this._data; 
    _call=this._calls;
  }else{
    data=_f.data[_f.name];
    _data=_f._data[_f.name]; 
    _call=_f._tools._calls;
  }
  _data.push(d);
  _defineCom(data,data.length,_data,_call);
  if(!_un)_f.refresh.push.call(_f);
};Array.prototype.$pushArray=function(arr){
  var _this=this;
  arr._JT_each(function(item){
    _this.$push(item)
  });
};Array.prototype.$prep=function(d){
  var _f=this._jet;
  var data,_data,_call,_un=(typeof _f==='undefined');
  if(_un){
    data=this;
    _data=this._data; 
    _call=this._calls;
  }else{
    data=_f.data[_f.name];
    _data=_f._data[_f.name]; 
    _call=_f._tools._calls;
  }
  _data._JT_prepend(d);
  _call._JT_prepend({});
  _defineArray(data,_data,_call);
  if(!_un)_f.refresh.prep.call(_f);
};Array.prototype.$prepArray=function(arr){
  this.$insertArray(arr,0);
};Array.prototype.$insert=function(d,index){
  var _f=this._jet;
  var data,_data,_call,_un=(typeof _f==='undefined');
  if(_un){
    data=this;
    _data=this._data; 
    _call=this._calls;
  }else{
    data=_f.data[_f.name];
    _data=_f._data[_f.name]; 
    _call=_f._tools._calls;
  }
  _data._JT_insert(d,index);
  _call._JT_insert({},index);
  _defineArrayFormIndex(data,_data,_call,index);
  if(!_un)_f.refresh.insert.call(_f,index);
};Array.prototype.$insertArray=function(arr,index){
  var _f=this._jet;
  var data,_data,_call,_un=(typeof _f==='undefined');
  if(_un){
    data=this;
    _data=this._data; 
    _call=this._calls;
  }else{
    data=_f.data[_f.name];
    _data=_f._data[_f.name]; 
    _call=_f._tools._calls;
  }
  _data._JT_insertArray(arr,index);
  var calls=[];
  arr._JT_each(function(){
    calls.push({});
  });
  _call._JT_insertArray(calls,index);
  _defineArrayFormIndex(data,_data,_call,index);
  if(!_un)_f.refresh.insertArray.call(_f,arr,index);
};Array.prototype.$remove=function(i,n){
  if(typeof i=='object'){
    i=this.indexOf(i);
  }
  if(n==undefined)n=1
  var _f=this._jet;
  var data,_data,_call,_un=(typeof _f==='undefined');
  if(_un){
    data=this;
    _data=this._data; 
    _call=this._calls;
  }else{
    data=_f.data[_f.name];
    _data=_f._data[_f.name]; 
    _call=_f._tools._calls;
  }
  if(_data.length<i+n){
    if(_data.length<i+1){
      _throw('$remove 方法索引超过数组长度');
    }else{
      n=_data.length-i;
      console.warn('$remove 方法删除的个数超过数组长度，只删除'+n+'个元素');
    }
  }
  _data.splice(i,n);
  _call.splice(i,n);
  _defineArrayFormIndex(data,_data,_call,i);
  data.length-=n;
  if(!_un)_f.refresh.remove.call(_f,i,n);
};Array.prototype.$clear=function(){
  this.$remove(0,this.length);
};Array.prototype.$replace=function(arr){
  this.$clear();
  this.$pushArray(arr);
  if(typeof this._jet!=='undefined')this._jet.$makeChange();
};

//on 和 run 由自身处理，其余由父jet处理
function _checkJetTools(opt){
  var arr=this._tools._jetTools;
  if(this.ele._JT_hasAttr(_on)){
    if(!this.ele._hasOn){
      arr.push(new Jet.On(opt));
    }
  }
  if(this.ele._JT_hasAttr(_run)){
    if(!this.ele._hasRun){
      arr.push(new Jet.Run(opt));
    }
  }
  // if(this.ele._JT_hasAttr(_if)){
  //   if(!this.ele._hasIf){
  //     arr.push(new Jet.If(opt));
  //   }
  // }
  // if(this.ele._JT_hasAttr(_show)){
  //   if(!this.ele._hasShow){
  //     arr.push(new Jet.Show(opt,true));
  //   }
  // }
  // if(this.ele._JT_hasAttr(_attr)){
  //   if(!this.ele._hasAttr){
  //     arr.push(new Jet.Attr(opt));
  //   }
  // }
  // if(this.ele._JT_hasAttr(_style)){
  //   if(!this.ele._hasStyle){
  //     arr.push(new Jet.Style(opt,true));
  //   }
  // }
}
Jet.$=_JT;

  /*router*********************************************************************************/
  var _route="Jrouter",
  _route_a="jrouter-active", 
  _routeout="Jout",
  _routeScript="JrouteScript",
  _routeStyle="JrouteStyle",
  _commonStyle="JcommonStyle";
  
function _initRouterConf(opt){
  if("history" in opt){
    Jet.router.history=opt.history;
  }
  if("base" in opt){
    Jet.router.base=(opt.history)?opt.base:opt.base+"/#";
    if('trueBase' in opt){
      if(opt.trueBase){
        for(var k in Jet.router.conf){
          Jet.router.conf[k]=opt.base+Jet.router.conf[k];
        }
      }
    }
  }else{
    Jet.router.base=(opt.history)?'':"/#";
  }
  if(!opt.router['/404']){
    opt.router['/404']='/404';
  }
  for(var k in opt.router){
    if(opt.router[k]=='')opt.router[k]=k;
    _checkRouterName(k,opt.router[k]);
  }
}
function _checkRouterName(k,name){
  if(typeof name!='string'){
    var _s=''
    if('params' in name){
      _s='?';
      for(var _k in name.params){
        _s+=(_k+'='+name.params[_k]+'&')
      }
      _s=_s.substring(0,_s.length-1);
    }
    _addIntoRouter(k,name.name,_s);
    var child=name.children;
    for(var _k in child){
      _checkRouterName(k+_k,child[_k]);
    }
  }else{
    _addIntoRouter(k,name);
  }
}
function _addIntoRouter(k,name,_s){
  if(!name._JT_has('.html')){
    if(name._JT_has('?')){
      name=name.replace('?','.html?')
    }else{
      name+='.html';
    }
  }
  if(_s!=undefined){
    name+=_s;
  }
  Jet.router.router[Jet.router.base+k]=name;
}
Jet.router={
  base:"",
  trueBase:false,
  history:false,
  path:"/",
  lastTrueHash:"",
  params:null,
  router:{},
  use:function(opt){
    _initRouterConf(opt);
    if('index' in opt){
      Jet.router.index=opt.index;
    }else{
      Jet.router.index='/index';
    }
    var url=Jet.router.index;
    if(!location.pathname._JT_has("index.html")){
      if(Jet.router.history){//pathname+search
        if(location.pathname.length-Jet.router.base.length>1){
          url=location.pathname.substring(Jet.router.base.length)+location.search+location.hash;
        }
      }else{//# 使用 hash
        if(location.hash.length>2){
          url=location.pathname+location.hash;
          url=url.substring(Jet.router.base.length)+location.search;
        }
      }
    }
    Jet.router.init();
    Jet.router.route(url);
  },
  conf:{
    html:"/src/html",
    js:"/src/js",
    css:"/src/css",
    image:"/src/image"
  },
  init:function(obj){
    var list;
    if(obj==undefined){
      list=_JT.attr(_route);
    }else{
      list=obj._JT_findAttr(_route)
    }
    list._JT_each(function(item){
      item._JT_clk(function(){
        Jet.router.route(this._JT_attr(_route));
      });
    });
  },
  __xhr:null,
  __onroute:[],
  onroute:function(f,jet){
    if(typeof f=='function'){
      f._jet=jet;
      Jet.router.__onroute.push(f);
    }else{
      _throw('onroute:参数必须是函数');
    }
  },
  __onrouted:[],
  onrouted:function(f,jet){
    if(typeof f=='function'){
      f._jet=jet;
      Jet.router.__onrouted.push(f);
    }else{
      _throw('onroute:参数必须是函数');
    }
  },
  back: function() {window.history.back()},
  forward: function() {window.history.forward()},
  route:function(url,push,call){
    if(url._JT_has('http://')||url._JT_has('https://')){
      if(push===true){
        Jet.$.open(url);
      }else{
        Jet.$.jump(url);
      }
    }else{
      if(Jet.router.__xhr!==null){
        Jet.router.__xhr.abort();
        console.warn('忽略了一个路由：'+Jet.router.path);
        Jet.router.__xhr=null;
      }
      var search='';
      if(url.indexOf('#')!=-1){
        var index=url.indexOf('?');
        var _index=url.indexOf('#');
        if(index!=-1){
          if(index>_index){
            Jet.router.hash=url.substring(_index,index);
            search=url.substring(index+1);
            url=url.substring(0,_index);
            index=_index;
          }else{
            Jet.router.hash=url.substring(_index);
            search=url.substring(index+1,_index);
            url=url.substring(0,index);
          }
        }else{
          Jet.router.hash=url.substring(_index);
          index=_index;
          url=url.substring(0,_index);
        }
      }else{
        if(url._JT_has('?')){
          search=url.substring(url.indexOf("?")+1);
          url=url.substring(0,url.indexOf("?"));
        }
        Jet.router.hash='';
      }
      if(url[url.length-1]=='/'&&url.length>1)url=url.substring(0,url.length-1);
      var item=_JT.attr(_route+'="'+url+'"');
      if(item._JT_exist()){
        _JT.attr(_route_a)._JT_removeAttr(_route_a);
        item._JT_attr(_route_a,'');
        Jet.router.active=item;
      }
  
      url=_checkUrl(url);
      var _r=false;
      if(!(url in Jet.router.router)){
        url=Jet.router.base+"/404";
        _r=true;
      }
      var file=Jet.router.router[url];
      if(file!=undefined){
        if(file._JT_has('?')){
          if(search==''){
            search=file.substring(file.indexOf("?")+1);
          }else{
            var _s=file.substring(file.indexOf("?")+1).split('&');
            var _search=search.split('&');
            _s.forEach(function(item){
              if(_search.indexOf(item)==-1){
                search+=('&'+item);
              }
            });
          }
          file=file.substring(0,file.indexOf("?"));
          _r=true;
        }
        if(search!=''){
          search='?'+search;
        }
        Jet.router.path=url;
        var stateObject = {};
        var title = url;
        var newUrl = url+search+Jet.router.hash;
        if(push==undefined){
          history.pushState(stateObject,title,newUrl);
        }
        if(_r){
          history.replaceState(stateObject,title,newUrl);
        }
        Jet.router.params=_JT.urlParam();
        
        Jet.router.lastTrueHash=location.hash;
        Jet.router.__onroute.forEach(function(item){
          if(item._jet){
            item.call(item._jet,Jet.router)
          }else{
            item.call(Jet.router)
          }
        });
        Jet.router.__xhr=_JT.load(Jet.router.conf.html+_dealSrc(file),function(html){
          Jet.router.__xhr=null;
          var out=_JT.attr(_routeout)._JT_html(html);
          if('undefined'!=typeof JUI){
            JUI._jui_mounted=[];
          }
          if(call){call()}
          _loadStyle(out);
          _loadScript(out);
          _loadCompImg(out);
          Jet.valid.init(out);
          Jet.lang.init(out);
          Jet.router.init(out);
          if('undefined'!=typeof JUI){
            JUI.init(out);
          }
          Jet.load.init(out);
          Jet.router.__onrouted.forEach(function(item){
            if(item._jet){
              item.call(item._jet,Jet.router)
            }else{
              item.call(Jet.router)
            }
          });
        });
      }
    }
  }
};

window.onhashchange=function(){
  if(Jet.router.lastTrueHash!=location.hash){
    window.onpopstate();
  }
}
window.onpopstate = function(event) {
  if(Jet.router.history){
    Jet.router.route(location.pathname.substring(Jet.router.base.length)+location.search+location.hash,false);
  }else{//#
    Jet.router.route(location.hash.substring(1),false);
  }
};
function _checkUrl(url){
  if(url[url.length-1]=='/'&&url!='/'){
    url=url.substring(0,url.length-1);
  }
  if(url==Jet.router.base){
    url=Jet.router.base+Jet.router.index;
  }else{
    if(url[0]!="/"){//相对路径
      url=Jet.router.path+'/'+url
    }else{//绝对路径
      url=Jet.router.base+url;
    }
    
  }
  return url;
}
function _loadScript(out){
  if(_JT.id(_routeScript)._JT_exist()){
    _JT.id(_routeScript)._JT_remove();
  }
  var script=_JT.ct('script')._JT_attr({
    'id':_routeScript,
    'type':'text/javascript'
  });
  var txt=['//# sourceURL=__dynamic.js\r\n'];
  var scripts=out._JT_findTag("script")._JT_toArray(false);
  var index=-1;
  for(var i=scripts.length-1;i>=0;i--){
    if(scripts[i]._JT_hasAttr("src")){
      index=i;
      break;
    }
  }
  scripts._JT_each(function(item,i){
    if(item._JT_hasAttr("src")){
      _JT.load(Jet.router.conf.js+_dealSrc(item._JT_attr("src")),function(scr){
        txt[i+1]=scr;
        if(i==index){
          script._JT_html(txt.join(''));
          _JT.body()._JT_append(script);
        }
      });
    }else{
      txt[i+1]=item._JT_html();
    }
    item._JT_remove();
  });
  if(index==-1){
    script._JT_html(txt.join(''));
    _JT.body()._JT_append(script);
  }
}

function _loadStyle(out){
  if('undefined'===typeof jet_css_conf){
    _reloadCssConf(function(){
      _loadStyleCall(out);
    });
  }else{
    window.__css_conf_xhr=undefined;
    _loadStyleCall(out);
  }
}
function _loadStyleCall(out){
  var style=_JT.id(_routeStyle);
  if(!style._JT_exist()){
    style=_JT.ct('style')._JT_attr({
      'id':_routeStyle,
      'type':'text/css'
    });
    _JT.tag('head')._JT_append(style);
  }
  style._JT_empty();
  var txt=[];
  var styles=out._JT_findTag("style")._JT_toArray(false);
  var index=-1;
  for(var i=styles.length-1;i>=0;i--){
    if(styles[i]._JT_hasAttr("src")){
      index=i;
      break;
    }
  }
  styles._JT_each(function(item,i){
    if(item._JT_hasAttr("src")){
      _JT.load(Jet.router.conf.css+_dealSrc(item._JT_attr("src")),function(css){
        txt[i]=_replaceCssVar(css);
        if(i==index){
          style._JT_html(txt.join(''));
        }
      });
    }else{
      txt[i]=_replaceCssVar(item._JT_html());
    }
    item._JT_remove();
  });
  if(index==-1){//index==-1 时表示 没有外链加载的css
    style._JT_html(txt.join(''));
  }
  _loadCommonCss();
}
//
function _loadCommonCss(){
  var commonCss=[];
  var _r=Jet.router.path.substring(Jet.router.base.length);
  var length=0,arr=[];
  jet_css_conf.common.forEach(function(json){
    if(json.router.indexOf(_r)!=-1){
      var _c=json.css.trim();
      if(_c.substring(_c.length-4)=='.css'){//css文件
        var _a=_c.split(',');
        arr.push(_a);
        length+=_a.length;
      }else{
        arr.push(json.css);
        length++;
      }
    }
  });
  arr.forEach(function(item){
    if(typeof item=='string'){
      length--;
      commonCss.push(item);
      _loadCommonCssCall(commonCss,length);
    }else{
      item.forEach(function(_item){
        _JT.load(Jet.router.conf.css+_dealSrc(_item),function(css){
          length--;
          commonCss.push(css);
          _loadCommonCssCall(commonCss,length);
        });
      });
    }
  });
}
function _loadCommonCssCall(commonCss,length){
  if(length==0){
    if(commonCss.length>0){
      if(_JT.id(_commonStyle)._JT_exist()){
        if(commonCss.join('')!=_JT.id(_commonStyle).innerHTML){
          _JT.id(_commonStyle)._JT_html(commonCss.join(''))
        }
      }else if(_JT.id(_routeStyle)._JT_exist()){
        document.head.insertBefore(_JT.ct('style')._JT_attr('id',_commonStyle)._JT_html(commonCss.join('')),_JT.id(_routeStyle));
      }else{
        document.head.appendChild(_JT.ct('style')._JT_attr('id',_commonStyle)._JT_html(commonCss.join('')));
      }
    }else{
      _JT.id(_commonStyle)._JT_exist(function(item){
        item._JT_empty();
      });
    }
  }
}
function _reloadCssConf(call){
  if(window.__css_conf_xhr)window.__css_conf_xhr.abort();
  window.__css_conf_xhr=_JT.load(Jet.router.conf.css+'/css.conf',function(res){
    eval('window.jet_css_conf='+res);
    window.__css_conf_xhr=undefined;
    _JT.load(Jet.router.conf.css+'/common.css',function(res2){
      window.__preload_css(res2,function(d){
        var comStyle=document.createElement('style');
        comStyle.innerHTML=d.replace(/[\r\n]/g,"");//去掉回车换行;
        document.head.insertBefore(comStyle,_JT.id('commonCss'));
        document.head.removeChild(_JT.id('commonCss'));
        window.__preload_css=undefined;
        call();
      })
    });
  });
}
function _replaceCssVar(t){
  var m=t.match(new RegExp("(\\(\\()((.|\\n)*?)(\\)\\))","g"));
  if(m!==null){
    var vars=[];
    m.forEach(function(item){
      var _i=item.indexOf('[');
      if(_i!=-1){//css 函数
        var arr=eval(item.match(_numReg)[0]);
        var _v=item.substring(2,_i).trim();
        var _var=jet_css_conf.variable[_v];
        var _varMatch=_var.match(_reg);
        if(_varMatch!==null){
          arr.forEach(function(_arr,i){
            _var=_var.replace(new RegExp("(({{"+(i+1)+"\\|)((.|\\n)*?)(}}))|(\\{\\{"+(i+1)+"\\}\\})","g"),_arr);
          });
          _var=_var.replace(new RegExp("{{[0-9]*\\|","g"),'').replace(new RegExp('}}','g'),'');
        }
        vars.push(item);
        t=t.replace(item,_var);
      }else{
        var pure=item.replace(/\s/g,"");
        if(vars.indexOf(item)==-1){
          vars.push(item);
          t=t.replace(new RegExp('\\(\\('+item.substring(2,item.length-2)+"\\)\\)", "g"), jet_css_conf.variable[pure.substring(2,pure.length-2)])
        }
      }
    });
  }
  return t.replace(/[\r\n]/g,"");
}
//_JT.ready(function(){
  //Jet.router.reload();
//});

/*load*********************************************************************************/

var _load="Jload";
Jet.load={
  init:function(obj,call){
    var data={};
    var list;
    if(obj==undefined||typeof obj=='function'){
      list=_JT.attr(_load)._JT_toArray(false);
      call=obj;
    }else{
      list=obj._JT_findAttr(_load)._JT_toArray(false);
    }
    var n=list.length;
    if(n==0&&call!=undefined){//如果没有Jload 则立即执行
      call();
    }
    list._JT_each(function(item,i){
      var attr=item._JT_attr(_load);
      item._JT_removeAttr(_load);
      _JT.load(Jet.router.conf.html+_dealSrc(attr),function(html){
        item._JT_html(html);
        _loadCompStyle(item,attr);
        _loadCompScript(item,attr);
        _loadCompImg(item);
        if(i==n-1&&call!=undefined)
          call();
        Jet.valid.init(item);
        Jet.lang.init(item);
        if(typeof JUI!='undefined'){
          JUI.init(item);
        }
        Jet.load.init(item);
      });
    });
  }
}
//Jet.load.init();
function _loadCompImg(item){
  item._JT_findTag('img')._JT_each(function(img){
    var attr=img._JT_attr("src");
    if(attr[0]!='/'){//不是绝对路劲
      img._JT_attr("src",Jet.router.conf.image+_dealSrc(attr));
    }
  });
}
function _loadCompScript(out,attr){
  //Jet.__tempRoot=out;
  var script=_JT.attr('load-script="'+attr+'"');
  if(!script._JT_exist()){
    script=_JT.ct('script')._JT_attr({
      'load-script':attr,
      'type':'text/javascript'
    });
    var txt=['//# sourceURL='+attr+'.js\r\n'];
    var scripts=out._JT_findTag("script")._JT_toArray(false);
    var index=-1;
    for(var i=scripts.length-1;i>=0;i--){
      if(scripts[i]._JT_hasAttr("src")){
        index=i;
        break;
      }
    }
    scripts._JT_each(function(item,i){
      if(item._JT_hasAttr("src")){
        _JT.load(Jet.router.conf.js+_dealSrc(item._JT_attr("src")),function(src){
          txt[i+1]=src;
          if(i==index){
            script._JT_html(txt.join(';'));
            _JT.body()._JT_append(script);
          }
        });
      }else{
        txt[i+1]=item._JT_html();
      }
      item._JT_remove();
    });
    if(index==-1){
      script._JT_html(txt.join(';'));
      _JT.body()._JT_append(script);
    }
  }else{
    var txt=script._JT_html();
    script._JT_remove();
    _JT.body()._JT_append(_JT.ct('script')._JT_attr({
      'load-script':attr,
      'type':'text/javascript'
    })._JT_html(txt));
  }
}
function _loadCompStyle(out,attr){
  if('undefined'===typeof jet_css_conf){
    _reloadCssConf(function(){
      _loadCompStyleCall(out,attr);
    });
  }else{
    window.__css_conf_xhr=undefined;
    _loadCompStyleCall(out,attr);
  }
}
function _loadCompStyleCall(out,attr){
  if(!_JT.attr('load-style="'+attr+'"')._JT_exist()){
    var style=_JT.ct('style')._JT_attr({
      'load-style':attr,
      'type':'text/css'
    });
    _JT.tag('head')._JT_append(style);
    style._JT_empty();
    var txt=[];
    var styles=out._JT_findTag("style")._JT_toArray(false);
    var index=-1;
    for(var i=styles.length-1;i>=0;i--){
      if(styles[i]._JT_hasAttr("src")){
        index=i;
        break;
      }
    }
    styles._JT_each(function(item,i){
      if(item._JT_hasAttr("src")){
        _JT.load(Jet.router.conf.css+_dealSrc(item._JT_attr("src")),function(css){
          txt[i]=_replaceCssVar(css);
          if(i==index){
            style._JT_html(txt.join(''));
          }
        });
      }else{
        txt[i]=_replaceCssVar(item._JT_html());
      }
      item._JT_remove();
    });
    if(index==-1){
      style._JT_html(txt.join(''));
    }
  }
}
function _dealSrc(s){
  s=s.trim();
  if(s[0]!='/'){
    s='/'+s;
  }
  return s;
}
/*valid*********************************************************************************/
function _getJdomEle(b,ele){
  if('undefined'==typeof b)return b;
  if(typeof b=='string'){
    var s=b;
    if(ele){
      b=ele._JT_findAttr(_dom+'='+s);
    }else{
      b=_JT.attr(_dom+'='+s);
    }
    if(!b._JT_exist()){
      b=_JT.id(s);
    }
  }else if(_JT.type(b)!='htmlelement'){
    b=b.ele;
  }
  return b;
}
var _form='Jform',_valid='Jvalid';
//第一个含有 _form 的父元素
Jet.valid={
  init:function(b){
    var c;
    b=_getJdomEle(b);
    if (b == undefined) {
      c = _JT.attr(_valid)
    } else {
      c = b._JT_findAttr(_valid)
    }
    c._JT_each(function(a) {
      if(!a.__valided){
        a._JT_on({
          "blur": "Jet.valid.validInput(this,true,true)",
          "input": function(){
            if(Jet.valid.useOnInput)
              Jet.valid.validInput(this,true,true)
          },
          "focus": "Jet.valid.addValidValue(this)"
        },true).__valided=true;
        if (Jet.valid.__placeholder) {
          a._JT_attr("placeholder", _getValueText(a._JT_attr(_valid)))
        }
      }
    })
  },findValidPar:function(ele){
    var par=ele._JT_parent();
    while(!par._JT_hasAttr(_form)&&par._JT_parent()!=null){
      par=par._JT_parent();
    }
    return par;
  },
  regExp:{
    'null':/^\S{0}$/,
    "date":/^(([12]\d{3}-((0[1-9])|(1[0-2]))-((0[1-9])|([1-2]\d)|3(0|1))))$/,
    "email":/^((\w*@\w*\.[A-Za-z.]+(\.)?[A-Za-z]+))$/,
    "decimal":/^-?[1-9]\d*.\d*|0.\d*[1-9]\d*$/,
    "idcard":/^(\d{17}(X|\d))$/,
    "url":/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+$/,
    "phone":/^([1]\d{10})$/,
  },
  validText:{
    CN:{
      nul: "*可以为空",
      notnull: "*必填",
      date: "*格式为XXXX-XX-XX",
      email: "*格式为XXX@XX.XX",
      number: "*须为纯数字",
      idcard: "*17位数字加一位数字或X",
      length: "*输入长度为",
      url: "*请输入正确的网址",
      decimal: "*请正确的小数",
      lengthOfAny: "*输入长度为",
      phone: "*须为11位纯数字",
      letterStart: "*字母开头且长度为",
      range: "*数字不在范围内",
      express: "*自定义错误"
    },EN:{
      nul: "*null is allowed",
      notnull: "*Required",
      date: "*format:XXXX-XX-XX",
      email: "*format:XXX@XX.XX",
      number: "*expect a number",
      idcard: "*17 numbers plus a number or X",
      length: "*length between",
      url: "*Expect an url name",
      decimal: "*Expect a float number",
      lengthOfAny: "*length between",
      phone: "*must be 11 digits",
      letterStart: "*letter start and length",
      range: "*not in range",
      express: "*wrong express"
    }
  },
  __lang:"CHINESE",
  __default: true,
  __placeholder: false,
  __useJUI:false,
  __useOnInput:false,
  useAlert:false,
  validate: _validateForm,
  addValidText: function(a, b) {
    if(_JT.type(a)=="json"&&b==undefined){
      for (var c in a) {
        Jet.valid.addValidText(c,a[c]);
      }
    }else{
      if(Jet.valid.__lang=="CHINESE"){
        Jet.valid.validText.CN[a]=b;
      }else{
        Jet.valid.validText.EN[a]=b;
      }
    }
  },
  addRegExp:function(name,reg,text){
    if(typeof reg==='string'){
      reg=new RegExp(reg)
    }
    Jet.valid.regExp[name]=reg;
    if(text!==undefined){
      Jet.valid.addValidText(name,text);
    }
  },
  validInput:_validInput,
  addValidValue:_addValidValue,
  onOnePass: function(c) {
    _onOnePass=_checkFunction(c);
  },
  onOneFail: function(c) {
    _onOneFail=_checkFunction(c);
  }
}
Object.defineProperties(Jet.valid,{
  'language':{
    get:function(){return Jet.valid.__lang;},
    set:function(val){
      Jet.valid.__lang=val.toUpperCase()
    }
  },'useJUI':{
    get:function(){return Jet.valid.__useJUI;},
    set:function(val){
      if(typeof JUI!=='undefined'){
        Jet.valid.__useJUI=val
      }
    }
  },'useDefaultStyle':{
    get:function(){return Jet.valid.__default;},
    set:function(val){
      if(Jet.valid.__default!==val){
        if(Jet.valid.__useOnInput===true&&val===true){
          console.warn('useOnInput 模式下不可使用默认样式');
        }else{
          Jet.valid.__default=val;
          Jet.valid.__lastUseDef=val;
          if(val===false){
            _JT.cls("jet-unpass")._JT_each(function(a) {
              _checkIsPw(a);
              a._JT_removeClass("jet-unpass")._JT_val(a._JT_validValue);
              a._JT_validValue=undefined;
            })
          }
        }
      }
    }
  },'useOnInput':{
    get:function(){return Jet.valid.__useOnInput;},
    set:function(val){
      if(Jet.valid.__useOnInput!==val){
        Jet.valid.__useOnInput=val;
        if(val===false){
          if(Jet.valid.__default!==Jet.valid.__lastUseDef){
            Jet.valid.useDefaultStyle=Jet.valid.__lastUseDef
          }
        }else{
          if(Jet.valid.useDefaultStyle){
            Jet.valid.useDefaultStyle=false;
            Jet.valid.__lastUseDef=true;
          }
        }
      }
    }
  },'showInPlaceHolder':{
    get:function(){return Jet.valid.__placeholder;},
    set:function(val){
      Jet.valid.__placeholder=val;
      if(val===true){
        _JT.attr(_valid)._JT_each(function(a) {
          a._JT_attr("placeholder", _getValueText(a._JT_attr(_valid)))
        })
      }else if(val===false){
        _JT.attr(_valid)._JT_each(function(a) {
          a._JT_removeAttr("placeholder")
        })
      }
    }
  }
});
Jet.valid.init();
var _onOnePass = null,
    _onOneFail = null;
function _checkIsPw(a) {
  if (a._JT_ispw===true) {
    a._JT_attr("type", "password")
  }
};

HTMLElement.prototype._JT_validate = function(s, f) {
  _validateForm({
    ele:this,
    pass:s,
    fail:f
  })
};
//第一个参数是元素，第二个是是否提示，第三个是是否不是代码调用
function _validInput(b, a,isFromBlur) {
  b=_getJdomEle(b);
  var v = b._JT_attr(_valid);
  var c = "";
  if(v!=null){
    if (v.indexOf("lengthOfAny") != -1) {
      var e = v.substring(12, v.length - 1).split(",");
      if (e[1] === undefined) {
        e[1] = e[0]
      }
      var f = "lengthOfAny";
      var d = b._JT_content();
      if (d.length >= parseInt(e[0]) && d.length <= parseInt(e[1])) {
        c = "true"
      } else {
        c = _getValidText(f, e)
      }
    } else {
      c = _checkValue(v, b._JT_content())
    }
    if (c == "true") {
      if (Jet.valid.__default) {
        b._JT_removeClass("jet-unpass");
        b._JT_validValue=undefined;
        _checkIsPw(b)
      }
      if (_onOnePass != undefined) _onOnePass(b)
    } else {
      if (_onOneFail != undefined) _onOneFail(b, c);
      if (Jet.valid.__default) {
        if(isFromBlur===true)
          b._JT_validValue=b._JT_content();
        b._JT_content(c)._JT_addClass("jet-unpass");
        if (b._JT_attr("type") == "password") {
          b._JT_ispw=true;
          b._JT_attr("type", "text")
        }
      }
      if(a!==false){
        if (Jet.valid.useJUI) {
          JUI.msg.error(c);
        }else if(Jet.valid.useAlert) {
          alert(c)
        }
      }
    }
  }
  return c
};

function _validInputOfForm(b) {
  if (b._JT_hasClass("jet-unpass")) {
    if (_onOneFail != undefined) {
      _onOneFail(b, b._JT_val())
    }
    return b._JT_val();
  } else {
    return _validInput(b, false)
  }
};

function _addValidValue(a) {
  if (a._JT_hasClass("jet-unpass")) {
    a._JT_content(a._JT_validValue);
    _checkIsPw(a)
  }
};
//g:元素 f：成功回调函数，c：失败回调函数
function _validateForm(opt) {
  if(typeof opt=='string'){
    opt={ele:opt}
  }
  var g=opt.ele;
  if(typeof g=='string'){
    g=_JT.attr(_form+'='+g);
    if(!g._JT_exist()){
      g=_getJdomEle(opt.ele);
    }
  }
  var e = [];
  var b = true;
  if (opt.fail == undefined) {
    b = false
  }
  var d = true;
  var a = g._JT_findAttr(_valid);
  a._JT_each(function(j) {
    var h = _validInputOfForm(j);
    if (h != "true") {
      d = false;
      if (b) {
        e[e.length] = {
          "obj": j,
          "error": h
        }
      }
    }
  });
  if (!d) {
    if (b) {
      _checkFunction(opt.fail)(e,g);
    }
    var i = (Jet.valid.__lang == "CHINESE") ? "输入有误，请按提示改正。" : "Values is not expected";
    if (Jet.valid.useAlert) {
      alert(i)
    } else if(Jet.valid.useJUI){
      JUI.msg.error(i);
    }
  } else {
    if (opt.pass != undefined) {
      _checkFunction(opt.pass)(g);
    }
  }
};


function _getValueText(b) {
  var c = 0;
  if (b.indexOf("range") != -1) {
    c = 6
  } else {
    if (b.indexOf("letterStart") != -1) {
      c = 12
    } else if (b.indexOf("length") != -1) {
      c = 7
    } else if (b._JT_has("number") && b != "number") {
      c = 7
    }
  }
  if (c != 0) {
    var a = b.substring(c, b.length - 1).split(",");
    if (a[1] === undefined) {
      a[1] = a[0]
    }
    return _getValidText(b.substring(0, c - 1), a)
  } else {
    return _getValidText(b)
  }
};

function _getValidText(a, b) {
  if (Jet.valid.__lang == "CHINESE") {
    if (b == undefined) {
      if(a._JT_has('express')){
        return Jet.valid.validText.CN.express;
      }
      return Jet.valid.validText.CN[a]
    } else {
      var c = "";
      if (a._JT_has("number")) {
        c = " 且长度为"
      }
      if(b[0]==b[1]){
        return Jet.valid.validText.CN[a] + c + b[0]
      }
      return Jet.valid.validText.CN[a] + c + "[" + b[0] + "," + b[1] + "]"
    }
  } else {
    if (b == undefined) {
      if(a._JT_has('express')){
        return Jet.valid.validText.EN.express;
      }
      return Jet.valid.validText.EN[a]
    } else {
      var c = "";
      if (a._JT_has("number")) {
        c = " and length between"
      }
      if(b[0]==b[1]){
        return Jet.valid.validText.EN[a] + c + b[0]
      }
      return Jet.valid.validText.EN[a] + c + "[" + b[0] + "," + b[1] + "]"
    }
  }
};

function _getRegExp(f) {
  var d = -1;
  var c = -1;
  if (f.indexOf("length") != -1) {
    var e = f.substring(7, f.length - 1).split(",");
    f = "length";
    d = e[0];
    if (e[1] == undefined) {
      e[1] = e[0]
    }
    c = e[1]
  } else if (f.indexOf("letterStart") != -1) {
    var e = f.substring(12, f.length - 1).split(",");
    f = "letterStart";
    d = e[0];
    if (e[1] == undefined) {
      e[1] = e[0]
    }
    c = e[1]
  } else if (f._JT_has("number") && f != "number") {
    var e = f.substring(7, f.length - 1).split(",");
    f = "number";
    d = e[0];
    if (e[1] == undefined) {
      e[1] = e[0]
    }
    c = e[1]
  } else if (f._JT_has("express")) {
    d = f.substring(8, f.length - 1);
    f = "express"
  }
  if(f in Jet.valid.regExp){
    return Jet.valid.regExp[f];
  }
  switch (f) {
    case "number":
      if (d >= 0) {
        return new RegExp("^-?(\\d{" + d + "," + c + "})$")
      } else {
        return /^-?(\d+)$/
      }break;
    case "letterStart":return new RegExp("^([a-zA-Z]([a-zA-Z\\d]){" + (parseInt(d) - 1) + "," + (parseInt(c) - 1) + "})$");break;
    case "length":return new RegExp("^(([a-zA-Z\\d]){" + d + "," + c + "})$");break;
    case "express":return new RegExp(d);break;
    default:return "null";break;
  }
};

function _checkValue(a, e) {
  if (a.indexOf("notnull") != -1) {
    if (e.length == 0) {
      return _getValueText("notnull")
    }
  } else if (a.indexOf("null") != -1) {
    var c = a.split(" ");
    var b = (c[0] == "null") ? c[1] : c[0];
    if (b.indexOf("range") != -1) {
      var d = _testRange(a, e);
      if (d != "true" && e != "") {
        return d
      }
    }
    if (!_getRegExp(b).test(e) && e != "") {
      return _getValueText(b)
    }
  } else {
    if (a.indexOf("range") != -1) {
      var d = _testRange(a, e);
      if (d != "true") {
        return d
      }
    } else {
      if (!_getRegExp(a).test(e)) {
        return _getValueText(a)
      }
    }
  }
  return "true"
};

function _testRange(b, c) {
  var a = b.substring(6, b.length - 1).split(",");
  b = "number";
  if (_getRegExp(b).test(c)) {
    if (parseInt(c) < parseInt(a[0]) || parseInt(c) > parseInt(a[1])) {
      return _getValidText("range", a)
    }
  } else {
    return _getValidText("number")
  }
  return "true"
};
/*lang*********************************************************************************/
var _lang="Jlang",_name="Jname";
var _jl_name='';
Jet.lang=function(opt){
  this.type=_lang;
  this.data=opt;
}
Jet.lang.list=[];
Jet.lang.used=false;
Jet.lang.use=function(list){
  if(_JT.type(list)!='array'){
    _throw('Jet.lang.init: 参数是一个数组');
  }else{
    this.used=true;
    this.list=list;
    _jl_name=list[0];
  }
  Jet.lang.init();
};
Jet.lang.jets=[];
Jet.lang.init=function(obj){
  var list;
  if(obj==undefined){
    list=_JT.attr(_lang);
  }else{
    list=_getJdomEle(obj)._JT_findAttr(_lang)
  }
  list._JT_each(function(item){
      if(typeof item._jet_langs==='undefined'){
        item._jet_langs={};
        item._JT_findAttr(_name)._JT_each(function(_item){
          var attr=_item._JT_attr(_name);
          item._jet_langs[attr]=_item._JT_html();
        });
        item._JT_html(item._jet_langs[Jet.lang.type]);
        Jet.valid.init(item);
      }
  });
  Jet.$.id('__preload_jl')._JT_exist(function(item){
      item._JT_remove();
  })
};
Object.defineProperty(Jet.lang, 'type', {
  configurable:true,
  enumerable:true,
  get: function () {
    return _jl_name;
  },
  set: function (val) {
    if(val!==_jl_name&&Jet.lang.list.indexOf(val)!==-1){
      _jl_name = val;
      _refreshLang();
    }
  }
});
function _refreshLang(){
  if(Jet.lang.used){
    _JT.attr(_lang)._JT_each(function(item){//静态文字
      item._JT_html(item._jet_langs[Jet.lang.type]);
      Jet.valid.init(item);
    });
    Jet.lang.jets._JT_each(function(item){//绑定文字
      item.refresh();
    });
  }
}
function _checkLangJet(opt){
  var t=_JT.type(opt._data)
  if((t==='json'&&opt.name in opt._data)||(t==='array'&&typeof opt._data[opt.name]!=='undefined')){
      if(_checkIn(opt._data[opt.name],'type',_lang)){
          Jet.lang.jets.push(this);
      }
  }
}
window.JL=function(opt){
  return new Jet.lang(opt);
}

/*bind*********************************************************************************/
Jet.Bind=function(opt){
  Jet.Base.call(this,opt,_bind);
  _initBind.call(this,opt);
};
Jet.Bind.prototype = new Super();
Jet.Bind.prototype.refresh=function(key){
  //if(!key||key==this.name){
    this._tools._jets._JT_each(function(item){
      item.refresh(key);
    });
    this._tools._jetTools._JT_each(function(item){
      item.refresh(key);
    });
  //}
};Jet.Bind.prototype.$get=function(){
  return this.data[this.name];
};
function _initBind(opt){
  var _this=this;
  var _data=opt.data[opt.name];
  var bindList=this.ele._JT_findAttr(_bind);
  var ifList=this.ele._JT_findAttr(_if);
  var showList=this.ele._JT_findAttr(_show);
  var onList=this.ele._JT_findAttr(_on);
  var runList=this.ele._JT_findAttr(_run);
  var attrList=this.ele._JT_findAttr(_attr);
  var styleList=this.ele._JT_findAttr(_style);
  bindList._JT_each(function(item,index){
    if(!item._hasBind){
      var attr=item._JT_attr(_bind);
      var _jet;
      if(attr==_value){
        var _opt=_bindOpt(_this,item,_this.name,_this.par._tools._calls[_this.name]);
        _opt.data=_this.data;
        _opt._data=_this._data;
        if(isInput(item)){
          _jet=new Jet.Input(_opt);
        }else{
          _jet=new Jet.Text(_opt);
        }
      }else if(attr==_index||attr._JT_has("$.$p")){
        var _opt=_bindOpt(_this,item,attr,_this.par._tools._calls);
        _opt.index=_this.name;
        if(isInput(item)){
          //_jet=new Jet.Input(_opt);
          _throw('input:不允许将index绑定到输入项中');
        }else{
          if(attr._JT_has("$.$p")){
            if(attr._JT_has('(')){
              _opt._parIndex=parseInt(attr.substring(attr.indexOf('(')+1,attr.indexOf(')')));
            }else{
              _opt._parIndex=(attr.split('$p').length-1);//需要修改timeOf
            }
          }
          _jet=new Jet.Text(_opt);
        }
      }else{
          var _opt;
          if(item._JT_hasAttr(_root)){
              _opt=_bindRootOpt(_this.jet,item,attr);
          }else{
              _opt=_bindOpt(_this,item,attr,_this._tools._calls[attr]);
          }
          if(attr in _opt._data){
              var type=_JT.type(_opt._data[attr]);
              switch(type){
              case 'json':_jet=new Jet.Bind(_opt);break;
              case 'array':_jet=new Jet.For(_opt);break;
              default:{
                  if(isInput(item)){
                  _jet=new Jet.Input(_opt);
                  }else{
                  _jet=new Jet.Text(_opt);
                  }
              };break;
              }
          }else{
              //_throw('原数据没有'+attr+'属性');
          }
      }
      _this._tools._jets.push(_jet);
    }
  });
  ifList._JT_each(function(item){
    if(!item._hasIf){
      if(item._JT_hasAttr(_root)){
          _this._tools._jetTools.push(new Jet.If(_bindRootOpt(_this.jet,item)));
      }else{
          _this._tools._jetTools.push(new Jet.If(_bindOpt(_this,item)));
      }
    }
  });
  showList._JT_each(function(item){
    if(!item._hasShow){
      if(item._JT_hasAttr(_root)){
          _this._tools._jetTools.push(new Jet.Show(_bindRootOpt(_this.jet,item),true));
      }else{
          _this._tools._jetTools.push(new Jet.Show(_bindOpt(_this,item),true));
      }
    }
  });
  onList._JT_each(function(item){
    if(!item._hasOn){
      if(item._JT_hasAttr(_root)){
          _this._tools._jetTools.push(new Jet.On(_bindRootOpt(_this.jet,item)));
      }else{
          _this._tools._jetTools.push(new Jet.On(_bindOpt(_this,item)));
      }
    }
  });
  runList._JT_each(function(item){
    if(!item._hasRun){
      if(item._JT_hasAttr(_root)){
          _this._tools._jetTools.push(new Jet.Run(_bindRootOpt(_this.jet,item)));
      }else{
          _this._tools._jetTools.push(new Jet.Run(_bindOpt(_this,item)));
      }
    }
  });
  
  attrList._JT_each(function(item){
      if(!item._hasAttr){
          if(item._JT_hasAttr(_root)){
              _this._tools._jetTools.push(new Jet.Attr(_bindRootOpt(_this.jet,item)));
          }else{
              _this._tools._jetTools.push(new Jet.Attr(_bindOpt(_this,item)));
          }
      }
  });
  styleList._JT_each(function(item){
      if(!item._hasStyle){
          if(item._JT_hasAttr(_root)){
              _this._tools._jetTools.push(new Jet.Style(_bindRootOpt(_this.jet,item),true));
          }else{
              _this._tools._jetTools.push(new Jet.Style(_bindOpt(_this,item),true));
          }
      }
  });
  _checkJetTools.call(this,opt);
  
  this.$regist(function(key,val){
    _this.refresh();
  });
};
function _bindOpt(_this,item,name,_calls){
  return {
    jet:_this.jet,
    par:_this,
    ele:item,
    data:_this.data[_this.name],
    _data:(_this._data==undefined)?null:_this._data[_this.name],
    name:name,
    calls:_calls||_this._tools._calls  
    //indexs:_this.indexs
  }
}
function _bindRootOpt(jet,item,name){
  return {
      jet:jet,
      par:jet,
      ele:item,
      data:jet,
      _data:jet._tools._data,
      name:name,
      calls:jet._tools._calls
  }
}
/*for*********************************************************************************/
Jet.For=function(opt){
  Jet.Base.call(this,opt,_for);
  _initFor.call(this,opt);
};
Jet.For.prototype = new Super();
Jet.For.prototype.refresh=function(key){
  if(!key||key==this.name){
    this._tools._jets._JT_each(function(item){
      item.refresh(key);
    });
    this._tools._jetTools._JT_each(function(item){
      item.refresh(key);
    });
  }
};Jet.For.prototype.$get=function(){
  return this.data[this.name];
};Jet.For.prototype.refreshParIndex=function(){
  this._tools._jets._JT_each(function(item){
    item._tools._jets._JT_each(function(_item){
      if(_item._parIndex&&_item.type==_text){
        _item.refresh();
      }else if(_item.type==_for){
        _item.refreshParIndex();
      }
    });
  });
};Jet.For.prototype.refresh.push=function(){
  if(this._switch){
    var _t=this._data[this.name]._JT_last()[this._type];
    if(_t in this._html){
      this.ele._JT_append(this._html[_t]);
    }else{
      _throw('swicth:指定属性的值不在swicth枚举内');
    }
  }else{
    this.ele._JT_append(this._html);
  }
  var item=this.ele._JT_child()._JT_last(),i=this.data[this.name].length-1;
  var _opt=_forOpt(this,item,i);
  if(_JT.type(_opt.data[0])=='array'){
    this._tools._jets.push(new Jet.For(_opt));
  }else{
    this._tools._jets.push(new Jet.Bind(_opt));
  }
  _initOneForBindTool(this,item,i)
};Jet.For.prototype.refresh.prep=function(){
  if(this._switch){
    var _t=this._data[this.name]._JT_first()[this._type];
    if(_t in this._html){
      this.ele._JT_prepend(this._html[_t]);
    }else{
      _throw('swicth:指定属性的值不在swicth枚举内');
    }
  }else{
    this.ele._JT_prepend(this._html);
  }
  var item=this.ele._JT_child(0);
  var _opt=_forOpt(this,item,0);
  if(_JT.type(_opt.data[0])=='array'){
    this._tools._jets._JT_prepend(new Jet.For(_opt));
  }else{
    this._tools._jets._JT_prepend(new Jet.Bind(_opt));
  }
  _refreshIndex.call(this,0);
  _initOneForBindTool(this,item,0);
};
Jet.For.prototype.refresh.insert=function(index){
  if(this._switch){
    var _t=this._data[this.name][index][this._type];
    if(_t in this._html){
      this.ele._JT_append(this._html[_t],index);
    }else{
      _throw('swicth:指定属性的值不在swicth枚举内');
      return;
    }
  }else{
    this.ele._JT_append(this._html,index);
  }
  var _opt=_forOpt(this,this.ele._JT_child(index),index);
  if(_JT.type(_opt.data[0])=='array'){
    this._tools._jets._JT_insert(new Jet.For(_opt),index);
  }else{
    this._tools._jets._JT_insert(new Jet.Bind(_opt),index);
  }
  _refreshIndex.call(this,index+1);
  _initOneForBindTool(this,this.ele._JT_child(index),index+1);
};
Jet.For.prototype.refresh.insertArray=function(arr,index){//bug
  var _this=this;
  var type=_JT.type(arr[0]);
  arr._JT_each(function(item,i){
    var _i=index+i;
    if(_this._switch){
      var _t=_this._data[_this.name][_i][_this._type];
      if(_t in _this._html){
        _this.ele._JT_append(_this._html[_t],_i);
      }else{
        _throw('swicth:指定属性的值不在swicth枚举内');
      }
    }else{
      _this.ele._JT_append(_this._html,_i);
    }
    var _opt=_forOpt(_this,_this.ele._JT_child(_i),_i);
    if(type=='array'){
      _this._tools._jets._JT_insert(new Jet.For(_opt),_i);
    }else{
      _this._tools._jets._JT_insert(new Jet.Bind(_opt),_i);
    }
    _initOneForBindTool(_this,_this.ele._JT_child(_i),_i);
  });
  _refreshIndex.call(this,index+arr.length);
};
Jet.For.prototype.refresh.remove=function(index,n){
  for(var i=0;i<n;i++){
    this.ele._JT_child(index)._JT_remove();
  }
  this._tools._jets.splice(index,n);
  _refreshIndex.call(this,index);
};
function _refreshIndex(start){
  for(var i=start;i<this._tools._jets.length;i++){
    this._tools._jets[i]._tools._jets._JT_each(function(item){
      if(item.name==_index){
        item.setIndex(i);
      }else if(typeof item.name==='number'){
        item.setDataIndex(i);
      }else if(item.type==_for){
        item.refreshParIndex();
      }
    });
    this._tools._jets[i]._tools._jetTools._JT_each(function(item){
      if(typeof item.name==='number'){
        item.setDataIndex(i);
      }
    });
  }
}
function _initForRule(ele){
  if(this.ele._JT_child(0)!=undefined&&this.ele._JT_child(0)._JT_hasAttr(_bind)&&this.ele._JT_child(0)._JT_attr(_bind)._JT_has('=')){//switch模式  $each.t=1
    this._switch=true;
    this._html={};
    this._type=null;
    var _this=this;
    var temp={};
    this.ele._JT_child()._JT_each(function(item){
      var val=item._JT_attr(_bind);
      if(_this._type==null)_this._type=val.substring(val.indexOf('.')+1,val.indexOf('='))
      if(!val._JT_has('='))_throw('swicth:html格式有误');
      val=val.substring(val.indexOf('=')+1);
      _this._html[val]=item._JT_allHtml();
      temp[val]=_JT.ct('div')._JT_append(item);
    });
    for(var i=0;i<this.data[this.name].length;i++){
      var t=this.data[this.name][i][this._type];
      if(t in this._html){
        if(t in temp){
          this.ele._JT_append(temp[t]._JT_child(0));
          delete temp[t];
        }else{
          this.ele._JT_append(this._html[t]);
        }
      }else{
        _throw('swicth:指定属性的值不在swicth枚举内');
      }
    }
  }else{//普通模式
    if(!this.ele._JT_findAttr(_bind+'="'+_each+'"')._JT_exist()){//没有$each
      var html=this.ele._JT_html();
      var _tag='div';
      if(this.ele._JT_hasAttr('jfor-inline')){
        _tag='span';
        this.ele._JT_removeAttr('jfor-inline')
      }
      this._html='<'+_tag+' '+_bind+'="'+_each+'">'+html+'</'+_tag+'>'
      for(var i=0;i<this.data[this.name].length;i++){
        var each=_JT.ct(_tag)._JT_attr(_bind,_each);
        if(i==0){
          this.ele.childNodes._JT_each(function(item){
            each._JT_append(item);
          });
        }else{
          each._JT_html(html);
        }
        this.ele._JT_append(each);
      }
    }else if(this.ele._JT_child().length!=1||this.ele._JT_child(0)._JT_attr(_bind)!=_each){//不止一个元素，或者第一个元素不是each
      _throw('循环元素绑定格式错误！');
    }else{//有each且只有一个元素
      var html=this.ele._JT_html();
      this._html=html;
      for(var i=0;i<this.data[this.name].length-1;i++){
        this.ele._JT_append(html);
      }
    }
  }
  if(this.data[this.name].length==0){
    this.ele._JT_findAttr(_bind)._JT_each(function(item){
      item._hasRemove=true;
    })
    this.ele._JT_empty();
  }
}
function _initFor(opt){
  var _this=this;
  this.data[this.name]._jet=this;
  _initForRule.call(this);
  this.ele._JT_child()._JT_each(function(item,i){
    if(!item._hasBind){
      var _opt=_forOpt(_this,item,i);
      // _opt.data[_opt.name].$par=_this.data;
      // _opt.data[_opt.name].$index=i;
      var _jet;
      if(_JT.type(_opt.data[0])=='array'){
        _jet=new Jet.For(_opt);
      }else{
        _jet=new Jet.Bind(_opt);
      }
      _this._tools._jets.push(_jet);
      _initOneForBindTool(_this,item,i);
    }
  });
  _checkJetTools.call(this,opt);
  this.$regist(function(key,val){
    _this.refresh();
  });
};
function _forOpt(_this,item,index){
  return {
    jet:_this.jet,
    par:_this,
    ele:item,
    data:_this.data[_this.name],
    _data:_this._data[_this.name],
    name:index,
    calls:_this._tools._calls[index]
    //indexs:_JT._JT_clone(_this.indexs)._JT_append(index)
  }
}
function _initOneForBindTool(_this,item,i){
  var forOpt=(item._JT_hasAttr(_root))?_forRootOpt(_this.jet,item,i):_forOpt(_this,item,i);
  var tools=_this._tools._jets[i]._tools._jetTools;
  if(item._JT_hasAttr(_if)&&!item._hasIf){
    tools.push(new Jet.If(forOpt));
  }
  if(item._JT_hasAttr(_show)&&!item._hasShow){
    tools.push(new Jet.Show(forOpt,true));
  }
  if(item._JT_hasAttr(_on)&&!item._hasOn){
    tools.push(new Jet.On(forOpt));
  }
  if(item._JT_hasAttr(_run)&&!item._hasRun){
    tools.push(new Jet.Run(forOpt));
  }
  if(item._JT_hasAttr(_attr)&&!item._hasAttr){
    tools.push(new Jet.Attr(forOpt));
  }
  if(item._JT_hasAttr(_style)&&!item._hasStyle){
    tools.push(new Jet.Style(forOpt,true));
  }
}
function _forRootOpt(_this,item,index){
  return {
    jet:jet,
    par:jet,
    ele:item,
    data:jet,
    _data:jet._tools._data,
    name:index,
    calls:jet._tools._calls
  }
}
/*repeat*********************************************************************************/
Jet.Repeat=function(){

}

/*text*********************************************************************************/

Jet.Text=function(opt){
  Jet.Base.call(this,opt,_text);
  this.isHtml=opt.ele._JT_hasAttr(_html);
  this._parIndex=opt._parIndex;//多层循环中的第几层父元素
  opt.par=this;
  _initText.call(this,opt);
};
Jet.Text.prototype = new Super();
Jet.Text.prototype.refresh=function(key){
  if(!key||key==this.name){
    var val=(this.func)?this.func.call(this.jet,this.$get()):this.$get();
    if(this.isHtml){
      this.ele._JT_html(val);
    }else{
      this.ele._JT_txt(val);
    }
  }
};Jet.Text.prototype.$get=function(){//indexs
  if(this._parIndex){
    return _getParIndex(this,this._parIndex)
    //return this.indexs[this.indexs.length-1-this._parIndex];
  }else{
    if(this.index!=undefined){
      return this.index;
    }else{
      return this.data[this.name];
    }
  }
};Jet.Text.prototype.setIndex=function(i){//indexs
  this.index=i;
  this.refresh();
  this._tools._jetTools._JT_each(function(item){
    if(item.name==_index){
      item.refresh(i);
    }
  });
};Jet.Text.prototype.setDataIndex=function(i){//indexs
  this.name=i;
  // this.refresh();
  // this._tools._jetTools._JT_each(function(item){
  //   if(item.name==_index){
  //     item.refresh(i);
  //   }
  // });
};
function _getParIndex(_this,i){
  var par=_this.par;
  while(i>0){
    par=par.par;
    if(_type(par._data)!='array'){
      par=par.par;
    }
    i--;
  }
  return par.ele._JT_index();
}
function _initText(opt){
  _checkLangJet.call(this,opt);
  var _this=this;
  if(this.ele._JT_html().trim()!=''){
    this.func=new Function("$",'return '+this.ele._JT_html());
  }
  _checkJetTools.call(this,opt);
  this.$regist(function(key,val){
    _this.refresh();
  });
  this.refresh();
}
/*input*********************************************************************************/

Jet.Input=function(opt){
  Jet.Base.call(this,opt,_input);
  opt.par=this;
  _initInput.call(this,opt);
};
Jet.Input.prototype = new Super();
Jet.Input.prototype.refresh=function(key){
  if(!key||key==this.name){
    var val=(this.func)?this.func.call(this.jet,this.$get()):this.$get();
    if(this.isContent){
      if(val!==((this.isNum)?parseFloat(this.ele.innerHTML):this.ele.innerHTML))
        this.ele._JT_html(val);
    }else{
      if(val!==((this.isNum)?parseFloat(this.ele.value):this.ele.value))
        this.ele._JT_val(val);
    }
  }
};Jet.Input.prototype.$get=function(){
  return this.data[this.name];
};
function _initInput(opt){
  _checkLangJet.call(this,opt);
  var _this=this;
  if(this.ele._JT_hasAttr('contenteditable')){
    this.isContent=true;
    if(this.ele._JT_html().trim()!='')
      this.func=new Function("$",'return '+this.ele._JT_html());
  }else if(this.ele.tagName!='SELECT'&&this.ele._JT_val().trim()!=''){
    this.func=new Function("$",'return '+this.ele._JT_val());
  }
  if(this.ele._attrVal==_index){
    _throw('输入框不能绑定数组的索引');
  }
  this.$regist(function(key,val){
    _this.refresh();
  });
  this.isNum=(_JT.type(this.$get())=='number');
  if(this.ele.tagName=='SELECT'||(this.ele.tagName=='INPUT'&&this.ele._JT_attr('type').toLowerCase()!='text')){
    this.ele._JT_on("change",function(){
      _dealOnInputOn.call(this,_this);
    },true);
  }else{
    this.inputLock = false;
    this.ele.addEventListener('compositionstart', function(){
      _this.inputLock = true;
    })
    this.ele.addEventListener('compositionend', function(){
      _this.inputLock = false;
      _dealOnInputOn.call(_this.ele,_this);
    })
    this.ele._JT_on("input",function(){
      if(!_this.inputLock){
        _dealOnInputOn.call(this,_this);
      }
    },true);
  }
  _checkJetTools.call(this,opt);
  this.refresh();
}
function _dealOnInputOn(_this){
  var val=(_this.isContent)?this._JT_html():this._JT_val();
  //if(_this.isNum){
    var _v=parseFloat(val);
    if(val==_v.toString()){
      _this.isNum=true;
      val=_v;
    }else{
      _this.isNum=false;
    }
  //}
  _this.data[_this.name]=val;
}
/*if*********************************************************************************/
// Jif="exp:class[a,b|b];attr[a=b,a=b|a];text[a|b];html[a|b];css[a=a,a=a|b=b];func"
Jet.If=function(opt,isShow){
  this.exp=null;
  this.func_true=null;
  this.func_false=null;
  Jet.Base.call(this,opt,(isShow)?_show:_if);
  _initIf.call(this);
  var __jet=this.ele.__jet;
  if(typeof __jet!=='undefined'&&(__jet.type==_text||__jet.type==_input)){
    this.needParData=true;
  }
};
Jet.If.prototype = new Super();
Jet.If.prototype.$get=function(){
  if(this.name==_index){
    if(this.needParData){
      //会refresh 不需要修改
    }
    return this.index;
  }else if(this.name==_value||this.name==undefined){
    if(this.needParData){
      if(this.par.$DOM){
        return this.par;
      }else{
        return this.par.data[this.par.name];
      }
    }else{
      return this.data;
    }
  }else{
    return this.data[this.name];
  }
};Jet.If.prototype.refresh=function(i){
  if(this.index!=undefined&&i!=undefined&&this.index!=i){
    this.index==i;
  }
  var d=this.$get();
  var opt={
    ele:this.ele,
    data:d,
    jet:this,
    root:this.jet
  }
  //if(this.exp.call(opt,d)===true){//弃用原因 不好做数据改变的检测
  // if(this.exp.toString()._JT_has('"a"'))
  // console.loconsole.log(this.exp)
  if(this.exp(d,this.jet)===true){
    this.func_true.call(this.jet,opt);
  }else{
    this.func_false.call(this.jet,opt);
  }
};
function _registForWrapperVar(_this,content){
  var m=content.match(_reg);
  if(m==null){
      if(!(content in _this._data)&&!content._JT_has("$.")){
          //_throw(_this.type+':['+content+']若值是表达式，请使用{{}}将表达式里的变量包裹起来');
      }
      _this.$regist(content,function(key,val){
          _this.refresh();
      });
  }else{
      var arr=[];
      m.forEach(function(_ele){
          if(arr.indexOf(_ele)==-1){
              arr.push(_ele);
              if(_ele=="{{$}}"){
                  _this.$regist(function(key,val){
                      _this.refresh();
                  });
              }else{
                var obj=_this;
                if(_ele._JT_has('$r.')){
                  obj=_this.jet;
                }
                obj.$regist(_ele.substring(2,_ele.length-2),function(key,val){
                  _this.refresh();
                })
              }
          }
      });
  }
}
function _initIf(){
  var _this=this;
  var ifAttr=this._attrVal;
  if(this.type==_show){
      _registForWrapperVar(this,ifAttr);
      this.func_true=function(){
          _this.ele.style.display=''
      };
      this.func_false=function(){
          _this.ele.style.display='none'
      };
      if(!(ifAttr in this._data)){

        // if(ifAttr._JT_has(_each)){
        //   ifAttr=ifAttr._JT_replaceAll("\\"+_each,"d."+this.ele.__jet.par.name+"["+this.ele.__jet.name+"]")._JT_replaceAll("{{",'')._JT_replaceAll("}}",'');
        // }else{
          ifAttr=ifAttr._JT_replaceAll("\\$","d")._JT_replaceAll("{{",'')._JT_replaceAll("}}",'');
        //}
      }else{
        ifAttr='d.'+ifAttr;
      }
      this.exp=new Function("d","dr","return ("+ifAttr+")");
  }else{
      var temp=ifAttr.substring(0,ifAttr.indexOf(":"));
      _registForWrapperVar(this,temp);
      if(typeof this._data!=='object'){
        temp=temp._JT_replaceAll("\\$","d")._JT_replaceAll("{{",'')._JT_replaceAll("}}",'');
      }else{
        if(!(temp in this._data)){
          temp=temp._JT_replaceAll("\\$","d")._JT_replaceAll("{{",'')._JT_replaceAll("}}",'');
        }else{
          temp='d.'+temp;
        }
      }
      this.exp=new Function("d","dr","return ("+temp+")");
      ifAttr=ifAttr.substring(ifAttr.indexOf(":")+1);
      var func_t="";
      var func_f="";
      ifAttr.split(";")._JT_each(function(item){//
      if(item._JT_has("class[")){
          var cls=item.substring(item.indexOf("[")+1,item.length-1);
          if(cls._JT_has("|")){
          var c1=cls.split("|")[0].split(",").join(" ");
          var c2=cls.split("|")[1].split(",").join(" ");
          func_t+="opt.ele._JT_removeClass('"+c2+"')._JT_addClass('"+c1+"');";
          func_f+="opt.ele._JT_removeClass('"+c1+"')._JT_addClass('"+c2+"');";
          }else{
          cls=cls.split(",").join(" ");
          func_t+="opt.ele._JT_addClass('"+cls+"');";
          func_f+="opt.ele._JT_removeClass('"+cls+"');";
          }
      }else if(item._JT_has("attr[")){
          var attr=item.substring(item.indexOf("[")+1,item.length-1);
          if(attr._JT_has("|")){
            var trueList=attr.split("|")[0].split(",");
            var trueAttrs=[];
            trueList._JT_each(function(a){
              trueAttrs.push(a.split('=')[0])
            })
            var falseList=attr.split("|")[1].split(",");
            var falseAttrs=[];
            falseList._JT_each(function(a){
              falseAttrs.push(a.split('=')[0])
            })
            trueList._JT_each(function(a){
                var pv=a.split("=");
                if(pv.length==1){
                  pv[1]="";
                }
                func_t+="opt.ele._JT_attr('"+pv[0]+"','"+pv[1]+"');";
                if(falseAttrs.indexOf(pv[0])==-1){
                  func_f+="opt.ele._JT_removeAttr('"+pv[0]+"');";
                }
            });
            falseList._JT_each(function(a){
                var pv=a.split("=");
                if(pv.length==1){
                  pv[1]="";
                }
                func_f+="opt.ele._JT_attr('"+pv[0]+"','"+pv[1]+"');";
                if(trueAttrs.indexOf(pv[0])==-1){
                  func_t+="opt.ele._JT_removeAttr('"+pv[0]+"');";
                }
            })
          }else{
          attr.split(",")._JT_each(function(a){
              var pv=a.split("=");
              if(pv.length==1){
                pv[1]="";
              }
              func_t+="opt.ele._JT_attr('"+pv[0]+"','"+pv[1]+"');";
              func_f+="opt.ele._JT_removeAttr('"+pv[0]+"');";
          });
          }
      }else if(item._JT_has("text[")){
          var text=item.substring(item.indexOf("[")+1,item.length-1);
          if(text._JT_has("|")){
          func_t+="opt.ele._JT_txt('"+text.split("|")[0]+"');";
          func_f+="opt.ele._JT_txt('"+text.split("|")[1]+"');";
          }else{
          func_t+="opt.ele._JT_txt('"+text+"');";
          func_f+="opt.ele._JT_txt('');";
          }
      }else if(item._JT_has("html[")){
          var html=item.substring(item.indexOf("[")+1,item.length-1);
          if(html._JT_has("|")){
          func_t+="opt.ele._JT_html('"+html.split("|")[0]+"');";
          func_f+="opt.ele._JT_html('"+html.split("|")[1]+"');";
          }else{
          func_t+="opt.ele._JT_html('"+html+"');";
          func_f+="opt.ele._JT_html('');";
          }
      }else if(item._JT_has("css[")){
          var attr=item.substring(item.indexOf("[")+1,item.length-1);
          if(attr._JT_has("|")){
          func_t+="opt.ele._JT_removeAttr('style');";
          attr.split("|")[0].split(",")._JT_each(function(a){
              var pv=a.split("=");
              if(pv.length==1){
              pv[1]="";
              }
              func_t+="opt.ele._JT_css('"+pv[0]+"','"+pv[1]+"');";
          });
          func_f+="opt.ele._JT_removeAttr('style');";
          attr.split("|")[1].split(",")._JT_each(function(a){
              var pv=a.split("=");
              if(pv.length==1){
              pv[1]="";
              }
              func_f+="opt.ele._JT_css('"+pv[0]+"','"+pv[1]+"');";
          })
          }else{
          func_t+="opt.ele._JT_removeAttr('style');";
          attr.split(",")._JT_each(function(a){
              var pv=a.split("=");
              if(pv.length==1){
              pv[1]="";
              }
              func_t+="opt.ele._JT_css('"+pv[0]+"','"+pv[1]+"');";
          });
          func_f+="opt.ele._JT_removeAttr('style');";
          }
      }else{
          if(item._JT_has("|")){
            item=item.split("|");
            if(item[0] in _this.jet){
              func_t+="this."+item[0]+".call(this,opt);";
            }else{
              func_t+=item[0];
            }
            if(item[1] in _this.jet){
              func_f+="this."+item[1]+".call(this,opt);";
            }else{
              func_f+=item[1];
            }
          }else{
            if(item in _this.jet){
              func_t+="this."+item+".call(this,opt);";
            }else{
              func_t+=item;
            }
          }
      }
      });
      this.func_true=new Function("opt",func_t);
      this.func_false=new Function("opt",func_f);
  }
  this.refresh();
}
/*on*********************************************************************************/
Jet.On=function(opt){
  Jet.Base.call(this,opt,_on);
  _initOn.call(this);
  var __jet=this.ele.__jet;
  if(typeof __jet!=='undefined'&&(__jet.type==_text||__jet.type==_input)){
    this.needParData=true;
  }
};
Jet.On.prototype = new Super();
Jet.On.prototype.$get=function(){
  if(this.index!=undefined){
    return this.index;
  }
  if(this.data==undefined){
    return null;
  }else if(this.name==undefined||this.name==_value){
    if(this.needParData){
      if(this.par.$DOM){
        return this.par;
      }else{
        return this.par.data[this.par.name];
      }
    }else{
      return this.data;
    }
  }else{
    return this.data[this.name];
  }
};Jet.On.prototype.refresh=function(i){
  if(this.index!=undefined&&i!=undefined&&this.index!=i){
    this.index=i;
  }
};
function _initOn(){
  var _this=this;
  this._attrVal.split(';;')._JT_each(function(attr){
    
    if(!attr._JT_has(":")){
      //_throw('jon 属性格式错误:'+attr);
      attr='click:'+attr;
    }
    var e0=attr.substring(0,attr.indexOf(':'));
    var e1=attr.substring(attr.indexOf(':')+1);
    var _f='';
    var _valid_false=null,_vf_func=[];
    var valid=false,validPar;
    var func=[];
    if(e1._JT_has('$valid')){
      if(e1._JT_has('=>')){
        valid=true;
        validPar=Jet.valid.findValidPar(_this.ele);
        _f=e1.substring(e1.indexOf('=>')+2).trim();
        if(_f._JT_has('|')){
          var a=_f.split('|');
          _f=a[0];
          _valid_false=a[1];
        }
        //_this.func=_this.jet[e1.substring(e1.indexOf('=>')+2)];
      }else{
        _throw('valid:"'+e1+'" 格式有误，操作符为 =>')
      }
    }else{
      _f=e1;
      //_this.func=_this.jet[e1];
    }
    if(_f in _this.jet||_f.substring(0,_f.indexOf(',')) in _this.jet){
      _f.split(',').forEach(function(f){
        if(typeof _this.jet[f]!='function')
          _throw(f+' 不是一个方法');
        else
          func.push(_this.jet[f]);
      });
    }else{
      func=[new Function('opt',_f)];
    }
    if(valid&&_valid_false!=null){
      if(_valid_false in _this.jet||_valid_false.substring(0,_valid_false.indexOf(',')) in _this.jet){
        _valid_false.split(',').forEach(function(f){
          if(typeof _this.jet[f]!='function')
            _throw(f+' 不是一个方法');
          else
            _vf_func.push(_this.jet[f]);
        });
      }else{
        _vf_func=[new Function('opt',_valid_false)];
      }
    }

    _this.ele._JT_on(e0,function(event){
      var opt={
        ele:this,
        data:_this.$get(),
        event:event,
        jet:_this
      };
      if(valid){
        validPar._JT_validate(function(){
          func.forEach(function(f){
            f.call(_this.jet,opt);
          });
        },function(){
          _vf_func.forEach(function(f){
            f.call(_this.jet,opt);
          });
        });
      }else{
        func.forEach(function(f){
          f.call(_this.jet,opt);
        });
      }
    });
  });

}


/*run*********************************************************************************/
Jet.Run=function(opt){
  Jet.Base.call(this,opt,_run);
  _initRun.call(this,opt);
};
Jet.Run.prototype = new Super();
Jet.Run.prototype.$get=function(){
  if(this.index!=undefined){
    return this.index;
  }
  if(this.data==undefined){
    return null;
  }else if(this.name==undefined){
      return this.data
  }else{
    return this.data[this.name];
  }
};Jet.Run.prototype.refresh=function(i){
  if(this.index!=undefined&&i!=undefined&&this.index!=i){
    this.index==i;
  }
  this.run();
};Jet.Run.prototype.run=function(){
  var _this=this;
  var opt={
    ele:_this.ele,
    data:_this.$get(),
    jet:_this
  };
  this.runs._JT_each(function(name){
    if(name in _this.jet&&typeof _this.jet[name]=='function'){
      _this.jet[name].call(_this.jet,opt);
    }else{
      (new Function('opt',name)).call(_this.jet,opt);
    }
  });
};
function _initRun(opt){
  this.runs=this._attrVal.split(",");
  if(!(this.runs[0] in this.jet&&typeof this.jet[this.runs[0]]=='function')){
    this.runs=[this._attrVal];
  }
  this.run();
}


/*attr*********************************************************************************/
// Jattr="value:aa;disabled:aa"
Jet.Attr=function(opt,isStyle){
  Jet.Base.call(this,opt,(isStyle)?_style:_attr);
  this.isStyle=isStyle;
  this.setFunc=(this.isStyle)?this.ele._JT_css:this.ele._JT_attr;
  _initAttr.call(this,opt);
  if(typeof __jet!=='undefined'&&(__jet.type==_text||__jet.type==_input)){
    this.needParData=true;
  }
};
Jet.Attr.prototype = new Super();
Jet.Attr.prototype.$get=function(){
  if(this.index!=undefined){
    return this.index;
  }
  if(this.data==undefined){
    return null;
  }else if(this.name==undefined||this.name==_value){
    if(this.needParData){
      this.data=this.par.data[this.par.name];
    }
    return this.data
  }else{
    return this.data[this.name];
  }
};Jet.Attr.prototype.refresh=function(i){
  var d=this.$get();
  for(var k in this.attrs){
    this.setFunc.call(this.ele,k,this.attrs[k](d,this.jet))
  }
};
function _initAttr(opt){
  var attr=this._attrVal;
  this.attrs={};
  var _this=this;
  if(attr._JT_has(';')){
    attr.split(";").forEach(function(item){
      _initOneAttr.call(_this,item);
    });
  }else{
    _initOneAttr.call(_this,attr);
  }
  this.refresh();
}
function _initOneAttr(attr){
  if(!attr._JT_has(':')){
      _throw((this.isStyle)?'JStyle':'JAttr'+':必须指定属性的值');
  }else{
      var index=attr.indexOf(":");
      var _s=attr.substring(index+1);
      if(_s._JT_has('{{')){//动态
        _registForWrapperVar(this,_s);
        _s=_s._JT_replaceAll("\\$","d")._JT_replaceAll("{{",'')._JT_replaceAll("}}",'');
        this.attrs[attr.substring(0,index)]=new Function("d",'dr',"return ("+_s+")");
      }else{//静态
        this.attrs[attr.substring(0,index)]=new Function("return '"+_s+"'");
      }
  }
}


/*style*********************************************************************************/
// Jstyle="color:aa;font-size:aa"
Jet.Style=Jet.Attr;
Jet.Show=Jet.If;


//})();








