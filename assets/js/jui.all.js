
//18-3-20:
// message 增加30ms延迟 增加hover属性
// jetterjs
//    insertArray(使用原生splice) removeByIndex(支持第二个参数选择删除个数)
//    ajax 请求和 convertData

//(function(){
  //*********calendar-converter.js****************

  ///////////////////////////////////////////////////
  //
  // lunarInfo
  //
  ///////////////////////////////////////////////////

  // base data about chinese year informace
  // 保存公历农历之间的转换信息:以任意一年作为起点，
  // 把从这一年起若干年(依需要而定)的农历信息保存起来。 要保存一年的信息，只要两个信息就够了: 1)农历每个月的大小;2)今年是否有闰月，闰几月以及闰月的大小。 用一个整数来保存这些信息就足够了。 具体的方法是:用一位来表示一个月的大小，大月记为1，小月记为0，
  // 这样就用掉12位(无闰月)或13位(有闰月)，再用高四位来表示闰月的月份，没有闰月记为0。 ※-----例----: 2000年的信息数据是0xc96，化成二进制就是110010010110B，
  // 表示的含义是:1、2、5、8、10、11月大，其余月份小。 2001年的农历信息数据是0x1a95(因为闰月，所以有13位)，
  // 具体的就是1、2、4、5、8、10、12月大， 其余月份小(0x1a95=1101010010101B)，
  // 4月的后面那一个0表示的是闰4月小，接着的那个1表示5月大。 这样就可以用一个数组来保存这些信息。在这里用数组lunarInfo[]来保存这些信息
  var lunarInfo=new Array(
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,
  0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,
  0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,
  0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,
  0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,
  0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,
  0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,
  0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,
  0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,
  0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,
  0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,
  0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,
  0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,
  0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
  0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,
  0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,
  0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0);

  var Gan=new Array("甲","乙","丙","丁","戊","己","庚","辛","壬","癸");
  var Zhi=new Array("子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥");
  var Animals=new Array("鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪");
  // TODO is it need to do
  var sTermInfo = new Array(0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758);
  var nStr1 = new Array('日','一','二','三','四','五','六','七','八','九','十');
  var nStr2 = new Array('初','十','廿','卅','□');
  // var monthName = new Array("JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC");
  var cmonthName = new Array('正','二','三','四','五','六','七','八','九','十','十一','腊');

  //公历节日 *表示放假日
  var sFtv = new Array(
  "0101*元旦",
  "0214 情人节",
  "0308 妇女节",
  "0312 植树节",
  "0401 愚人节",
  "0422 地球日",
  "0501 劳动节",
  "0504 青年节",
  "0531 无烟日",
  "0601 儿童节",
  "0606 爱眼日",
  "0701 建党日",
  "0707 抗战纪念日",
  "0801 建军节",
  "0910 教师节",
  "0918 九·一八事变纪念日",
  "1001*国庆节",
  "1031 万圣节",
  "1111 光棍节",
  "1201 艾滋病日",
  "1213 南京大屠杀纪念日",
  "1224 平安夜",
  "1225 圣诞节");

  //某月的第几个星期几。 5,6,7,8 表示到数第 1,2,3,4 个星期几
  var wFtv = new Array(
  //一月的最后一个星期日（月倒数第一个星期日）
  "0520 母亲节",
  "0630 父亲节",
  "1144 感恩节");

  //农历节日
  var lFtv = new Array(
  "0101*春节",
  "0115 元宵节",
  "0202 龙抬头",
  "0505 端午节",
  "0707 七夕",
  "0715 中元节",
  "0815 中秋节",
  "0909 重阳节",
  "1208 腊八节",
  "1223 小年",
  "0100*除夕");

  //====================================== 返回农历 y年的总天数
  function lYearDays(y) {
    var i, sum = 348
    for(i=0x8000; i>0x8; i>>=1) sum += (lunarInfo[y-1900] & i)? 1: 0
    return(sum+leapDays(y))
  }

  //====================================== 返回农历 y年的闰月的天数
  function leapDays(y) {
    if(leapMonth(y)) return((lunarInfo[y-1900] & 0x10000)? 30: 29)
    else return(0)
  }

  //====================================== 返回农历 y年闰哪个月 1-12，没闰返回 0
  function leapMonth(y) {
    return(lunarInfo[y-1900] & 0xf)
  }

  //====================================== 返回农历 y年m月的总天数
  function monthDays(y,m) {
    return( (lunarInfo[y-1900] & (0x10000>>m))? 30: 29 )
  }

  //====================================== 算出农历，传入日期对象，返回农历日期日期对象
  // 该对象属性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl
  function Lunar(date) {
    var objDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var i, leap=0, temp=0
    var baseDate = new Date(1900,0,31)
    // Mac和linux平台的firefox在此处会产生浮点数错误
    var offset = Math.round((objDate - baseDate)/86400000)

    this.dayCyl = offset + 40
    this.monCyl = 14

    for(i=1900; i<2050 && offset>0; i++) {
      temp = lYearDays(i)
      offset -= temp
      this.monCyl += 12
    }

    if(offset<0) {
      offset += temp;
      i--;
      this.monCyl -= 12
    }

    this.year = i
    this.yearCyl = i-1864

    leap = leapMonth(i) //闰哪个月
    this.isLeap = false

    for(i=1; i<13 && offset>0; i++) {
    //闰月
      if(leap>0 && i==(leap+1) && this.isLeap==false)
      { --i; this.isLeap = true; temp = leapDays(this.year); }
      else
      { temp = monthDays(this.year, i); }

      //解除闰月
      if(this.isLeap==true && i==(leap+1)) this.isLeap = false

      offset -= temp
      if(this.isLeap == false) this.monCyl ++
    }

    if(offset==0 && leap>0 && i==leap+1)
    if(this.isLeap)
    { this.isLeap = false; }
    else
    { this.isLeap = true; --i; --this.monCyl;}

    if(offset<0){ offset += temp; --i; --this.monCyl; }

    this.month = i
    this.day = offset + 1
  }

  ///////////////////////////////////////////////////////////
  //
  // lunar 2 solar
  //
  ///////////////////////////////////////////////////////////
  // year .month .day .isLeap .yearCyl .dayCyl .monCyl
  function Solar(date, isLeapMonth) {
    var lyear = date.getFullYear(),
      lmonth = date.getMonth() + 1,
      lday = date.getDate(),
      offset = 0,
      leap = isLeap(lyear);

    // increment year
    for(var i = 1900; i < lyear; i++) {
      offset += lYearDays(i);
    }

    // increment month
    // add days in all months up to the current month
    for (var i = 1; i < lmonth; i++) {
      // add extra days for leap month
      if (i == leapMonth(lyear)) {
        offset += leapDays(lyear);
      }
      offset += monthDays(lyear, i);
    }
    // if current month is leap month, add days in normal month
    if (leap && isLeapMonth) {
      offset += monthDays(lyear, i);
    }

    // increment
    offset += parseInt(lday) - 1;

    var baseDate = new Date(1900,0,31);
    var solarDate = new Date(baseDate.valueOf() + offset * 86400000);

    this.year = solarDate.getFullYear();
    this.month = solarDate.getMonth();
    this.day = solarDate.getDate();
    this.isLeap = leap;
  }

  function isLeap(year) {
      return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
  }

  function getAnimalYear(year) {
    return Animals[((year - 1900)%12)];
  }


  //============================== 传入 offset 返回干支, 0=甲子
  function cyclical(num) {
    return(Gan[num%10]+Zhi[num%12]);
  }
  //======================================= 返回该年的复活节(春分后第一次满月周后的第一主日)
  function easter(y) {

    var term2=sTerm(y,5); //取得春分日期
    var dayTerm2 = new Date(Date.UTC(y,2,term2,0,0,0,0)); //取得春分的公历日期控件(春分一定出现在3月)
    var lDayTerm2 = new Lunar(dayTerm2); //取得取得春分农历

    if(lDayTerm2.day<15) //取得下个月圆的相差天数
       var lMlen= 15-lDayTerm2.day;
    else
       var lMlen= (lDayTerm2.isLeap? leapDays(y): monthDays(y,lDayTerm2.month)) - lDayTerm2.day + 15;

    //一天等于 1000*60*60*24 = 86400000 毫秒
    var l15 = new Date(dayTerm2.getTime() + 86400000*lMlen ); //求出第一次月圆为公历几日
    var dayEaster = new Date(l15.getTime() + 86400000*( 7-l15.getUTCDay() ) ); //求出下个周日

    this.m = dayEaster.getUTCMonth();
    this.d = dayEaster.getUTCDate();

  }

  //====================== 中文日期
  function getCDay(d){
    var s;

    switch (d) {
       case 10:
          s = '初十'; break;
       case 20:
          s = '二十'; break;
          break;
       case 30:
          s = '三十'; break;
          break;
       default :
          s = nStr2[Math.floor(d/10)];
          s += nStr1[d%10];
    }
    return(s);
  }

  ////////////////////////////////////////////////////////////////
  //
  // 24 节气
  //
  ///////////////////////////////////////////////////////////////
  var solarTerm = new Array("小寒","大寒","立春","雨水","惊蛰","春分","清明",
  "谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分",
  "寒露","霜降","立冬","小雪","大雪","冬至");

  var solarTermBase = new Array(4,19,3,18,4,19,4,19,4,20,4,20,6,22,6,22,6,22,7,22,6,21,6,21);
  var solarTermIdx = '0123415341536789:;<9:=<>:=1>?012@015@015@015AB78CDE8CD=1FD01GH01GH01IH01IJ0KLMN;LMBEOPDQRST0RUH0RVH0RWH0RWM0XYMNZ[MB\\]PT^_ST`_WH`_WH`_WM`_WM`aYMbc[Mde]Sfe]gfh_gih_Wih_WjhaWjka[jkl[jmn]ope]qph_qrh_sth_W';
  var solarTermOS = '211122112122112121222211221122122222212222222221222122222232222222222222222233223232223232222222322222112122112121222211222122222222222222222222322222112122112121222111211122122222212221222221221122122222222222222222222223222232222232222222222222112122112121122111211122122122212221222221221122122222222222222221211122112122212221222211222122222232222232222222222222112122112121111111222222112121112121111111222222111121112121111111211122112122112121122111222212111121111121111111111122112122112121122111211122112122212221222221222211111121111121111111222111111121111111111111111122112121112121111111222111111111111111111111111122111121112121111111221122122222212221222221222111011111111111111111111122111121111121111111211122112122112121122211221111011111101111111111111112111121111121111111211122112122112221222211221111011111101111111110111111111121111111111111111122112121112121122111111011111121111111111111111011111111112111111111111011111111111111111111221111011111101110111110111011011111111111111111221111011011101110111110111011011111101111111111211111001011101110111110110011011111101111111111211111001011001010111110110011011111101111111110211111001011001010111100110011011011101110111110211111001011001010011100110011001011101110111110211111001010001010011000100011001011001010111110111111001010001010011000111111111111111111111111100011001011001010111100111111001010001010000000111111000010000010000000100011001011001010011100110011001011001110111110100011001010001010011000110011001011001010111110111100000010000000000000000011001010001010011000111100000000000000000000000011001010001010000000111000000000000000000000000011001010000010000000';

  // 形式如function sTerm(year, n)，用来计算某年的第n个节气（从0小寒算起）为几号，这也基本被认可为节气计算的基本形式。由于没个月份有两个节气，计算时需要调用两次（n和n+1）
  //===== 某年的第n个节气为几日（从0小寒起算）
  function sTerm(y,n) {
    return(solarTermBase[n] +  Math.floor( solarTermOS.charAt( ( Math.floor(solarTermIdx.charCodeAt(y-1900)) - 48) * 24 + n  ) ) );
  }
  /////////////////////////////////////////////////////////////////
  //
  //  calElement model
  //
  /////////////////////////////////////////////////////////////////

  //============================== 阴历属性
  function calElement(sYear,sMonth,sDay,week,lYear,lMonth,lDay,isLeap,cYear,cMonth,cDay) {
    //瓣句
    this.sYear      = sYear;   //公元年4位数字
    this.sMonth     = sMonth;  //公元月数字
    this.sDay       = sDay;    //公元日数字
    this.week       = week;    //星期, 1个中文
    //农历
    this.lYear      = lYear;   //公元年4位数字
    this.lMonth     = lMonth;  //农历月数字
    this.lDay       = lDay;    //农历日数字
    this.isLeap     = isLeap;  //是否为农历闰月?
    //八字
    this.cYear      = cYear;   //年柱, 2个中文
    this.cMonth     = cMonth;  //月柱, 2个中文
    this.cDay       = cDay;    //日柱, 2个中文

    this.lunarDay      = getCDay(lDay);
    this.lunarMonth    = cmonthName[lMonth - 1];
    this.lunarYear     = getAnimalYear(lYear);

    // this.color      = '';

    this.lunarFestival = ''; //农历节日
    this.solarFestival = ''; //公历节日
    this.solarTerms    = ''; //节气
  }
  ///////////////////////////////////////////////////////////////
  //
  //  main
  //
  ///////////////////////////////////////////////////////////////
  // date's month should be --, example: 2012-5-21 -> new Date(2012, 4, 21)
  // no matter solar or lunar
  function CalendarConverter() {
    this.solar2lunar = function(date) {
      var sYear = date.getFullYear(),
        sMonth = date.getMonth(),
        sDay = date.getDate(),
        weekDay = nStr1[date.getDay()],
        lunar = new Lunar(date),
        lunarYear = lunar.year,
        lunarMonth = lunar.month,
        lunarDay = lunar.day,
        isLeap = lunar.isLeap;

      return addFstv(sYear, sMonth, sDay, weekDay, lunarYear, lunarMonth, lunarDay, isLeap);
    }

    this.lunar2solar = function(date, isLeapMonth) {
      var lunarYear = date.getFullYear(),
        lunarMonth = date.getMonth() + 1,
        lunarDay = date.getDate(),
        solar = new Solar(date, isLeapMonth),
        sYear = solar.year,
        sMonth = solar.month,
        sDay = solar.day,
        weekDay = nStr1[new Date(sYear, sMonth, sDay).getDay()],
        isLeap = solar.isLeap,
        cYear, cMonth, cDay, that = {};

      return addFstv(sYear, sMonth, sDay, weekDay, lunarYear, lunarMonth, lunarDay, isLeap);
    }

  }
  function addFstv(sYear, sMonth, sDay, weekDay, lunarYear, lunarMonth, lunarDay, isLeap) {
    var cYear, cMonth, cDay, that = {};
    ////////年柱 1900年立春后为庚子年(60进制36)
    if(sMonth < 2 ) {
      cYear=cyclical(sYear-1900+36-1);
    } else {
      cYear=cyclical(sYear-1900+36);
    }
    var term2=sTerm(sYear,2); //立春日期

    ////////月柱 1900年1月小寒以前为 丙子月(60进制12)
    var firstNode = sTerm(sYear, sMonth*2) //返回当月「节」为几日开始
    cMonth = cyclical((sYear - 1900) * 12 + sMonth + 12);

    //依节气调整二月分的年柱, 以立春为界
    if(sMonth == 1 && sDay >= term2) cYear = cyclical(sYear - 1900+36);
    //依节气月柱, 以「节」为界
    if(sDay >= firstNode) cMonth = cyclical((sYear - 1900) * 12 + sMonth + 13);
    //当月一日与 1900/1/1 相差天数
    //1900/1/1与 1970/1/1 相差25567日, 1900/1/1 日柱为甲戌日(60进制10)
    var dayCyclical = Date.UTC(sYear, sMonth, 1, 0, 0, 0, 0)/86400000 + 25567 + 10;
    //日柱
    cDay = cyclical(dayCyclical + sDay - 1);

    //sYear,sMonth,sDay,weekDay,
    //lYear,lMonth,lDay,isLeap,
    //cYear,cMonth,cDay
    that = new calElement(sYear, sMonth + 1, sDay, weekDay, lunarYear, lunarMonth, lunarDay, isLeap, cYear, cMonth, cDay);

    // 节气
    var tmp1=sTerm(sYear, sMonth * 2) - 1;
    var tmp2=sTerm(sYear, sMonth * 2 + 1) - 1;
    if (tmp1 == (sDay - 1)) {
      that.solarTerms = solarTerm[sMonth * 2];
    }
    if (tmp2 == (sDay - 1)) {
      that.solarTerms = solarTerm[sMonth * 2 + 1];
    }

    //公历节日
    for (var i = 0, item; item = sFtv[i]; i++) {
      if(item.match(/^(\d{2})(\d{2})([\s\*])(.+)$/)) {
        if(Number(RegExp.$1)==(sMonth+1)) {
            if (Number(RegExp.$2) == sDay) {
                that.solarFestival += RegExp.$4 + ' ';
            }
        }
      }
    }

    //月周节日
    for (i = 0, item; item = wFtv[i]; i++) {
      if (item.match(/^(\d{2})(\d)(\d)([\s\*])(.+)$/)) {
        if (Number(RegExp.$1) == (sMonth + 1)) {
          tmp1 = Number(RegExp.$2);
          tmp2 = Number(RegExp.$3);
          if (tmp1 < 5) {
            var wFtvDate = (tmp2 == 0 ? 7 : 0) + (tmp1 - 1)*7 + tmp2;
            if (wFtvDate == sDay) {
              that.solarFestival += RegExp.$5 + ' ';
              break;
            }
          }
        }
      }
    }

    // 农历节日
    for (i = 0, item; item = lFtv[i]; i++) {
      if (item.match(/^(\d{2})(.{2})([\s\*])(.+)$/)) {
        tmp1 = Number(RegExp.$1);
        tmp2 = Number(RegExp.$2);
        var lMonLen = monthDays(lunarYear, lunarMonth);
        // 月份是12月，且为最后一天，则设置为春节
        if ((tmp1 == lunarMonth && tmp2 == lunarDay) || (tmp2 == '00' && lunarMonth == 12 && lMonLen == lunarDay)) {
          that.lunarFestival += RegExp.$4 + ' ';
          break;
        }
      }
    }

    return that;
  }

  /*
   * example:
   * var cc  =new CalendarConverter;
   *
   * cc.lunar2solar(new Date(2011, 0, 3)); ---> 2010,11,29
   * cc.solar2lunar(new Date(2010, 10, 29)); ----> 2011, 1, 3
   *
   * 农历转公历时，如果那一月是那一年的闰月，则需额外传一个参数，才能得到正确的公历日期
   * cc.solar2lunar(new Date(2012, 4, 27)); ---> 2012年4月初7, 其中 isLeap为true，表示为闰四月
   * cc.lunar2solar(new Date(2012, 3, 7)) ---> 得到错误时间：2012, 4, 27
   * cc.lunar2solar(new Date(2012, 3, 7), true) --> 正确: 2012, 5, 27
   *
   *result:
   *  {
   *    cDay: "戊戌"
        , cMonth: "丁未"
        , cYear: "壬辰"
        , isLeap: false             // 该月是否为闰月
        , lDay: 18
        , lMonth: 6
        , lYear: 2012
        , lunarDay: "十八"
        , lunarFestival: ""
        , lunarMonth: "六"
        , lunarYear: "龙"
        , sDay: 5
        , sMonth: 8
        , sYear: 2012
        , solarFestival: ""         // 节日
        , solarTerms: ""            // 节气
        , week: "日"                // 周几
      }
   *
   */
  window.CalendarConverter = CalendarConverter;
  if ('undefined' !== typeof module && module.exports) {
    module.exports = CalendarConverter;
  }


//**********JUI start********************
  window.$J = {
      ready: (function() {
        var b = [];
        var d = false;
  
        function c(g) {
          if (d) {
            return
          }
          if (g.type === "onreadystatechange" && document.readyState !== "complete") {
            return
          }
          for (var f = 0; f < b.length; f++) {
            b[f].call(document)
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
        return function a(e) {
          if (d) {
            e.call(document)
          } else {
            b.push(e)
          }
        }
      })(),
      onload: function(a) {
        if (document.addEventListener) {
          document.addEventListener("DOMContentLoaded", function() {
            document.removeEventListener("DOMContentLoaded", arguments, false);
            a()
          }, false)
        } else {
          if (document.attachEvent) {
            document.attachEvent("onreadystatechange", function() {
              if (document.readyState == "complete") {
                document.detachEvent("onreadystatechange", arguments);
                a()
              }
            })
          }
        }
      },
      height: function() {
        return document.documentElement.clientHeight
        //return document.body.offsetHeight
      },
      width: function() {
        return document.documentElement.clientWidth
        //return document.body.offsetWidth
      },
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
      copy: _copy,
      clone:_clone,
      each:_each,
      even:_even,
      toString:_toString,
      type:_type,
      ct: _create,
      scroll:_scroll,
      scrollTo:_scrollTo,
      ajax:_ajax,
      load:_load,
      jsonp:_jsonp,
      cookie:_cookie,
      storage:_storage,
      initTip:function(){
        $J.attr("jet-tip").each(function(item){
          item.tip(item.attr("jet-tip"));
        });
      },
      html5:function(){
        if (window.applicationCache) {
          return true;
        }
        return false;
      },
      language: "CHINESE",
      lang: function(l) {this.language = l.toUpperCase()},
      checkArg: _checkArg,
      toFunc:_checkFunction,
      jump: _jump,
      open: function(a) {window.open(a)},
      back: function() {window.history.back()},
      forward: function() {window.history.forward()},
      reload:function(force){
        location.reload(force);
      },
      urlParam: _getUrlParam,
      sign: _sign,
      random: _getRandomNum,
      isMobile: _isMobile,
      
      delay:function(call,time){
        return setTimeout(call,time);
      },
      clearDelay:function(t){
        return setTimeout(t);
      },
      repeat:function(call,time){
        return setInterval(call,time);
      },
      clearRepeat:function(t){
        return clearInterval(t);
      }
      
    };
    Jet.prototype.$=$J;
    Jet.$=$J;
    function _scrollTo(y, a, b) {
      document.body.scrollTo(y, null, b);
      document.documentElement.scrollTo(y, null, b);
      if (a != undefined) {
        b = _checkArg(b, 400);
        if ($J.type(b)=="number") {
          b = _checkAnimateSpeed(b)
        }
        setTimeout(_checkFunction(a), b);
      }
    };
    function _scroll(a, b, c) {
      if (arguments.length != 0) {
        if (a != 0) {
          document.body.scroll(a, null, c);
          document.documentElement.scroll(a, null, c);
          if (b != undefined) {
            c = _checkArg(c, 400);
            if ($J.type(c)=="number") {
              c = _checkAnimateSpeed(c)
            }
            setTimeout(_checkFunction(b), c);
          }
        }
      } else {
        if (document.body.scrollTop == 0) {
          return document.documentElement.scrollTop
        } else {
          return document.body.scrollTop
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
        error: a.error ||function() {},
        header:a.header||{}
      };
      b.beforeSend();
      var c;
      if (window.XMLHttpRequest) {
        c =new XMLHttpRequest()
      } else if (window.ActiveXObject) {
        c = ActiveXObject("Microsoft.XMLHTTP")
      }
      var _d=_convertData(b.data);
      var _t=b.type.toLowerCase();
      //||_t=='delete'
      if((_t=='get')&&_d!==''){
        b.url=b.url+'?'+_d;
      }
      c.open(b.type, b.url, b.async);
      c.responseType = b.dataType;
      if(a.contentType!==null){
        c.setRequestHeader("Content-Type", b.contentType);
      }
      for(var k in b.header){
        c.setRequestHeader(k, b.header[k]);
      }
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
      return $J.ajax({ 
        url : name, 
        async:true,
        success : function(result){ 
          call(result);
        },
        error : function(err){ 
          if(ecall!=undefined)
            ecall(err);
          console.warn("加载失败:"+name);
        },
      })
    };
    function _jsonp(options) {
      if (!options.url) {
        throw new Error("Parameter error");
      }else{
        var callbackName = ('_jsonp' + Math.random()).replace(".", "").substring(0, 15);
        var head = $J.tag("head");
        options.data[_checkArg(options.callback, "callback")] = callbackName;
        var script = $J.ct('script');
        head.append(script);
        window[callbackName] = function(a) {
          head.removeChild(script);
          clearTimeout(script.timer);
          window[callbackName] = null;
          if($J.type(a)=="string"){
            a=JSON.parse(a);
          }
          options.success && options.success(a);
        };
        if (options.dataType != undefined && options.dataType.toUpperCase() == "JSON") {
          script.attr("src", options.url + '?json=' + encodeURIComponent(JSON.stringify(options.data)))
        } else {
          script.attr("src", options.url + '?' + _formatParams(options.data))
        }
        options.time = _checkArg(options.time, 5000);
        script.timer = setTimeout(function() {
          window[callbackName] = null;
          head.removeChild(script);
          options.timeout && options.timeout({
            message:( (!options.message)?"timeout":options.message)
          })
        }, options.time)
      }
    };
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
          $J.cookie(a, "", -1)
        } else {
          var c = a + "=" + escape(b);
          if (d != undefined) {
            var h = new Date();
            h.setDate(h.getDate() + d);
            c += ";expires=" + h.toGMTString()
          }
          if (e != undefined) {
            if ($J.type(e)=="boolean") {
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
    function _create(a) {
      if (a.has("#") || a.has(".") || a.has("[")) {
        var b = a.split('#');
        if(b.length>1){
          b=[b[0],a.substring(b[0].length+1)];
        }
        var c;
        if (a.has("[")) {
          var l = b[b.length - 1];
          c = l.substring(0, l.indexOf("[")).split('.');
          c[c.length - 1] += l.substring(l.indexOf("["))
        } else {
          c = b[b.length - 1].split('.')
        }
        var d = c.length - 1;
        var f = c[d].split('[');
        for (var i = 0; i < f.length; i++) {
          c[d + i] = f[i]
        }
        var anum = f.length - 1;
        var cnum = c.length - anum - 1;
        var e;
        if (b.length == 1) {
          e = document.createElement(c[0])
        } else {
          e = document.createElement(b[0]);
          e.attr("id", c[0])
        }
        for (var i = 1; i < c.length; i++) {
          if (cnum > 0) {
            cnum--;
            e.addClass(c[i])
          } else {
            var g = c[i].substring(0, c[i].length - 1);
            var index=g.indexOf("=");
            e.attr(g.substring(0,index), g.substring(index+1));
          }
        }
        return e
      } else {
        return document.createElement(a)
      }
    };
    function _convertData(a) {
      if(a==undefined){
        return "";
      }
      var t=$J.type(a);
      if (t=="json") {
        var b = "";
        for (var c in a) {
          if(typeof a[c]==='object'){
            b += (c + "=" + encodeURIComponent(JSON.stringify(a[c])) + "&")
          }else{
            b += (c + "=" + encodeURIComponent(a[c]) + "&")
          }
        }
        b = b.substring(0, b.length - 1);
        return b
      }else if(t=='array'){
        return JSON.stringify(a);
      }else if($J.type(a)=="formdata"){
        // if(a.entries!=undefined){
        //   var b = "";
        //   for (var i of a.entries()) {
        //     b += i[0] + "=" + i[1] + "&"
        //   }
        //   b = b.substring(0, b.length - 1);
        //   return b
        // }
        return a;
      }else{
        return a;
      }
    }
    function _checkFunction(a){
      if(a==undefined){
        return function(){};
      }else{
        var b=$J.type(a);
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
    $J.ready(function() {
      $J.tag("head").append($J.ct("style").txt("#jCopyInput{height:0px;position:fixed;top:-100px;}.j-for-slide-height{opacity:0!important;position:absolute!important;display:block!important}.j-none{visibility:hidden!important;position:absolute!important;display:block!important}.j-animation{transition:all .5s linear!important;-moz-transition:all .5s linear!important;-webkit-transition:all .5s linear!important;-o-transition:all .5s linear!important}.j-slide{overflow:hidden!important;height:0!important;padding-top:0!important;padding-bottom:0!important}.j-fade{opacity:0!important}.j-display-none{display:none!important}@keyframes j-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}@-moz-keyframes j-spin{from{-moz-transform:rotate(0)}to{-moz-transform:rotate(360deg)}}@-webkit-keyframes j-spin{from{-webkit-transform:rotate(0)}to{-webkit-transform:rotate(360deg)}}@-o-keyframes j-spin{from{-o-transform:rotate(0)}to{-o-transform:rotate(360deg)}}@keyframes j-twinkle{0%{opacity:1}50%{opacity:.1}100%{opacity:1}}@-moz-keyframes j-twinkle{0%{opacity:1}50%{opacity:.1}100%{opacity:1}}@-webkit-keyframes j-twinkle{0%{opacity:1}50%{opacity:.1}100%{opacity:1}}@-o-keyframes j-twinkle{0%{opacity:1}50%{opacity:.1}100%{opacity:1}}.j-over-hidden{overflow:hidden!important}#jetTip{box-shadow:2px 2px 5px 0 #666;top:-100px;position:absolute;border:1px solid#222;background-color:rgba(255,255,255,.8);color:#222;font-size:10px;padding:3px;transition:opacity .2s;-moz-transition:opacity .2s linear;-webkit-transition:opacity .2s linear;-o-transition:opacity .2s linear;opacity:0;z-index:10000}#jetTip.j_active{opacity:1}"));
      $J.initTip();
    });
    window.$S=function(s) {
      if (s == undefined) {
        return $J.body()
      } else {
        return $J.select(s)
      }
    };
  
    function _checkSelect(b) {
      if(b==null||b==undefined){
        return $J.ct("div").findClass("a");
      }else if (b.length == 1) {
        return b[0]
      }
      return b
    };
    HTMLElement.prototype.css = function(d, a) {
      if (a == undefined) {
        if ($J.type(d)=="json") {
          for (var b in d) {
            if (d[b].has("!important")) {
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
        if (a.has("!important")) {
          this.style.setProperty(d, _checkCssValue(this, d, a.substring(0, a.indexOf("!important"))), "important")
        } else {
          this.style.setProperty(d, _checkCssValue(this, d, a))
        }
        return this
      }
    };
    HTMLCollection.prototype.css = NodeList.prototype.css = function(d, c) {
      if (c == undefined && $J.type(d)!="json") {
        var a = [];
        this.each(function(b) {
          a.append(b.css(d))
        });
        return a
      } else {
        this.each(function(a) {
          a.css(d, c)
        });
        return this
      }
    };
    HTMLElement.prototype.hasData = function(d, b) {
      return (d in this.j_data)
    }
    HTMLElement.prototype.data = function(d, b) {
      if (arguments.length == 0) {
        if (this.j_data!=undefined) {
          return this.j_data
        } else {
          return null
        }
      } else if (arguments.length == 1) {
        if (d == undefined) {
          this.j_data=undefined;
          return this
        } else {
          if ($J.type(d)=="json") {
            if (this.j_data!=undefined) {
              for (var e in d) {
                if (d[e] != undefined) {
                  this.j_data[e] = d[e]
                } else {
                  delete this.j_data[e]
                }
              }
            } else {
              this.j_data=d
            }
            return this
          } else {
            if (this.j_data!=undefined) {
              return this.j_data[d]
            } else {
              return undefined
            }
          }
        }
      } else {
        if (b == undefined) {
          if (this.j_data!=undefined) {
            if ($J.type(d)=="array") {
              d.each(function(a) {
                delete this.j_data[a]
              })
            } else {
              delete this.j_data[d]
            }
          }
          return this
        } else {
          if (this.j_data!=undefined) {
            this.j_data[d] = b;
          } else {
            var c = {};
            c[d] = b;
            this.j_data=c
          }
          return this
        }
      }
    };
    HTMLCollection.prototype.data = NodeList.prototype.data = function(d, c) {
      if (c == undefined && $J.type(d)!="json" && d != undefined) {
        var a = [];
        this.each(function(b) {
          a.append(b.data($J.clone(d)))
        });
        return a
      } else {
        if (c == undefined) {
          this.each(function(a) {
            a.data($J.clone(d))
          })
        } else {
          this.each(function(a) {
            a.data($J.clone(d), c)
          })
        };
        return this
      }
    };
  
    function _checkCssValue(a, c, d) {
      if (d.has("-=")||d.has("+=")) {
        var e = _getCssNumberValue(d.substring(d.indexOf("=") + 1));
        if (d.has("-=")) {
          e[0] = -e[0]
        }
        var b;
        if (d.has("%")) {
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
        if (a.has("px")) {
          b = "px"
        } else if (a.has("%")) {
          b = "%"
        } else if (a.has("em")) {
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
    HTMLElement.prototype.attr = function(c, b) {
      if (b == undefined) {
        if ($J.type(c)=="json") {
          for (var a in c) {
            this.setAttribute(a, c[a])
          }
          return this
        } else {
          return this.getAttribute(c)
        }
      } else {
        this.setAttribute(c, b);
        return this
      }
    };
    HTMLCollection.prototype.attr = NodeList.prototype.attr = function(d, c) {
      if (c == undefined && $J.type(d)!="json") {
        var a = [];
        this.each(function(b) {
          a.append(b.attr(d))
        });
        return a
      } else {
        this.each(function(a) {
          a.attr(d, c)
        });
        return this
      }
    };
    HTMLElement.prototype.hasAttr = function(a) {
      return this.hasAttribute(a)
    };
    HTMLElement.prototype.removeAttr = function(b) {
      var c = b.split(" ");
      if (c.length > 1) {
        var d = this;
        c.each(function(a) {
          d.removeAttribute(a)
        })
      } else {
        this.removeAttribute(b)
      }
      return this
    };
    HTMLCollection.prototype.removeAttr = NodeList.prototype.removeAttr = function(b) {
      this.each(function(a) {
        a.removeAttr(b)
      });
      return this
    };
    HTMLElement.prototype.findClass = function(a) {
      return _checkSelect(this.getElementsByClassName(a))
    };
    HTMLCollection.prototype.findClass = NodeList.prototype.findClass =  Array.prototype.findClass = function(a) {
      var arr=[];
      this.each(function(item){
        if(item.hasClass(a)){
          arr.push(item)
        }
      });
      if(arr.length==1)
        return arr[0];
      return arr
    };
    HTMLElement.prototype.findId = function(a) {
      return $J.id(a)
    };
    HTMLCollection.prototype.findId = NodeList.prototype.findId =  Array.prototype.findId = function(a) {
      var arr=[];
      this.each(function(item){
        if(item.attr("id")==a){
          arr.push(item)
        }
      });
      if(arr.length==1)
        return arr[0];
      return arr
    };
    HTMLElement.prototype.findTag = function(a) {
      return _checkSelect(this.getElementsByTagName(a))
    };
    HTMLCollection.prototype.findTag = NodeList.prototype.findTag =  Array.prototype.findTag = function(a) {
      var arr=[];
      this.each(function(item){
        if(item.tagName.toLowerCase()==a){
          arr.push(item)
        }
      });
      if(arr.length==1)
        return arr[0];
      return arr
    };
    HTMLElement.prototype.findAttr = function(a) {
      return _checkSelect(this.querySelectorAll("[" + a + "]"))
    };
    HTMLCollection.prototype.findAttr = NodeList.prototype.findAttr =  Array.prototype.findAttr = function(a) {
      var arr=[];
      var a=a.split("=");
      if(a.length==1){
        this.each(function(item){
          if(item.hasAttr(a[0])){
            arr.push(item);
          }
        });
      }else{
        this.each(function(item){
          if(item.attr(a[0])==a[1]){
            arr.push(item)
          }
        });
      }
      if(arr.length==1)
        return arr[0];
      return arr
    };
    HTMLElement.prototype.findName = function(a) {
      return _checkSelect(this.querySelectorAll("[name=" + a + "]"))
    };
    HTMLCollection.prototype.findName = NodeList.prototype.findName =  Array.prototype.findName = function(a) {
      var arr=[];
      this.each(function(item){
        if(item.attr("name")==a){
          arr.push(item)
        }
      });
      if(arr.length==1)
        return arr[0];
      return arr
    };
    HTMLElement.prototype.select = function(a) {
      return _checkSelect(this.querySelectorAll(a))
    };
    HTMLCollection.prototype.select = NodeList.prototype.select =  Array.prototype.select = function(a) {
      var arr=[];
      this.each(function(item){
        var list = item.parent().select(a);
        for(var i=0;i<list.length;i++){
          if(list[i]==item){
            arr.push(item)
            break;
          }
        }
      });
      if(arr.length==1)
        return arr[0];
      return arr
    };
    HTMLElement.prototype.addClass = function(a) {
      if(a.has(" ")){
        var b = a.split(" ");
        var c = this;
        b.each(function(i) {
          c.addClass(i)
        });
      }else if(a.trim()!==""){
        if($J.html5()){
          this.classList.add(a)
        }else{
          if (!this.hasClass(a)) {
            this.className += " " + a
          }
        }
      }
      return this
    };
    HTMLCollection.prototype.addClass = NodeList.prototype.addClass = function(a) {
      this.each(function(b) {
        b.addClass(a)
      });
      return this
    };
    HTMLElement.prototype.replaceClass = function(a, b) {
      if (this.hasClass(a)) {
        this.addClass(b).removeClass(a)
      }
      return this
    };
    HTMLCollection.prototype.replaceClass = NodeList.prototype.replaceClass = function(a, b) {
      this.each(function(c) {
        c.replaceClass(a, b)
      });
      return this
    };
    HTMLElement.prototype.removeClass = function(a) {
      if (a == undefined) {
        this.className = ""
      } else {
        if(a.has(" ")){
          var c = a.split(" ");
          var d = this;
          c.each(function(i) {
            d.removeClass(i)
          })
        }else if(a.trim()!==""){
          if($J.html5()){
            this.classList.remove(a)
          }else{
            if (this.hasClass(a)) {
              var b = new RegExp("(\\s|^)" + a + "(\\s|$)");
              this.className = this.className.replace(b, " ").trim()
            }
          }
        }
      }
      return this
    };
    HTMLCollection.prototype.removeClass = NodeList.prototype.removeClass = function(a) {
      this.each(function(b) {
        b.removeClass(a)
      });
      return this
    };
    HTMLElement.prototype.toggleClass = function(a) {
      if(a.has(" ")){
        var b = a.split(" ");
        var c = this;
        b.each(function(i) {
          c.toggleClass(i)
        });
      }else if(a.trim()!==""){
        if($J.html5()){
          this.classList.toggle(a)
        }else{
          if (c.hasClass(a)) {
            c.removeClass(a)
          } else {
            c.addClass(a)
          }
        }
      }
      return this
    };
    HTMLCollection.prototype.toggleClass = NodeList.prototype.toggleClass = function(v) {
      this.each(function(b) {
        b.toggleClass(v)
      });
      return this
    };
    HTMLCollection.prototype.indexOf = NodeList.prototype.indexOf = function(ele) {
      for(var i=0;i<this.length;i++){
        if(this[i]==ele){
          return i;
        }
      }
      return -1;
    };
    HTMLElement.prototype.val = function(a) {
      if (a == undefined && arguments.length == 0) {
        return this.value
      } else {
        if (this.tagName == "INPUT" || this.tagName == "TEXTAREA"||this.tagName == "SELECT") {
          this.value = _checkArg(a, "")
        }
        return this
      }
    };
    HTMLCollection.prototype.val = NodeList.prototype.val = function(v) {
      if (v == undefined) {
        var a = [];
        this.each(function(b) {
          a.append(b.val())
        });
        return a
      } else {
        this.each(function(b) {
          b.val(v)
        });
        return this
      }
    };
    HTMLElement.prototype.txt = function(a) {
      if (a == undefined && arguments.length == 0) {
        return this.innerText
      } else {
        this.innerText = _checkArg(a, "");
        return this
      }
    };
    HTMLCollection.prototype.txt = NodeList.prototype.txt = function(v) {
      if (v == undefined && arguments.length == 0) {
        var a = [];
        this.each(function(b) {
          a.append(b.txt())
        });
        return a
      } else {
        this.each(function(b) {
          b.txt(v)
        });
        return this
      }
    };
    HTMLElement.prototype.content = function(a) {
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
    HTMLCollection.prototype.content = NodeList.prototype.content = function(v) {
      if (v == undefined) {
        var a = [];
        this.each(function(b) {
          a.append(b.content())
        });
        return a
      } else {
        this.each(function(b) {
          b.content(v)
        });
        return this
      }
    };
    HTMLElement.prototype.copy = function() {
      return _copy(this.content())
    };
  
    function _copy(b) {
      var a = $J.id("jCopyInput");
      if (!a.exist()) {
        a = $J.ct("input").attr({
          "type": "text",
          "id": "jCopyInput"
        });
        $J.body().append(a)
      }
      a.val(b).select();
      if (document.execCommand("Copy")) {
        return true
      } else {
        alert("Copy is not supported in your browser");
        return false
      }
    };
    HTMLElement.prototype.copyHtml = function() {
      return _copy(this.html())
    };
    HTMLElement.prototype.html = function(a) {
      if (a == undefined) {
        return this.innerHTML
      } else {
        this.innerHTML = a;
        return this
      }
    };
    HTMLCollection.prototype.html = NodeList.prototype.html = function(v) {
      if (v == undefined) {
        var a = [];
        this.each(function(b) {
          a.append(b.html())
        });
        return a
      } else {
        this.each(function(b) {
          b.html(v)
        });
        return this
      }
    };
    HTMLElement.prototype.allHtml = function(a) {
      if (a == undefined) {
        return $J.ct("div").append(this.clone()).html();
      } else {
        var index=this.index();
        var par=this.parent().append(a,index);
        this.remove();
        return par.child(index);
      }
    };
    HTMLCollection.prototype.allHtml = NodeList.prototype.allHtml = function(v) {
      var a = [];
      this.each(function(b) {
        a.append(b.allHtml(v))
      });
      return a
    };
    HTMLElement.prototype.hasClass = function(a) {
      if(a.trim()===""){
        return true;
      }
      if($J.html5()){
        return this.classList.contains(a);
      }
      return new RegExp("(\\s|^)" + a + "(\\s|$)").test(this.className)
    };
    HTMLElement.prototype.next = function(i) {
      if (i != undefined) {
        return this.parent().child(this.index() + i)
      } else {
        return this.parent().child(this.index() + 1)
      }
    };
    HTMLElement.prototype.prev = function(i) {
      if (i != undefined) {
        return this.parent().child(this.index() - i)
      } else {
        return this.parent().child(this.index() - 1)
      }
    };
    HTMLElement.prototype.offset = function() {
      return {
        left: this.offsetLeft,
        top: this.offsetTop,
        height: this.offsetHeight,
        width: this.offsetWidth
      }
    };
    HTMLElement.prototype.left = function() {
      return this.offsetLeft
    };
    HTMLElement.prototype.top = function() {
      return this.offsetTop
    };
    HTMLElement.prototype.scrollTo = function(a, b, c) {
      var n = 0;
      var e = this;
      c = _checkArg(c, 400);
      var f = _checkAnimateSpeed(c) / 10;
      var g = (a - e.scrollTop) / f;
      var d = e.scrollTop;
      var h = setInterval(function() {
        d += g;
        e.scrollTop = Math.round(d);
        n++;
        if (n == f) {
          e.scrollTop = a;
          _checkCallBack(b, e);
          clearTimeout(h)
        }
      }, 10);
      return this
    };
    HTMLCollection.prototype.scrollTo = NodeList.prototype.scrollTo = function(i, b, c) {
      this.each(function(a) {
        a.scrollTo(i, b, c)
      });
      return this
    };
    HTMLElement.prototype.scroll = function(i, a, b) {
      if (arguments.length == 0) {
        return this.scrollTop
      } else {
        return this.scrollTo(this.scrollTop + i, a, b)
      }
    };
    HTMLCollection.prototype.scroll = NodeList.prototype.scroll = function(i, b, c) {
      this.each(function(a) {
        a.scroll(i, b, c)
      });
      return this
    };
    HTMLElement.prototype.animate = function(a, b, c, d) {
      var e = JSON.stringify(a);
      if (e.has("left") || e.has("top")) {
        if (this.css("position") == "static") {
          this.css({
            "position": "relative",
            "left": "0",
            "top": "0"
          })
        } else {
          if (this.style.top == "") {
            this.style.top = this.css("top")
          }
          if (this.style.left == "") {
            this.style.left = this.css("left")
          }
        }
      }
      if (e.has("height") && this.style.height == "") {
        this.style.height = this.css("height")
      }
      if (e.has("width") && this.style.width == "") {
        this.style.width = this.css("width")
      }
      this.addClass("j-animation");
      c = _checkAnimatePara(this, c, d);
      var f = this;
      setTimeout(function() {
        f.css(a);
        setTimeout(function() {
          _checkCallBack(b, f);
          f.removeClass("j-animation")
        }, c)
      }, 50);
      return this
    };
    HTMLCollection.prototype.animate = NodeList.prototype.animate = function(b, c, d, e) {
      this.each(function(a) {
        a.animate(b, c, d, e)
      });
      return this
    };
    HTMLElement.prototype.rotate = function(a, b, c, d, e) {
      var f = this;
      f.addClass("j-animation");
      setTimeout(function() {
        c = _checkAnimatePara(f, c, e);
        _checkOrigin(f, d);
        f.css({
          "transform": "rotate(" + a + "deg)",
          "-ms-transform": "rotate(" + a + "deg)",
          "-webkit-transform": "rotate(" + a + "deg)",
          "-o-transform": "rotate(" + a + "deg)",
          "-moz-transform": "rotate(" + a + "deg)"
        });
        setTimeout(function() {
          _checkCallBack(b, f);
          _removeAnimation(f)
        }, c)
      }, 50);
      return this
    };
    HTMLElement.prototype.scale = function(a, b, c, d) {
      return _scaleBase(this, a, a, b, c, d)
    };
    HTMLElement.prototype.scaleX = function(a, b, c, d) {
      return _scaleBase(this, a, 1, b, c, d)
    };
    HTMLElement.prototype.scaleY = function(a, b, c, d) {
      return _scaleBase(this, 1, a, b, c, d)
    };
  
    function _checkCallBack(a, b) {
      if (a != undefined) {
        _checkFunction(a)(b)
      }
    };
    HTMLCollection.prototype.scale = NodeList.prototype.scale = function(b, c, d, e) {
      this.each(function(a) {
        a.scale(b, c, d, e)
      });
      return this
    };
    HTMLCollection.prototype.scaleX = NodeList.prototype.scaleX = function(b, c, d, e) {
      this.each(function(a) {
        a.scaleX(b, c, d, e)
      });
      return this
    };
    HTMLCollection.prototype.scaleY = NodeList.prototype.scaleY = function(b, c, d, e) {
      this.each(function(a) {
        a.scaleY(b, c, d, e)
      });
      return this
    };
  
    function _scaleBase(a, x, y, b, c, d) {
      a.addClass("j-animation");
      setTimeout(function() {
        c = _checkAnimatePara(a, c, d);
        a.css({
          "transform": "scale(" + x + "," + y + ")",
          "-ms-transform": "scale(" + x + "," + y + ")",
          "-webkit-transform": "scale(" + x + "," + y + ")",
          "-o-transform": "scale(" + x + "," + y + ")",
          "-moz-transform": "scale(" + x + "," + y + ")"
        });
        setTimeout(function() {
          _checkCallBack(b, a);
          _removeAnimation(a)
        }, c)
      }, 50);
      return a
    };
  
    function _checkOrigin(a, o) {
      if (o == undefined) {
        o = "center"
      }
      a.css({
        "transform-origin": o,
        "-ms-transform-origin": o,
        "webkit-transform-origin": o,
        "-o-transform-origin": o,
        "-moz-transform-origin": o
      })
    };
    HTMLCollection.prototype.rotate = NodeList.prototype.rotate = function(b, c, d, e, f) {
      this.each(function(a) {
        a.rotate(b, c, d, e, f)
      });
      return this
    };
    HTMLElement.prototype.spin = function(a, b, c, d, e) {
      e = _checkArg(e, "linear");
      b = _checkArg(b, "infinite");
      if (a != undefined) {
        a = _checkSpinSpeed(a)
      } else {
        a = 2
      }
      _checkOrigin(this, c);
      if ($J.type(b)=="number") {
        this.stopSpin();
        var f = this;
        setTimeout(function() {
          _helpSpin(a, b, c, d, e, f)
        }, 20)
      } else {
        _helpSpin(a, b, c, d, e, this)
      }
      return this
    };
    function _helpSpin(a, b, c, d, e, f) {
      f.css({
        "animation": "j-spin " + a + "s " + e + " 0s " + b,
        "-moz-animation": "j-spin " + a + "s " + e + " 0s " + b,
        "-webkit-animation": "j-spin " + a + "s " + e + " 0s " + b,
        "-o-animation": "j-spin " + a + "s " + e + " 0s " + b
      });
      if ($J.type(b)=="number") {
        if (d != undefined) {
          setTimeout(function() {
            _checkCallBack(d, f)
          }, a * b * 1000)
        }
      }
    };
  
    HTMLElement.prototype.twinkle = function(a, b, d, e) {//speed times call linear
      e = _checkArg(e, "linear");
      b = _checkArg(b, "infinite");
      if (a != undefined) {
        a = _checkSpinSpeed(a)
      } else {
        a = 2
      }
      if ($J.type(b)=="number") {
        this.stopSpin();
        var f = this;
        setTimeout(function() {
          _helpTwinkle(a, b, d, e, f)
        }, 20)
      } else {
        _helpTwinkle(a, b, d, e, this)
      }
      return this
    };
    function _helpTwinkle(a, b, d, e, f) {
      f.css({
        "animation": "j-twinkle " + a + "s " + e + " 0s " + b,
        "-moz-animation": "j-twinkle " + a + "s " + e + " 0s " + b,
        "-webkit-animation": "j-twinkle " + a + "s " + e + " 0s " + b,
        "-o-animation": "j-twinkle " + a + "s " + e + " 0s " + b
      });
      if ($J.type(b)=="number") {
        if (d != undefined) {
          setTimeout(function() {
            _checkCallBack(d, f)
          }, a * b * 1000)
        }
      }
    };
    HTMLCollection.prototype.twinkle = NodeList.prototype.twinkle = function(b, c, d, e) {
      this.each(function(a) {
        a.twinkle(b, c, d, e)
      });
      return this
    };
    HTMLCollection.prototype.spin = NodeList.prototype.spin = function(b, c, d, e) {
      this.each(function(a) {
        a.spin(b, c, d, e)
      });
      return this
    };
  
    function _checkSpinSpeed(a) {
      if ($J.type(a)=="string") {
        switch (a) {
        case "slower":
          a = 3;
          break;
        case "slow":
          a = 2.5;
          break;
        case "normal":
          a = 2;
          break;
        case "fast":
          a = 1.5;
          break;
        case "faster":
          a = 1;
          break;
        default:
          a = 2
        }
        return a
      } else {
        return a / 1000
      }
    };
    HTMLElement.prototype.stopTwinkle = function(bool) {
      var a = (bool==true)?"1":this.css("opacity");
      this.css({
        "animation": "none",
        "-moz-animation": "none",
        "-webkit-animation": "none",
        "-o-animation": "none",
        "opacity": a
      });
      return this
    };
    HTMLElement.prototype.stopSpin = function(bool) {
      var a = (bool==true)?"rotate(0)":this.css("transform");
      this.css({
        "animation": "none",
        "-moz-animation": "none",
        "-webkit-animation": "none",
        "-o-animation": "none",
        "transform": a,
        "-moz-transform": a,
        "-webkit-transform": a,
        "-o-transform": a
      });
      return this
    };
    HTMLCollection.prototype.stopTwinkle = NodeList.prototype.stopTwinkle = function() {
      this.each(function(a) {
        a.stopTwinkle()
      });
      return this
    };
    HTMLCollection.prototype.stopSpin = NodeList.prototype.stopSpin = function() {
      this.each(function(a) {
        a.stopSpin()
      });
      return this
    };
  
    HTMLElement.prototype.tip = function(text) {
      if(!$J.id("jetTip").exist()){
        $J.body().append($J.ct("span#jetTip").clk('this.removeClass("j_active").css("top","-100px")'));
      }
      if($J.type(text)=="array"){
        text=text[0];
      }
      this.jetTip=text;
      this.on({
        mousemove: function(e){
          $J.id("jetTip").txt(this.jetTip).addClass("j_active").css({
            top:e.pageY+5+"px",
            left:e.pageX+8+"px"
          })
        },
        mouseleave:function(){
          $J.id("jetTip").removeClass("j_active").css("top","-100px");
        }
      },true);
      return this
    };
    HTMLCollection.prototype.tip = NodeList.prototype.tip = function(text) {
      if($J.type(text)=="array"){
        this.each(function(a,i) {
          a.tip(text[i])
        });
      }else{
        this.each(function(a,i) {
          a.tip(text)
        });
      }
      return this
    };
    function _removeAnimation(a) {
      a.removeClass("j-animation").css({
        "transition-duration": "0s!important",
        "-ms-transition-duration": "0s!important",
        "-webkit-transition-duration": "0s!important",
        "-o-transition-duration": "0s!important",
        "-moz-transition-duration": "0s!important"
      })
    };
    function _checkDisplay(obj){
      if(obj.css("display")=="none"){
        return false;
      }
      return true;
    };
    HTMLElement.prototype.slideUp = function(a, b, c) {
      if(_checkDisplay(this)){
        return _checkSlideHeight(this, a, b, c,false)
      }
      return this;
    };
    HTMLElement.prototype.slideDown = function(a, b, c) {
      if(!_checkDisplay(this)){
        if (this.hasClass("j-fade")) {
          this.removeClass("j-fade").addClass("j-slide")
        };
        return _checkSlideHeight(this, a, b, c,true)
      }
      return this;
    };
    HTMLElement.prototype.slideToggle = function(a, b, c) {
      if(this.css("display")=="none"&&!this.hasClass("j-slide")){//第一次
        this.addClass("j-for-slide-height");
        this.css("height",this.hei()+"px");
        this.removeClass("j-for-slide-height");
        //this.css("display","initial").addClass("j-slide").hide();
        this.css("display","block").addClass("j-slide").hide();
      }
      if (this.hasClass("j-fade")) {
        this.removeClass("j-fade").addClass("j-slide")
      }
      return _checkSlideHeight(this, a, b, c)
    };
    function _checkSlideHeight(obj,a, b, c,d){
      if(obj.style.height==""||obj.style.height=="auto"){
        if(d&&obj.css("display")=="none"){
          obj.addClass("j-none");
        }
        obj.css("height",obj.css("height"));
        obj.removeClass("j-none");
        obj.attr("j-h-auto","true");
        setTimeout(function(){
          _animateBase(obj, "j-slide", a, b, c,d)
        },50);
      }else{
        _animateBase(obj, "j-slide", a, b, c,d)
      }
      return obj;
    };
    HTMLElement.prototype.fadeOut = function(a, b, c) {
      if(_checkDisplay(this)){
        return _animateBase(this, "j-fade", a, b, c, false)
      }
      return this;
    };
    HTMLElement.prototype.fadeIn = function(a, b, c) {
      if(!_checkDisplay(this)){
        if (this.hasClass("j-slide")) {
          this.removeClass("j-slide").addClass("j-fade")
        }
        return _animateBase(this, "j-fade", a, b, c, true)
      }else{
        return this;
      }
    };
    HTMLElement.prototype.fadeToggle = function(a, b, c) {
      if(this.css("display")=="none"&&!this.hasClass("j-fade")){
        this.css("display","initial").addClass("j-fade").hide();
      }
      if (this.hasClass("j-slide")) {
        this.removeClass("j-slide").addClass("j-fade")
      }
      return _animateBase(this, "j-fade", a, b, c)
    };
    HTMLElement.prototype.hide = function() {
      if (!this.hasAttr("j-display")) {
        this.attr("j-display", this.css("display"));
        return this.css("display", "none!important")
      };
      return this
    };
    HTMLElement.prototype.show = function(a) {
      if (this.css("display") == "none") {
        this.css("display", "block!important");/*for initial is not supported*/
        //this.css("display", "initial!important");
      }
      if (this.hasAttr("j-display")) {
        if (a == undefined) {
          this.removeClass("j-fade j-slide")
        }
        return this.css("display", this.attr("j-display") + "!important").removeAttr("j-display")
      };
      return this
    };
    HTMLElement.prototype.showToggle = function() {
      if (this.hasAttr("j-display")) {
        this.show()
      } else {
        this.hide()
      }
    };
  
    function _animateBase(a, b, c, d, e, f) {
      if (f == undefined) {
        if (a.hasAttr("j-display")) {
          f = true
        } else {
          f = false
        }
      }
      a.addClass("j-animation");
      if (f) {
        if (a.css("display") == "none") {
          a.addClass(b)
        }
        a.show(false)
      }
      if (f != false) {
        setTimeout(function() {
          _animateBasePart(a, b, c, d, e, f)
        }, 50)
      } else {
        _animateBasePart(a, b, c, d, e, f)
      }
      return a
    };
  
    function _animateBasePart(a, b, c, d, e, f) {
      d = _checkAnimatePara(a, d, e);
      if (f) {
        if (b == "j-slide") {
          a.addClass("j-over-hidden")
        }
        a.removeClass(b)
      } else {
        a.addClass(b)
      }
      setTimeout(function() {
        _checkCallBack(c, a);
        _removeAnimation(a);
        if (!f) {
          a.hide()
        } else {
          if (b == "j-slide") {
            a.removeClass("j-over-hidden");
            if(a.attr("j-h-auto")=="true"){
              a.css("height","auto");
            }
          }
        }
      }, d)
    };
  
    function _checkAnimatePara(a, b, c) {
      if (b != undefined) {
        b = _checkAnimateSpeed(b) / 1000
      } else {
        b = 0.5
      }
      a.css({
        "transition-duration": b + "s!important",
        "-ms-transition-duration": b + "s!important",
        "-webkit-transition-duration": b + "s!important",
        "-o-transition-duration": b + "s!important",
        "-moz-transition-duration": b + "s!important"
      });
      c = _checkArg(c, "linear");
      a.css({
        "transition-timing-function": c + "!important",
        "-ms-transition-timing-function": c + "!important",
        "-webkit-transition-timing-function": c + "!important",
        "-o-transition-timing-function": c + "!important",
        "-moz-transition-timing-function": c + "!important"
      });
      return b * 1000
    };
    HTMLCollection.prototype.slideUp = NodeList.prototype.slideUp = function(b, c, d) {
      this.each(function(a) {
        a.slideUp(b, c, d)
      });
      return this
    };
    HTMLCollection.prototype.slideDown = NodeList.prototype.slideDown = function(b, c, d) {
      this.each(function(a) {
        a.slideDown(b, c, d)
      });
      return this
    };
    HTMLCollection.prototype.slideToggle = NodeList.prototype.slideToggle = function(b, c, d) {
      this.each(function(a) {
        a.slideToggle(b, c, d)
      });
      return this
    };
    HTMLCollection.prototype.fadeIn = NodeList.prototype.fadeIn = function(b, c, d) {
      this.each(function(a) {
        a.fadeIn(b, c, d)
      });
      return this
    };
    HTMLCollection.prototype.fadeOut = NodeList.prototype.fadeOut = function(b, c, d) {
      this.each(function(a) {
        a.fadeOut(b, c, d)
      });
      return this
    };
    HTMLCollection.prototype.fadeToggle = NodeList.prototype.fadeToggle = function(b, c, d) {
      this.each(function(a) {
        a.fadeToggle(b, c, d)
      });
      return this
    };
    HTMLCollection.prototype.hide = NodeList.prototype.hide = function() {
      this.each(function(a) {
        a.hide()
      });
      return this
    };
    HTMLCollection.prototype.show = NodeList.prototype.show = function() {
      this.each(function(a) {
        a.show()
      });
      return this
    };
    HTMLCollection.prototype.showToggle = NodeList.prototype.showToggle = function() {
      this.each(function(a) {
        a.showToggle()
      });
      return this
    };
  
    function _checkAnimateSpeed(a) {
      if ($J.type(a)=="string") {
        switch (a) {
        case "slower":
          a = 1500;
          break;
        case "slow":
          a = 1000;
          break;
        case "normal":
          a = 400;
          break;
        case "fast":
          a = 250;
          break;
        case "faster":
          a = 100;
          break;
        default:
          a = 400
        }
      }
      return a
    };
  
    function _checkArg(a, b) {
      return (a == undefined) ? b : a
    };
    HTMLElement.prototype.scrollXTo = function(a, b, c) {
      var n = 0;
      var e = this;
      c = _checkArg(c, 400);
      var f = _checkAnimateSpeed(c) / 10;
      var g = (a - e.scrollLeft) / f;
      var d = e.scrollLeft;
      var h = setInterval(function() {
        d += g;
        e.scrollLeft = Math.round(d);
        n++;
        if (n == f) {
          e.scrollLeft = a;
          _checkCallBack(b, e);
          clearTimeout(h)
        }
      }, 10);
      return this
    };
    HTMLCollection.prototype.scrollXTo = NodeList.prototype.scrollXTo = function(i, b, c) {
      this.each(function(a) {
        a.scrollXTo(i, b, c)
      });
      return this
    };
    HTMLElement.prototype.scrollX = function(i, a, b) {
      if (arguments.length == 0) {
        return this.scrollLeft
      } else {
        return this.scrollXTo(this.scrollLeft + i, a, b)
      }
    };
    HTMLCollection.prototype.scrollX = NodeList.prototype.scrollX = function(i, b, c) {
      this.each(function(a) {
        a.scrollX(i, b, c)
      });
      return this
    };
    HTMLElement.prototype.hei = function() {
      return this.offsetHeight
    };
    HTMLElement.prototype.wid = function() {
      return this.offsetWidth
    };
    HTMLElement.prototype.child = function(i) {
      if (i == undefined) {
        return this.children
      } else {
        return this.children[i]
      }
    };
    HTMLElement.prototype.hasChild = function(a) {
      if(a==undefined){
        return (this.children.length>0)?true:false; 
      }else{
        return (this.select(a).length==0)?false:true; 
      }
    };
    HTMLElement.prototype.clone = function() {
      return this.cloneNode().html(this.html());
    };
    HTMLElement.prototype.parent = function(i) {
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
    HTMLElement.prototype.bro = function(i) {
      if (i == undefined) {
        return this.parent().child()
      } else {
        return this.parent().child(i)
      }
    };
    HTMLElement.prototype.prepend = function(a) {
      var t=$J.type(a);
      if (t=="array"||t=="htmlcollection"||t=="nodelist") {
        var b = this;
        a.each(function(item) {
          b.insertBefore(_checkHtmle(item), b.children[0])
        })
      } else if(t=="string"){
        this.insertBefore(_checkHtmle(a),this.children[0])
      }else{
        this.insertBefore(_checkHtmle(a), this.children[0])
      }
      return this
    };
    HTMLCollection.prototype.prepend = NodeList.prototype.prepend = function(a) {
      this.each(function(c) {
        c.prepend(a)
      });
      return this
    };
    HTMLElement.prototype.append = function(b, a) {
      if (a == undefined) {
        var type=$J.type(b);
        if (type=="array"||type=="htmlcollection"||type=="nodelist") {
          for(var i=0;i<b.length;i++){
            this.append(b[i]);
          }
        } else if(type=="string"){
          this.append(_checkHtmle(b))
        }else{
          this.appendChild(_checkHtmle(b))
        }
      } else {
        this.insertBefore(_checkHtmle(b), this.children[a])
      }
      return this
    };
    HTMLElement.prototype.toArray=function(){
      return [this];
    };
    HTMLCollection.prototype.toArray = NodeList.prototype.toArray = function() {
      var a=[];
      for(var i=0;i<this.length;i++){
        a.push(this[i])
      }
      return a
    };
    function _checkHtmle(a){
      if($J.type(a)=="string"){
        var e=$J.ct("div").html(a);
        if(e.child().length==1){
          return e.child(0);
        }else{
          return e.child().toArray();
        }
      }
      return a;
    };
    HTMLElement.prototype.after = function(b) {
      var type=$J.type(b);
      if (type=="array"||type=="htmlcollection"||type=="nodelist") {
        var c = this;
        var d = c.next();
        b.each(function(a) {
          c.parent().insertBefore(_checkHtmle(a), d)
        })
      } else {
        this.parent().insertBefore(_checkHtmle(b), this.next())
      }
      return this
    };
    HTMLCollection.prototype.after = NodeList.prototype.after = function(b) {
      this.each(function(c) {
        c.after(b)
      });
      return this
    };
    HTMLElement.prototype.before = function(b) {
      var type=$J.type(b);
      if (type=="array"||type=="htmlcollection"||type=="nodelist") {
        var c = this;
        b.each(function(a) {
          c.parent().insertBefore(_checkHtmle(a), c)
        })
      } else {
        this.parent().insertBefore(_checkHtmle(b), this)
      }
      return this
    };
    HTMLCollection.prototype.before = NodeList.prototype.before = function(b) {
      this.each(function(c) {
        c.before(b)
      });
      return this
    };
    HTMLCollection.prototype.append = NodeList.prototype.append = function(b, a) {
      this.each(function(c) {
        c.append(b, a)
      });
      return this
    };
    HTMLElement.prototype.index = function() {
      var a = this.parent().child();
      for (var i = 0; i < a.length; i++) {
        if (a[i] == this) {
          return i
        }
      }
      return -1
    };
    HTMLElement.prototype.on = function(a, b,d) {
      if($J.type(a)=="string"){
        return this.event("on"+a,b,d);
      }else{
        for (var c in a) {
          a["on"+c]=a[c];
          delete a[c];
        }
        return this.event(a,b);
      }
    };
    HTMLCollection.prototype.on = NodeList.prototype.on = function(a, c,d) {
      this.each(function(b) {
        b.on($J.clone(a), c,d)
      });
      return this
    };
    HTMLElement.prototype.clk = function(b,d) {
      return this.event("onclick",b,d);
    };
    HTMLCollection.prototype.clk = NodeList.prototype.clk = function(a, c) {
      this.each(function(b) {
        b.clk(a, c)
      });
      return this
    };
    
    HTMLElement.prototype.event = function(a, b,d) {
      if($J.type(a)=="string"){
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
    HTMLCollection.prototype.event = NodeList.prototype.event = function(a, c,d) {
      this.each(function(b) {
        b.event(a, c,d)
      });
      return this
    };
    HTMLElement.prototype.empty = function() {
      return this.html("")
    };
    HTMLCollection.prototype.empty = NodeList.prototype.empty = function() {
      this.each(function(a) {
        a.empty()
      });
      return this
    };
    HTMLElement.prototype.remove = function() {
      if(this.parentNode===null)return;
      this.parentNode.removeChild(this)
    };
    HTMLCollection.prototype.remove = NodeList.prototype.remove = function(a) {
      if (a == undefined) {
        for (var i = 0; i < this.length;) {
          this[i].remove()
        }
      } else {
        if ($J.type(a)=="number") {
          for (var i = 0; i < this.length; i++) {
            if (i == a) {
              this[i].remove();
              return this
            }
          }
        } else {
          for (var i = 0; i < this.length; i++) {
            if (this[i] == a) {
              this[i].remove();
              return this
            }
          }
        }
      }
    };
    HTMLElement.prototype.each = function(b,d) {
      b(this, 0,d);
      return this
    };
    HTMLCollection.prototype.each = NodeList.prototype.each = function(b,d) {
      var arr=this.toArray();//removeClass 情况下
      for (var a = 0; a < arr.length; a++) {
        b(arr[a], a,d)
      }
      return this
    };
    Array.prototype.each = function(b,d) {
      for (var a = 0; a < this.length; a++) {
        b(this[a], a,d)
      }
      return this
    };
    Array.prototype.empty = function(b) {
      this.length = 0;
      return this;
    };
    HTMLElement.prototype.last =function(){
      return this.child().last();
    };
    HTMLElement.prototype.first =function(){
      return this.child().first();
    };
    HTMLCollection.prototype.last = NodeList.prototype.last =Array.prototype.last = function(b) {
      return this[this.length-1];
    };
    HTMLCollection.prototype.first = NodeList.prototype.first =Array.prototype.first = function(b) {
      return this[0];
    };
    Array.prototype.remove = function(b,order) {
      var index=this.indexOf(b)
      if(order==false){
        this[a]=this[this.length--];
      }else{
        this.removeByIndex(index);
      }
      return this
    };
    Array.prototype.removeByIndex = function(b,n) {
      this.splice(b,n||1);
      return this
    };
    Array.prototype.insert = function(b, i) {
      this.splice(i,0,b);
      return this
    };
    Array.prototype.insertArray = function(arr,i) {
      //var _arr=arr._JT_clone();//深拷贝
      var _arr=arr.slice(0);//浅拷贝
      _arr.splice(0,0,i,0);
      Array.prototype.splice.apply(this,_arr)
      // var index=i;
      // var n=arr.length;
      // for (var a = this.length - 1; a >= index; a--) {
      //   this[a + n] = this[a]
      // }
      // for(var j=0;j<n;j++){
      //   this[index+j] = arr[j];
      // }
      return this
    };
    Array.prototype.append = function() {
      Array.prototype.push.apply(this,arguments)
      return this
    };
    Array.prototype.appendArray = function(arr) {
      Array.prototype.push.apply(this,arr)
      return this
    };
    Array.prototype.prepend = function(b) {
      if(arguments.length==1){
        return this.insert(b, 0)
      }else{
        return this.insertArray(arguments, 0)
      }
    };
    Array.prototype.prependArray = function(b) {
      return this.insertArray(b, 0)
    };
    Array.prototype.sort = function(a) {
      var b = this.length;
      var c, current;
      for (var i = 1; i < b; i++) {
        c = i - 1;
        current = this[i];
        while (c >= 0 && this[c] > current) {
          this[c + 1] = this[c];
          c--
        }
        this[c + 1] = current
      }
      if (a == false) {
        this.reverse()
      }
      return this
    };
    Array.prototype.sortByAttr = function(a,type, b) {
      var c = this.length;
      var d, current;
      for (var i = 1; i < c; i++) {
        d = i - 1;
        current = this[i];
        while (d >= 0 && _compareValue(this[d][a],current[a],type) ) {
          this[d + 1] = this[d];
          d--
        }
        this[d + 1] = current
      }
      if (type == false||b==false) {
        this.reverse()
      }
      return this
    };
    function _compareValue(a,b,type){
      if(_getSortValue(a,type)>_getSortValue(b,type)){
        return true;
      }
      return false;
    };
    function _getSortValue(value,type){
      if(type==undefined||$J.type(type)=="boolean"){
        return value;
      }else{
        var res=null;
        switch(type){
          case "date":
            if($J.type(value)=="date"){
              res=value;
            }else{
              var arr;
              if(value.has("-")){
                arr=value.split("-");
              }else{
                arr=value.split("/");
              }
              res=new Date(arr[0],arr[1],arr[2]);
            }break;
          case "length":res=value.length;break;
          case "headLetter":res=value.toLowerCase().charCodeAt(0);break;
          case "number":res=value;break;
          default:res=value;break;
        }
        return res;
      }
    };
    function _each(obj,fun,arg){
      var type=$J.type(obj);
      if(type=="json"||type=="object"){
        var k=0;
        for (var a in obj) {
          if($J.type(obj[a])!="function"){
            fun(obj[a], a,k,obj)
          }
          k++;
        }
      }else if(type=="number"||type=="boolean"||type=="string"||type=="function"){
        fun(obj, 0,arg);
      }else{
        obj.each(fun,arg);
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
    function _clone(obj){
      if(obj==undefined){
        return null;
      }
      var type=$J.type(obj);
      if(type=="htmlelement"||type=="array"){
        return obj.clone();
      }else if(type=="json"||type=="object"){
        var a=new Object();
        for(var attr in obj){
          if(obj[attr]==null||obj[attr]==undefined){
            a[attr]=obj[attr];
          }else if($J.type(obj[attr])=="array"){
            a[attr]=obj[attr].clone();
          }else if($J.type(obj[attr])=="json"||$J.type(obj[attr])=="object"){
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
    function _even(a,b){
      if(a==undefined||b==undefined){
        return (a==b);
      }else{
        var atype=$J.type(a);
        var btype=$J.type(b);
        if(atype!=btype){
          return false;
        }else{
          if(atype=="json"||atype=="object"){
            return (JSON.stringify(a)==JSON.stringify(b));
          }else if(atype=="array"||atype=="function"){
            return (a.toString()==b.toString());
          }else if(atype=="htmlelement"||atype=="htmlcollection"||atype=="nodelist"){
            var arr=a.allHtml();
            if($J.type(arr)=="array"){
              return _even(arr,b.allHtml());
            }
            return (arr==b.allHtml());
          }else{
            return (a==b);
          }
        }
      }
    };
    function _toString(a){
      if(a==undefined){
        return "undefined";
      }else{
        var type=$J.type(a);
        if(type=="json"||type=="object"){
          return JSON.stringify(a);
        }else if(type=="string"){
          return '"'+a+'"';
        }else if(type=="array"){
          var s="[";
          for(var i=0;i<a.length;i++){
            s+=_toString(a[i])+',';
            if(i==a.length-1){
              s=s.substring(0,s.length-1);
            }
          }
          return s+"]";
        }else if(type=="htmlelement"||type=="htmlcollection"||type=="nodelist"){
          var arr=a.allHtml();
          if($J.type(arr)=="array"){
            return arr.toString();
          }
          return arr;
        }else{
          return a.toString();
        }
      }
    };
    Array.prototype.even = function(a) {
      return _even(this,a);
    };
    Array.prototype.clone = function() {
      var a=new Array();
      this.each(function(item){
        a.append(_clone(item));
      });
      return a;
    };
    function _checkEmptyArray(arr,thr){
      if(arr.length==0){
        if(thr!=false){
          throw new Error("空数组不支持该方法");
        }
        return false;
      }else{
        return true;
      }
    };
    Array.prototype.sum = function(a,b) {
      if(_checkEmptyArray(this)){
        if(a!=undefined){
          return this.slice(a,b).sum();
        }else{
          var con=$J.type(this[0]);
          if(con=="number"||con=="string"||con=="array"){
            var sum;
            if(con=="number"||(con=="array"&&$J.type(this[0][0])=="number")){
              sum=0;
            }else if(con=="string"||(con=="array"&&$J.type(this[0][0])=="string")){
              sum="";
            }else{
              throw new Error("sum方法不支持除Number,String,Array以外的类型");
            }
            this.each(function(a){
              if($J.type(a)=="array"){
                a.each(function(b){
                  sum+=b;
                });
              }else{
                sum+=a;
              }
            });
            return sum;
          }else{
            throw new Error("sum方法不支持除Number,String,Array以外的类型");
          }
        }
      }else{
        return 0;
      }
    };
    Array.prototype.avg = function() {
      if(_checkEmptyArray(this)){
        var con=$J.type(this[0]);
        if(con=="number"||con=="string"){
          return this.sum()/this.length;
        }else{
          throw new Error("ave方法不支持除Number,String以外的类型");
        }
      }
    };
    Array.prototype.max = function(attr,type) {
      if(_checkEmptyArray(this)){
        var type=$J.type(this[0]);
        if(type=="number"){
          return Math.max.apply(null,this);
        }else if(type=="string"||type=="array"){
          return $J.clone(this).sortByAttr("length").last();
        }else if(type=="date"){
          return $J.clone(this).sort().last();
        }else if(type=="json"||type=="object"){
          if(attr==undefined){
            throw new Error("Object类型数组参数不可为空");
          }else{
            return $J.clone(this).sortByAttr(attr,type).last();
          }
        }
        throw new Error("不支持的类型");
      }
    };
    Array.prototype.min = function() {
      if(_checkEmptyArray(this)){
        var type=$J.type(this[0]);
        if(type=="number"){
          return Math.min.apply(null,this);
        }else if(type=="string"||type=="array"){
          return $J.clone(this).sortByAttr("length").first();
        }else if(type=="date"){
          return $J.clone(this).sort().first();
        }else if(type=="json"||type=="object"){
          if(attr==undefined){
            throw new Error("Object类型数组参数不可为空");
          }else{
            return $J.clone(this).sortByAttr(attr,type).first();
          }
        }
        throw new Error("不支持的类型");
      }
    };
    // Array.prototype.reverse = function() {
    //   var t;
    //   var n = Math.floor(this.length / 2);
    //   for (var i = 0; i < n; i++) {
    //     t = this[i];
    //     this[i] = this[this.length - 1 - i];
    //     this[this.length - 1 - i] = t
    //   };
    //   return this
    // };
    Array.prototype.has = function(a) {
      if(_checkEmptyArray(this,false)){
        var type=$J.type(this[0]);
        if(type=="number"||type=="string"){
          return (this.indexOf(a)>-1);
        }else{
          for(var i=0;i<this.length;i++){
            if(a==this[i]){
              return true;
            }
            return false;
          }
        }
      }else{
        return false;
      }
    };
    Array.prototype.indexsOf =function(a){
      var indexs=[];
      if(_checkEmptyArray(this,false)){
        for(var i=0;i<this.length;i++){
          if(a==this[i]){
            indexs.push(i);
          }
        }
      }
      return indexs;
    };
    Array.prototype.timeOf =function(a){
      var sum=0;
      this.each(function(item){
        if(item==a){
          sum++;
        }
      });
      return sum;
    };
    Array.prototype.group=function(n){
      var a=[];
      var x=Math.ceil(this.length/n);
      for(var i=0;i<x;i++){
        var b=[];
        for(var j=0;j<n;j++){
          if(i*n+j==this.length){
            break;
          }else{
            b.push(this[i*n+j]);
          }
        }
        a.push(b);
      }
      return a;
    };
    String.prototype.reverse = function() {
      var s="";
      for(var i=this.length-1;i>=0;i--){
        s+=this[i];
      }
      return s;
    };
    String.prototype.has = function(s) {
      if ($J.type(s)=="string") {
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
    String.prototype.timeOf = function(s) {
      if ($J.type(s)=="string") {
        return this.split(s).length - 1
      } else {
        var a = this.match(s);
        if (a == null) {
          return 0
        } else {
          return a.length
        }
      }
    };
    String.prototype.replaceAll = function(a, b) {
      if ($J.type(b)=="array") {
        if ($J.type(a)=="string") {
          var s = this.split(a);
          var d = s[0];
          s.each(function(a, i) {
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
            g.each(function(a, i) {
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
        if ($J.type(a)=="string") {
          return this.replace(new RegExp(a, "g"), b)
        } else {
          return this.replace(a, b)
        }
      }
    };
    String.prototype.indexsOf = function(a, i) {
      var b = this.split(a);
      var c = null;
      if ($J.type(a)!="string") {
        c = this.match(a)
      }
      if (b.length <= 2) {
        if (this.indexOf(a) == -1) {
          return []
        } else {
          return [this.indexOf(a)]
        }
      } else {
        var d = [];
        var e = a.length;
        var f = 0;
        b.each(function(s, n) {
          if (n > 0) {
            d[d.length] = f;
            if (c != null) {
              f += c[n - 1].length
            } else {
              f += a.length
            }
          }
          f += s.length
        });
        if (i == undefined) {
          return d
        } else {
          if (i > d.length - 1) return d[d.length - 1];
          return d[i]
        }
      }
    };
    String.prototype.insert = function(a, i) {
      return this.substring(0, i) + a + this.substring(i)
    };
  
  
    HTMLElement.prototype.exist = function(call,callf){
      if(call!=undefined){
        _checkFunction(call)(this);
      }
      return true;
    };
    HTMLCollection.prototype.exist = NodeList.prototype.exist= function(call,callf){
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
      }else if(location.hash.has('?')){
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
  
    function _jump(a) {
      try{
        window.location.href = (encodeURI(a))
      }catch(e){
        throw new Error("跳转地址错误");
      }
    };
    function _getRandomNum(a, b) {
      return (a + Math.round(Math.random() * (b - a)))
    };
  
    function _sign(n) {
      if (n >= 0) {
        return 1
      }
      return -1
    };
  
    function _checkArg(a, b) {
      return (a == undefined) ? b : a
    };
    function _isMobile() {
      if ((/AppleWebKit.*Mobile/i).test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    };
    var _jui_bind='jui-bind';
var _jui_change='jui-change';
//SELECT 动态绑定是列表不会改表 **
//checkbox group 有bug
//date 没设置初始值会有bug
//date color 通过value设置初始值没反应

//color :第一次选择颜色时 左上角不是fff

$J.ready(function(){
  JUI.init();
});
function _createEmpty(){
var a={};
a.__proto__=null;
return a;
}
window.JUI={
  _jui_mounted:[],
  init:function(item,checkParGroup){
      JUI.SELECT.init(item);
      //JUI.RADIO.init(item);
      JUI.RADIO_GROUP.init(item,checkParGroup);
      JUI.CHECKBOX_GROUP.init(item,checkParGroup);
      JUI.SWITCH.init(item);
      JUI.DATE.init(item);
      JUI.COLOR.init(item);
      JUI.SLIDER.init(item);
      JUI.DIALOG.init(item);
      JUI.PAGE.init(item);
      JUI.TAB.init(item);
      JUI.SCREEN_DRAG.init(item);
      JUI.CODE.init(item);
      JUI._jui_mounted.forEach(function(f){
          f();
      });
  },useBind:function(jet){
      var list=jet._tools._ele.findAttr(_jui_bind);
      //var list=$J.attr(_jui_bind);
      if(list.exist()){
          JUI._jui_mounted.push(function(){
            list.each(function(item){
              if(item.hasBind!==true){
                item.hasBind=true;
                if(item.hasClass(JUI.RADIO._name)&&!JUI.RADIO_GROUP.def_r_group.hasBind){
                    JUI.RADIO_GROUP.def_r_group.hasBind=true;
                    JUI.RADIO_GROUP.def_r_group.ele.attr(_jui_bind,item.attr(_jui_bind));
                    _useBindSingle({
                        item:JUI.RADIO_GROUP.def_r_group.ele,
                        jet:jet,
                        isDef:true
                    });
                }else if(item.hasClass(JUI.CHECKBOX._name)&&!JUI.CHECKBOX_GROUP.def_c_group.hasBind){
                    JUI.CHECKBOX_GROUP.def_c_group.hasBind=true;
                    JUI.CHECKBOX_GROUP.def_c_group.ele.attr(_jui_bind,item.attr(_jui_bind));
                    _useBindSingle({
                        item:JUI.CHECKBOX_GROUP.def_c_group.ele,
                        jet:jet,
                        isDef:true,
                        type:JUI.CHECKBOX._name
                    });
                }else{
                    _useBindSingle({
                        item:item,
                        jet:jet
                    });
                }
              }
          });
          // $J.attr('disabled').on('click',null);
          // $J.select('.j-color[disabled] .j-color-icon').on('click',null);
          // $J.select('.j-date[disabled] .j-date-v').on('click',null).attr('disabled','true');
          // $J.select('.j-select[disabled] .j-color-icon').on('click',null);
          JUI._jui_mounted.remove(this);
        })
      }
  },msg:function(opt,type,time){
      if(typeof opt!=='object')
          opt={text:opt,type:type,time:time};
      new JUI.MESSAGE(opt);
  },confirm:function(opt,call,type){
      if(typeof opt=='string')
          opt={text:opt,onconfirm:call,type:type};
      new JUI.CONFIRM(opt);
  },
  mounted:function(call){
      JUI._jui_mounted.push(call);
  },
}
function _useBindSingle(opt){
  var item=opt.item;
  var attr=item.attr(_jui_bind);
  var jet=opt.jet;
  var _jet=(opt.isDef)?jet:_findJetPar(item,jet);
  if(attr&&attr in _jet._tools._calls){
    var jui=item.$jui;
    var d,cd;
    if(_jet==jet){
        d=_jet._tools._data;
        cd=_jet;
        //d=_jet;
    }else{
        d=_jet._data[_jet.name];
        cd=_jet.data[_jet.name];
        //d=_jet.data[_jet.name];
    }
    if(item.hasAttr(_jui_change)){
        jui._onchange=_getCallbackForBind(jet,jui,item.attr(_jui_change));
    }
    var jattr=getValueTxt(item);
    if(d[attr]!==undefined&&jui['_'+jattr]!==d[attr]){
      jui[jattr]=d[attr];
    }
    _jet._tools._calls[attr]._func.push(function(k,v){
        if(jui['_'+jattr]!==v&&v!==undefined){
        //if(v!==undefined){
            jui['_'+jattr]=v;
            jui.onchange.call(jui);
        }
    });
    _defindJuiBind(_jet,jui,jattr,cd,d,attr);

    _checkExtraBind(item,_jet,jui,cd,d,jet)
    item.removeAttr(_jui_bind);
    
    item._hasInitJui=true; 
    if(item.hasClass(JUI.DIALOG._name)){
      document.body.append(item);
    }
  }
  //jui[jattr]._jet=(_jet==jet)?_jet:d[attr]._jet
  //Object.defineProperty(_jet.get(),attr,opt);
}
function _isDisabled(ele){
return (ele.hasAttr('disabled')&&ele.attr('disabled')!=="false")
}
function _getCallbackForBind(jet,jui,func){
if(func!==""){
  jui.jet=jet;
  if(func in jet&&typeof jet[func]=='function'){
    return jet[func];
  }else if(window[func]&&typeof window[func]=='function'){
    return window[func];
  }else{
    return new Function('opt',func);
  }
}
}
function _checkExtraBind(item,_jet,jui,cd,d,jet){
  if(item.hasAttr('jui-page-total')){
    var attr=item.attr('jui-page-total');
    var jattr='total';
    if(d[attr]!=undefined&&jui['_'+jattr]!=d[attr]){
      jui[jattr]=d[attr];
      jui.onchangetotal.call(jui);
    }
    _jet._tools._calls[attr]._func.push(function(k,v){
        if(jui['_'+jattr]!=v&&v!=undefined){
            jui['_'+jattr]=v;
            jui.onchangetotal.call(jui);
        }
    });
    _defindJuiBind(_jet,jui,jattr,cd,d,attr);
  }
  if(item.hasAttr('jui-onclose')&&item.attr('jui-onclose')!==''){
    jui._onclose=_getCallbackForBind(jet,jui,item.attr('jui-onclose'));
  }
  if(item.hasAttr('jui-onload')&&item.attr('jui-onload')!==''){
    jui._onload=_getCallbackForBind(jet,jui,item.attr('jui-onload'));
    jui._onload.call(jet);
  }
  if(item.hasAttr('callback')&&item.attr('callback')!==''){
    jui.ele.code_callback=_getCallbackForBind(jet,jui,item.attr('jui-onload'));
  }
}
function _defindJuiBind(_jet,jui,jattr,cd,d,attr){
Object.defineProperty(jui,jattr,{
  get:function(){
    return d[attr]
  },
  set:function(v){
    if(typeof d[attr]=='object'){
        cd[attr].$replace(v);
    }else{
        if(jui.checkValue){v=jui.checkValue(v);}
        d[attr]=v;
    }
    _jet._tools._calls[attr]._func.forEach(function(f){
        f(attr,v);
    });
  },
});
}
function getValueTxt(item){
  if(item.hasClass(JUI.RADIO._name)){
      return 'checked';
  }else{
      return 'value';
  }
}
JUI.msg.success=function(txt,time){_msgDefault(txt,time,JUI.MESSAGE.success);};
JUI.msg.warn=function(txt,time){_msgDefault(txt,time,JUI.MESSAGE.warn);};
JUI.msg.error=function(txt,time){_msgDefault(txt,time,JUI.MESSAGE.error);};
JUI.msg.info=function(txt,time){_msgDefault(txt,time,JUI.MESSAGE.info);};
JUI.msg.close=function(){if(JUI.MESSAGE.msgList.length>0)JUI.MESSAGE.msgList[0].close()};
JUI.msg.isOpen=function(){return (JUI.MESSAGE.msgList.length>0)};
JUI.msg.clear=function(){
JUI.MESSAGE.msgList.forEach(function(m){
  m.close();
});
};
function _msgDefault(txt,time,type){
  if(txt===undefined)txt=type;
  if(typeof txt=='string'||typeof txt=='number')
      JUI.msg(txt,type,time);
  else{
      txt.type=type;
      JUI.msg(txt);
  }
}
JUI.confirm.isOpen=function(){
return (JUI.CONFIRM.confirmList.length>0)
}
JUI.confirm.clear=function(){
JUI.CONFIRM.confirmList.forEach(function(c){
  c.close();
});
}
JUI.confirm.success=function(txt,call){_confirmDefault(txt,call,JUI.CONFIRM.success);};
JUI.confirm.warn=function(txt,call){_confirmDefault(txt,call,JUI.CONFIRM.warn);};
JUI.confirm.error=function(txt,call){_confirmDefault(txt,call,JUI.CONFIRM.error);};
JUI.confirm.info=function(txt,call){_confirmDefault(txt,call,JUI.CONFIRM.info);};
JUI.confirm.close=function(){if(JUI.CONFIRM.confirmList.length>0)JUI.CONFIRM.confirmList[0].close()};
function _confirmDefault(txt,call,type){
  if(typeof txt=='string')
      JUI.confirm(txt,call);
  else{
      txt.type=type;
      JUI.confirm(txt);
  }
}
function _findJetPar(item,jet){
  var p=item.parent();
  while(p.__jet==undefined&&p.tagName!='BODY'){
      p=p.parent();
  }
  if(p.tagName=='BODY'){
      return jet;
  }
  return p.__jet;
}
function _stopPro(event){
  var e=arguments[0]||event;
  if (e && e.stopPropagation) {
      e.stopPropagation();
  } else if (window.event) {
      window.event.cancelBubble = true;
  }
}
function _throw(txt){
  throw new Error(txt);
}
function getEleList(item,name){
  if(item){
      return item.findClass(name);
  }else{
      return $J.cls(name)
  }
}
/*SELECT*************************************************************/
JUI.SELECT=function(opt){
  this.ele=opt.ele||null;
  this.options=opt.options||{};
  this.onchange=opt.onchange||function(){};
  this._value=opt.value||'';
  this.text=opt.text||'';
  var _this=this;
  Object.defineProperty(_this,'value',{
      configurable:true,
      get:function(){
          return _this._value;
      },set:function(v){
          _this._value=v;
          _this.onchange.call(_this);
      }
  });
};
JUI.SELECT.prototype=_createEmpty();
JUI.SELECT._name='j-select';
JUI.SELECT.option_txt='j-option';
JUI.SELECT.init=function(item){
  getEleList(item,this._name).each(function(item){
    if(!item._hasInitJui){
      item._hasInitJui=true;
      var _jui=new JUI.SELECT({ele:item});
      var list=item.child();
      //if(list.length>0){
          var def=list[0];
          var ow=$J.ct('div.j-option-w');
          var vw=$J.ct('div.j-select-vw');
              var v_span=$J.ct('span.j-select-v');
              var icon=$J.ct('i.j-icon.icon-caret-down');
          vw.append([v_span,icon]);
          _jui.onchange=function(){
              this.text=this.options[this.value];
              v_span.txt(this.text);
              item.attr('value',this.value);
              if(_jui._onchange){
                  var __t=_jui.jet||_jui;
                  _jui._onchange.call(__t,{
                      ele:item,
                      value:_jui._value,
                      jui:_jui
                  })
              }
          };
          list.each(function(_item){
              ow.append(_item);
              //_item.css('visibility','visible');
              if(_item.hasAttr('default')){
                  def=_item;
              }
              if(_item.hasAttr('disabled')){
                  _item.addClass('c-disabled');
              }
              var val=getVoT(_item);
              if(val==''){
                  _throw('SELECT:value值不能设置为空');
              }
              _jui.options[val]=getToH(_item);
              // var val=getVoT(_item);
              // if(val==''){
              //     _throw('SELECT:value值不能设置为空');
              // }
              // _jui.options[val]=getToH(_item);
              // if(_item.hasAttr('disabled')){
              //     _item.addClass('c-disabled').clk(function(){
              //         _stopPro(event);
              //     })
              // }else{
              //     _item.clk(function(){
              //         _jui.value=val;
              //     })
              // }
          });
          ow.clk(function(e){
            var obj=e.target;
            if(!obj.hasClass('j-option')){obj=obj.parent()}
            if(obj.hasClass('j-option')&&!obj.hasClass('c-disabled')){
              _jui.value=getVoT(obj);
            }
          })
          if(def){
            _jui.value=getVoT(def);
          }
          item.append([ow,vw]).clk(function(){
            if(!_isDisabled(this)){
              this.child(0).toggleClass('s-open');
              this.child(1).child(1).toggleClass('s-open');
            }
          },true);
          item.$jui=_jui;
        // }else{////绑定数据为[] 的select做特殊处理

        // }
        
        if(item.__jet!==undefined&&item.__jet.type==='Jfor'){//绑定数据的select做特殊处理
          item.__jet.originEle=item;
          item.__jet.ele=item.children[0];
          item.__jet.__addSelectOption=function(obj,isRemove){
            var val=getVoT(obj);
            if(isRemove===true){
              if(_jui.options[val]===undefined){
                delete _jui.options[val];
              }
              if(_jui._value===val){
                _jui.value='';
              }
            }else{
              if(_jui.options[val]===undefined){
                _jui.options[val]=getToH(obj);
              }
              if(ow.child().length===1){
                _jui.value=val;
              }
            }
          }
        }
      }
  });
};
//获取value或者text或者Html
var getVoT=function(o){
return ((o.hasAttr('value'))?o.attr('value'):getToH(o));
}
//visiable hidden的时候获取不到innerText
//获取text或者Html
var getToH=function(o){
  if(o.hasAttr('jhtml')){
    return o.html().trim();
  }
  return ((o.innerText==='')?o.html():o.txt()).trim();
}
/*MESSAGE**************************************** */
JUI.MESSAGE=function(opt){
  this.text=(opt.text===undefined)?'提示文字为空':opt.text;
  this.type=opt.type||JUI.MESSAGE.info;
  this.time=opt.time||2300;
  this.hover=opt.hover||true;
  this.autoClose=opt.autoClose;
  this.call=opt.call||null;
  this.html=opt.html||false;
  this.init();
  this.timer=null;
  if(this.autoClose!=false){
      this.start();
  }
};
JUI.MESSAGE.prototype=_createEmpty();
JUI.MESSAGE.prototype.pause=function(){
clearTimeout(this.timer);
};JUI.MESSAGE.prototype.start=function(){
var _this=this;
this.timer=setTimeout(function(){
  _this.close();
},this.time);
};JUI.MESSAGE.prototype.init=function(){
  var _this=this;
  this.ele=$J.ct('div.j-msg-w.'+this.type);
      var _i=$J.ct('i.j-icon.icon-'+JUI.MESSAGE.res.icon[this.type]+'.j-msg-i');
      var _c=$J.ct('i.j-icon.icon-times.j-msg-close');
      _c.clk(function(){
          _this.close();
      });
      var _t=$J.ct('div.j-msg-txt');
      if(_this.html===true){
        _t.html(this.text);
      }else{
        _t.txt(this.text);
      }
  this.ele.append([_i,_c,_t]);
  $J.body().append(this.ele);
  JUI.MESSAGE.msgList.push(this);
  setTimeout(function(){_this.ele.addClass('msg-open')},30);
  if(this.hover){
    _this.ele.onmouseenter=function(){
      _this.pause();
    };
    _this.ele.onmouseleave=function(){
      _this.start();
    };
  }
};JUI.MESSAGE.prototype.close=function(){
  this.ele.removeClass('msg-open');
  clearTimeout(this.timer);
  var _this=this;
  setTimeout(function(){
      _this.ele.remove();
      if(_this.call){
          _this.call();
      }
      JUI.MESSAGE.msgList.splice(JUI.MESSAGE.msgList.indexOf(_this),1);
  },300);
};
JUI.MESSAGE.msgList=[];
JUI.MESSAGE.success='success';
JUI.MESSAGE.warn='warn';
JUI.MESSAGE.error='error';
JUI.MESSAGE.info='info';
JUI.MESSAGE.res={
  color:{
      success:"#2ac32f",
      warn:"#dfa02b",
      error:"#dc5454",
      info:"#9e9e9e"
  },icon:{
      success:"check-circle",
      warn:"exclamation-sign",
      error:"remove-sign",
      info:"info-sign"
  }
}

// JUI.msg({
//     text:'text',
//     time:2000,
//     type:'warn',
//     autoClose:true,
//     call:function(){console.log('close')},
// })
/*CONFIRM***************************************** */
JUI.CONFIRM=function(opt){
  this.title=opt.title||'确认框'
  this.text=opt.text||'是否确认该操作？';
  this.type=opt.type||null;
  this.onconfirm=opt.onconfirm||null;
  this.oncancel=opt.oncancel||null;
  this.onclose=opt.onclose||null;
  this.html=opt.html||false;
  this.init();
};
JUI.CONFIRM.prototype=_createEmpty();
JUI.CONFIRM.prototype.init=function(){
  var _this=this;
  this.ele=$J.ct('div.j-confirm');
      var _close=$J.ct('i.j-confirm-close.j-icon.icon-times');
      var _t=$J.ct('div.j-confirm-t');
          if(this.type!=null){
              _t.addClass(this.type).append($J.ct('i.j-icon.icon-'+JUI.CONFIRM.res.icon[this.type]));
          }
      _t.append($J.ct('span').txt(this.title));
      var _c=$J.ct('div.j-confirm-c');
      if(_this.html===true){
        _c.html(this.text);
      }else{
        _c.txt(this.text);
      }
      var _b=$J.ct('div.j-confirm-bw');
          var _ok=$J.ct('button.j-confirm-b.j-btn').txt('确定');
          var _cancel=$J.ct('button.j-confirm-b.j-btn.info').txt('取消');
      _b.append([_ok,_cancel]);
  this.ele.append([_close,_t,_c,_b]);
  _close.clk(function(){
      _this.close();
  });
  _ok.clk(function(){
      if(_this.onconfirm){
          _this.onconfirm();
      }
      _this.close();
  });
  _cancel.clk(function(){
      if(_this.oncancel){
          _this.oncancel();
      }
      _this.close();
  });
  $J.body().append(this.ele);
  new JUI.SCREEN_DRAG({
      ele:this.ele,
      drag:this.ele,
      type:'confirm'
  });
  JUI.CONFIRM.confirmList.push(this);
};JUI.CONFIRM.prototype.close=function(){
  this.ele.addClass('j-confirm-hide');
  var _this=this;
  if(_this.onclose){
      _this.onclose();
  }
  setTimeout(function(){
      _this.ele.remove();
      JUI.CONFIRM.confirmList.splice(JUI.CONFIRM.confirmList.indexOf(_this),1);
  },500);
};
JUI.CONFIRM.confirmList=[];
JUI.CONFIRM.success='success';
JUI.CONFIRM.warn='warn';
JUI.CONFIRM.error='error';
JUI.CONFIRM.info='info';
JUI.CONFIRM.res={
  color:{
      success:"#2ac32f",
      warn:"#dfa02b",
      error:"#dc5454",
      info:"#9e9e9e"
  },icon:{
      success:"check-circle",
      warn:"exclamation-sign",
      error:"remove-sign",
      info:"info-sign"
  }
}

// JUI.confirm({
//     title:"title",
//     text:'text',
//     type:'warn',
//     onconfirm:function(){console.log('confirm')},
//     oncancel:function(){console.log('cancel')},
//     onclose:function(){console.log('close')},
// })
/*RADIO_GROUP************************************************************/
JUI.RADIO_GROUP=function(opt){
  this.ele=opt.ele||null;
  this._value=opt.value||'';
  this.onchange=opt.onchange||function(){};
  var _this=this;
  this.radioList=[];
  Object.defineProperty(_this,'value',{
      configurable:true,
      get:function(){
          return _this._value;
      },set:function(v){
          _this._value=v;
          _this.onchange.call(_this);
      }
  });
};
JUI.RADIO_GROUP.prototype=_createEmpty();
JUI.RADIO_GROUP.prototype.removeAll=function(){
  this.value=[];
  this.radioList=[];
};
JUI.RADIO_GROUP.prototype.remove=function(i){
  if(typeof i==='number'){
    this.radioList.removeByIndex(i);
  }else{
    this.radioList.remove(i);
  }
};
JUI.RADIO_GROUP.prototype.clear=function(){
  this.radioList.forEach(function(radio){
    radio.checked=false;
  });
  this.value=[];
};
JUI.RADIO_GROUP._name='j-radio-group';
JUI.RADIO_GROUP.def_r_group=null;
JUI.RADIO_GROUP.init=function(item,checkParGroup){
  getEleList(item,this._name).each(function(item){
    if(!item._hasInitJui){
      item._hasInitJui=true;
      _initOneRadioGroup(item);
    }
  });
  if(checkParGroup===true){//for循环添加元素的时候
    getEleList(item,JUI.RADIO._name).each(function(item){
      if(!item._hasInitJui){
        JUI.RADIO.init({
          ele:item,
          group:_findGroupPar(item,JUI.RADIO_GROUP._name)
        });
      }
    });
  }else{
    _initOneRadioGroup($J.body(),true);
  }
};
function _initOneRadioGroup(item,isBody){
  if(!isBody&&item.findClass(JUI.RADIO_GROUP._name).length>0){
      _throw('radio group 不支持嵌套使用');
  }
  var _jui;
  if(isBody){
      JUI.RADIO_GROUP.def_r_group=new JUI.RADIO_GROUP({ele:$J.ct('div.'+JUI.RADIO_GROUP._name)});
      _jui=JUI.RADIO_GROUP.def_r_group;
      _jui.ele.$jui=_jui;
  }else{
      _jui=new JUI.RADIO_GROUP({ele:item});
      item.$jui=_jui;
  }
  _jui.onchange=function(){
      _jui.ele.attr('value',_jui._value);
      var _c=_jui.radioList.filter(function(item){
          return item.ele.hasClass('j-checked')
      });
      if(_c.length>0)_c[0].$checked=false;
      _c=_jui.radioList.filter(function(radio){
          return radio.value==_jui.value;
      });
      if(_c.length>0&&_c[0]._checked==false)_c[0].$checked=true;
      if(_jui._onchange){
          var __t=_jui.jet||_jui;
          _jui._onchange.call(__t,{
              ele:item,
              value:_jui._value,
              jui:_jui
          })
      }
  }

  var arr=[];
  // if(item.hasClass('aaa'))
  // console.log('aa')
  
  item.findClass(JUI.RADIO._name).each(function(radio){
      if(!radio._hasInitJui){
          var value=getVoT(radio);
          if(arr.indexOf(value)!=-1)
              _throw('同一组 radio 中不允许有相同的value值');
          arr.push(value);
          radio._hasInitJui=true;
          var r_jui=new JUI.RADIO({ele:radio,text:getToH(radio),value:value,group:_jui});
          if(r_jui.checked){
              _jui.value=r_jui.value;
          }
      }
  });
  // if(item.hasAttr('checked')&&item.attr('checked')!='false'){
  //     _jui.checked=true;
  // }
}
/*RADIO*************************************************************/
var _jui_type='jui-type';
function _getJuiType(ele){
  return (ele)?ele.attr(_jui_type):null;
}
function _checkJUIType(type,value){
  if(type===null){
    return value;
  }
  switch(type){
    case 'bool':return (value==='true');break;
    case 'number':return parseFloat(value);break;
    case 'string':return value.toString();break;
    default:return value;break;
  }
}
JUI.RADIO=function(opt){
  this.ele=opt.ele||null;
  this._checked=opt.checked||false;
  this.onchange=opt.onchange||function(){};
  this.text=opt.text||'';
  this.group=opt.group||null;
  this._juiType=_getJuiType(opt.ele);
  this.value=_checkJUIType(this._juiType,opt.value||getVoT(opt.ele));
  var _this=this;
  Object.defineProperties(_this,{
    'checked':{
      configurable:true,
      get:function(){
          return _this._checked;
      },set:function(v){
          if(typeof v!='boolean'){_throw('radio.checked只支持布尔类型')};
          if(_this._checked!=v){
              _this._checked=v;
              if(v==true){
                  _this.group.value=_this.value;
              }else{
                  _this.group.value='';
              }
              _this.onchange.call(_this);
          }
      }
    },
    '$checked':{
      configurable:true,
      get:function(){
          return _this._checked;
      },set:function(v){
          _this._checked=v;
          _this.onchange.call(_this);
      }
    }
  });
  this.init();
};
JUI.RADIO.prototype=_createEmpty();
JUI.RADIO.prototype.init=function(){
  //var _jui=new JUI.RADIO({ele:item,text:item.txt(),value:getVoT(item)});
  var _jui=this;
  var item=this.ele;
  item.html('<div class="j-radio-cw"><div class="j-radio-c"></div></div>'+
      '<span class="j-radio-t">'+_jui.text+'</span>');
  item.clk(function(){
    if(!_isDisabled(this)){
      _jui.group.value=_jui.value;
    }
  },true);
  _jui.onchange=function(){
      if(_jui.checked){
          _jui.ele.addClass('j-checked');
      }else{
          _jui.ele.removeClass('j-checked');
      }
      _jui.ele.attr('checked',_jui.checked);
      if(_jui._onchange){
          var __t=_jui.jet||_jui;
          _jui._onchange.call(__t,{
              ele:item,
              value:_jui._value,
              jui:_jui
          })
      }
  }
  if(item.hasAttr('checked')&&item.attr('checked')!='false'&&this.group.value==''){
      _jui.checked=true;
      this.group.value==_jui.value;
  }else{
      item.attr('checked','false');
  }
  item.$jui=_jui;
  this.group.radioList.push(_jui);
};
JUI.RADIO.init=function(opt){
  if(!opt.ele._hasInitJui){
    opt.ele._hasInitJui=true;
    var group=opt.group||JUI.RADIO_GROUP.def_r_group;
    new JUI.RADIO({
      ele:opt.ele,
      group:group
    });
  }
};
JUI.RADIO._name='j-radio';
/*CHECKBOX_GROUP************************************************************/
JUI.CHECKBOX_GROUP=function(opt){
  this.ele=opt.ele||null;
  this._value=opt.value||[];
  this.onchange=opt.onchange||function(){};
  var _this=this;
  this.checkList=[];
  Object.defineProperty(_this,'value',{
      configurable:true,
      get:function(){
          return _this._value;
      },set:function(v){
          _this._value=v;
          _this.onchange.call(_this);
      }
  });


  //需重新定义 没有jet框架时的属性
};
JUI.CHECKBOX_GROUP.prototype=_createEmpty();
JUI.CHECKBOX_GROUP.prototype.selectAll=function(){
  this.checkList.forEach(function(check){
    check.checked=true;
  });
  return this.value;
};
JUI.CHECKBOX_GROUP.prototype.clear=function(){
  this.checkList.forEach(function(check){
    check.checked=false;
  });
  this.value=[];
};
JUI.CHECKBOX_GROUP.prototype.remove=function(i){
  if(typeof i==='number'){
    this.checkList.removeByIndex(i);
  }else{
    this.checkList.remove(i);
  }
};
JUI.CHECKBOX_GROUP.prototype.removeAll=function(){
  this.value=[];
  this.checkList=[];
};
JUI.CHECKBOX_GROUP._name='j-checkbox-group';
JUI.CHECKBOX_GROUP.def_c_group=null;
JUI.CHECKBOX_GROUP.init=function(item,checkParGroup){
  getEleList(item,this._name).each(function(item){
    if(!item._hasInitJui){
      item._hasInitJui=true;
      _initOneCheckGroup(item);
    }
  });
  if(checkParGroup===true){//for循环添加元素的时候
    getEleList(item,JUI.CHECKBOX._name).each(function(item){
      if(!item._hasInitJui){
        JUI.CHECKBOX.init({
          ele:item,
          group:_findGroupPar(item,JUI.CHECKBOX_GROUP._name)
        });
      }
    });
  }else{
    _initOneCheckGroup($J.body(),true);
  }
};
function _findGroupPar(ele,name){
  var p=ele.parent();
  while(!p.hasClass(name)&&p.tagName!='BODY'){
      p=p.parent();
  }
  if(p.tagName=='BODY'){
      return null;//在init 方法中，如果group是null，会使用默认的group
  }
  return p.$jui;
}
function _initOneCheckGroup(item,isBody){
  if(!isBody&&item.findClass(JUI.CHECKBOX_GROUP._name).length>0){
      _throw('checkbox group 不支持嵌套使用');
  }
  var _jui;
  if(isBody){
      if(JUI.CHECKBOX_GROUP.def_c_group===null){
        JUI.CHECKBOX_GROUP.def_c_group=new JUI.CHECKBOX_GROUP({ele:$J.ct('div.'+JUI.CHECKBOX_GROUP._name)});
      }
      _jui=JUI.CHECKBOX_GROUP.def_c_group;
      _jui.ele.$jui=_jui;
  }else{
      _jui=new JUI.CHECKBOX_GROUP({ele:item});
      item.$jui=_jui;
  }
  _jui.onchange=function(){
      _jui.ele.attr('value',_jui._value.toString());
      _jui.checkList.forEach(function(ele){
          if(_jui.value.has(ele.value)){
              if(ele._checked==false)ele.$checked=true;
          }else{
              if(ele._checked==true)ele.$checked=false;
          }
      });
      if(_jui._onchange){
          var __t=_jui.jet||_jui;
          _jui._onchange.call(__t,{
              ele:item,
              value:_jui._value,
              jui:_jui
          })
      }
  }
  item.findClass(JUI.CHECKBOX._name).each(function(check){
      if(!check._hasInitJui){
          check._hasInitJui=true;
          var r_jui=new JUI.CHECKBOX({ele:check,text:getToH(check),group:_jui});
          if(r_jui.checked){
              _jui.value.push(r_jui.value);
          }
      }
  });
  // if(item.hasAttr('checked')&&item.attr('checked')!='false'){
  //     _jui.checked=true;
  // }
}
/*CHECKBOX*************************************************************/
JUI.CHECKBOX=function(opt){
  this.ele=opt.ele||null;
  this._checked=opt.checked||false;
  this.onchange=opt.onchange||function(){};
  this.text=opt.text||'';
  this.group=opt.group||null;
  this._juiType=_getJuiType(opt.ele);
  this.value=_checkJUIType(this._juiType,opt.value||getVoT(opt.ele));
  var _this=this;
  Object.defineProperties(_this,{
    'checked':{
        configurable:true,
        get:function(){
          return _this._checked;
        },set:function(v){
          if(typeof v!='boolean')_throw('checkbox.checked只支持布尔类型');
          if(_this._checked!=v){
            _this._checked=v;
            if(v){
              if(!_this.group.value.has(_this.value)){
                _this.group.value.push(_this.value)
              }
            }else{
              if(_this.group.value.has(_this.value)){
                _this.group.value.removeByIndex(_this.group.value.indexOf(_this.value))
              }
            }
            _this.onchange.call(_this);
          }
        }
    },'$checked':{
      configurable:true,
      get:function(){
          return _this._checked;
      },set:function(v){
          _this._checked=v;
          _this.onchange.call(_this);
      }
    }
  });
  this.init();
};
JUI.CHECKBOX.prototype=_createEmpty();
JUI.CHECKBOX.prototype.init=function(){
  //var _jui=new JUI.CHECKBOX({ele:item,text:item.txt(),value:getVoT(item)});
  var _jui=this;
  var item=this.ele;
  item.html('<div class="j-checkbox-cw"><i class="j-icon icon-check j-checkbox-c"></i></div>'+
      '<span class="j-checkbox-t">'+_jui.text+'</span>');
      
  item.clk(function(){
    if(!_isDisabled(this)){
      var arr=_jui.group._value.clone();
      if(arr.has(_jui.value))arr.remove(_jui.value);
      else arr.push(_jui.value);
      _jui.group.value=arr;
    }
  },true);
  _jui.onchange=function(){
      if(_jui.checked){
          _jui.ele.addClass('j-checked');
      }else{
          _jui.ele.removeClass('j-checked');
      }
      _jui.ele.attr('checked',_jui.checked);
      if(_jui._onchange){
          var __t=_jui.jet||_jui;
          _jui._onchange.call(__t,{
              ele:item,
              value:_jui._value,
              jui:_jui
          })
      }
  }
  if(item.hasAttr('checked')&&item.attr('checked')!='false'&&this.group.value==''){
      _jui.checked=true;
      this.group.value==_jui.value;
  }else{
      item.attr('checked','false');
  }
  item.$jui=_jui;
  this.group.checkList.push(_jui);
};
JUI.CHECKBOX.init=function(opt){
if(!opt.ele._hasInitJui){
  opt.ele._hasInitJui=true;
  var group=opt.group||JUI.CHECKBOX_GROUP.def_c_group;
  new JUI.CHECKBOX({
    ele:opt.ele,
    group:group
  });
}
};
JUI.CHECKBOX._name='j-checkbox';
/*SWITCH****************************************** */
JUI.SWITCH=function(opt){
  this.ele=opt.ele||null;
  this._value=opt.value||false;
  this.onchange=opt.onchange||function(){};
  this._juiType=_getJuiType(this.ele);
  this.value=_checkJUIType(this._juiType,opt.value||'');
  this._valueList=opt._valueList||[];
  var _this=this;
  Object.defineProperty(_this,'value',{
      configurable:true,
      get:function(){
          return _this._value;
      },set:function(v){
          v=_checkJUIType(_this._juiType,v);
          if(_this._valueList.has(v)&&v!=_this.value){
              _this._value=v;
              _this.onchange();
          }
      }
  });
  this.init();
};
JUI.SWITCH.prototype=_createEmpty();
JUI.SWITCH.prototype.init=function(){
  //var _jui=new JUI.SWITCH({ele:item,text:item.txt(),value:getVoT(item)});
  var _jui=this;
  var item=this.ele;
  var child=item.child();
  if(child.length>0){
      if(child.length>2){
          _throw('switch 组件只能有两个元素');
      }
      var v=getVoT(child[0]);
      if(v==='')v=true;
      this._valueList.push(v);
      var _on_t=$J.ct('div.j-switch-t.j-st-on').txt(getToH(child[0])).attr('value',v);
      v=getVoT(child[1]);
      if(v==='')v=false;
      if(this._valueList[0]==v)_throw('switch 两个元素值不能相等');
      this._valueList.push(v);
      this._value=v;
      var _off_t=$J.ct('div.j-switch-t.j-st-off').txt(getToH(child[1])).attr('value',v);
      if(child[0].hasAttr('checked')){
          item.addClass('j-s-on');
          child[0].removeAttr('checked')
          this._value=this._valueList[0];
      }
      item.empty();
      item.append([_on_t,_off_t]);
  }else{
      item.empty();
      this._valueList=[true,false];
      this._value=false;
      if(item.hasAttr('on')){
          this._value=true;
          item.addClass('j-s-on');
          item.removeAttr('on');
      }
      var _on_t=$J.ct('div.j-switch-t.j-st-on').attr('value','true');
      var _off_t=$J.ct('div.j-switch-t.j-st-off').attr('value','false');
      this._valueList=[true,false];
      item.append([_on_t,_off_t]);
  }
  item.attr('value',this._value);
  item.append($J.ct('div.j-switch-c'));
  item.clk(function(){
    if(!_isDisabled(item)){
      if(_jui._valueList.indexOf(_jui._value)==0){
          _jui.value=_jui._valueList[1]
      }else{
          _jui.value=_jui._valueList[0]
      }
    }
  },true);
  _jui.onchange=function(){
      if(_jui._valueList.indexOf(_jui._value)==0){
          item.addClass('j-s-on');
      }else{
          item.removeClass('j-s-on');
      }
      item.attr('value',_jui._value);
      if(_jui._onchange){
          var __t=_jui.jet||_jui;
          _jui._onchange.call(__t,{
              ele:item,
              value:_jui._value,
              jui:_jui
          })
      }
  }
  item.$jui=_jui;
};
JUI.SWITCH._name='j-switch';
JUI.SWITCH.init=function(item){
  getEleList(item,this._name).each(function(item){
    if(!item._hasInitJui){
      item._hasInitJui=true;
      new JUI.SWITCH({ele:item});
    }
  });
};
/*DATE*********************** */
JUI.DATE=function(opt){
  var d=new Date();
  this.today=d;
  this.ele=opt.ele||null;
  this.needTime=false;
  this.detail=(this.ele.attr('jui-date-detail')==='true');//是否显示农历以及节日信息
  this._time={h:0,m:0,s:0};
  if(opt.ele.attr('jui-date-time')==='true'){
    this.needTime=true;
  }
  if(!opt.value){
    var value=this.ele.attr('value');
    if(value===null){
      opt.value=_dateToStr(d);
      if(this.needTime){
        opt.value+=' 00:00:00';
      }
    }else{
      opt.value=value;
    }
  }
  this._value=opt.value||'';
  this.onchange=opt.onchange||function(){};
  this._date=_dateToJson(d);
  var _this=this;
  this.max=this.ele.attr('jui-date-max');
  this.min=this.ele.attr('jui-date-min');
  if(this.max==='today'){
    this.max=strToDateJson(_dateToStr(d));
  }else if(typeof this.max==='string'){
    this.max=strToDateJson(this.max);
  }
  if(this.min==='today'){
    this.min=strToDateJson(_dateToStr(d));
  }else if(typeof this.min==='string'){
    this.min=strToDateJson(this.min);
  }
  Object.defineProperty(_this,'value',{
      configurable:true,
      get:function(){
          return _this._value;
      },set:function(v){
          _this._value=v;
          _this.onchange();
      }
  });
  this.init();
};
JUI.DATE.prototype=_createEmpty();
JUI.DATE.prototype.init=function(){
  //var _jui=new JUI.DATE({ele:item,text:item.txt(),value:getVoT(item)});
  var _jui=this;
  var item=this.ele;
  var _w=$J.ct('div.j-date-allw');
  var _close=$J.ct('i.j-icon.icon-times.j-date-close');
  var _d=$J.ct('div.j-date-w');
      var _dt=$J.ct('div.j-date-t.j-clearfix');
          var _dty=$J.ct('div.j-date-ty');
              var _dtyil=$J.ct('i.j-icon.icon-angle-left.j-date-icon');
              var _d_year=$J.ct('input.j-date-input[attr=text][value='+this._date.year+']');
              var _dtyir=$J.ct('i.j-icon.icon-angle-right.j-date-icon');
          _dty.append([_dtyil,_d_year,_dtyir]);
          var _dtm=$J.ct('div.j-date-ty');
              var _dtmil=$J.ct('i.j-icon.icon-angle-left.j-date-icon');
              var _d_month=$J.ct('input.j-date-input[attr=text][value='+fixNum(this._date.month)+']');
              var _dtmir=$J.ct('i.j-icon.icon-angle-right.j-date-icon');
          _dtm.append([_dtmil,_d_month,_dtmir]);
          _dtyil.clk(function(){
              var year=parseInt(_d_year.val())-1,month=parseInt(_d_month.val());
              _dtyil.next().val(year);

              resetDayList(_jui,_sw,year,month,
                  (year==_jui._date.year&&month==_jui._date.month)
                  ,_d_year,_d_month,true);
          });
          _dtyir.clk(function(){
              var year=parseInt(_d_year.val())+1,month=parseInt(_d_month.val());
              _dtyir.prev().val(year);
              resetDayList(_jui,_sw,year,month,
                  (year==_jui._date.year&&month==_jui._date.month)
                  ,_d_year,_d_month,true);
          });
          _dtmil.clk(function(){
              var year=parseInt(_d_year.val()),month=parseInt(_d_month.val());
              month=(month<=1)?12:month-1;
              _dtmil.next().val(fixNum(month));
              resetDayList(_jui,_sw,year,month,
                  (year==_jui._date.year&&month==_jui._date.month)
                  ,_d_year,_d_month,true);
          });
          _dtmir.clk(function(){
              var year=parseInt(_d_year.val()),month=parseInt(_d_month.val());
              month=(month>11)?1:month+1;
              _dtmir.prev().val(fixNum(month));
              resetDayList(_jui,_sw,year,month,
                  (year==_jui._date.year&&month==_jui._date.month)
                  ,_d_year,_d_month,true);
          });
          _d_year.on('input',function(){
              if(/^([12]\d{3})$/.test(this.val())){
                  var year=parseInt(this.val()),month=parseInt(_d_month.val());
                  resetDayList(_jui,_sw,year,month,
                      (year==_jui._date.year&&month==_jui._date.month)
                      ,_d_year,_d_month,true);
              }
          });
          _d_month.on('input',function(){
              var month=parseInt(this.val());
              if(month>0&&month<13){
                  var year=parseInt(_d_year.val());
                  resetDayList(_jui,_sw,year,month,
                      (year==_jui._date.year&&month==_jui._date.month)
                      ,_d_year,_d_month,true);
                  this.val(fixNum(month));
              }
          });
      _dt.append([_dty,_dtm]);

      var _dw=$J.ct('div.j-date-dw.j-clearfix');
      ['日','一','二','三','四','五','六'].forEach(function(name){
          _dw.append($J.ct('div.j-date-di').txt(name));
      });
      var _sw=$J.ct('div.j-date-sw.j-clearfix');
      var _d_today=$J.ct('div.j-date-today').txt('今:'+_dateToStr(_jui.today));
      _d_today.on({
          click:function(){
              if(_isInRange(_jui,_jui.today)===true){
                  _chooseAdate(_dateToJson(_jui.today),_jui,this.prev());
              }else{
                  JUI.msg.warn('选择的日期超过了限制的范围');
              }
          },
          mouseenter:function(){
              var d=_dateToJson(_jui.today)
              _jui.showDetail(d.day,d.year,d.month);
          },mouseleave:function(){
              _jui.hideDetail();
          }
      });
      //resetDayList(_jui,_sw,this._date.year,this._date.month,true,_d_year,_d_month);
  _d.append([_dt,_dw,_sw,_d_today]);
  if(this.detail===true){
    var _detail=$J.ct('div.j-date-detail');
    var _converter=new CalendarConverter();

    _jui.showDetail=function(day,year,month){
      _detail.empty();
      year=year||_d_year.val();
      month=parseInt(month||_d_month.val());
      var d=_converter.solar2lunar(new Date(year,month-1,day));
      var txt=[];
      txt.push('<div>'+year+'年'+month+'月'+day+'日 周'+d.week+'</div>');
      var fes='';
      if(d.solarFestival!==''){
        fes+=d.solarFestival+' ';
      }
      if(d.lunarFestival!==''){
        fes+=d.lunarFestival;
      }
      if(fes!==''){
        txt.push('<div><span>节日: </span>'+fes+'</div>');
      }
      txt.push('<div class="j-date-no-b"><span>农历:</span><br>'+d.lYear+'('+d.lunarYear+')年'+d.lunarMonth+'月'+d.lunarDay+'</div>');
      txt.push('<div></div>');
      txt.push('<div>['+d.cYear+'年'+d.cMonth+'月'+d.cDay+'日]</div>');
      if(d.solarTerms!==''){
        txt.push('<div><span>节气: </span>'+d.solarTerms+'</div>');
      }
      _detail.html(txt.join(''));
      _detail.show();
    }
    _jui.hideDetail=function(){
      _detail.hide();
    }
    _d.append(_detail);
  }
  
  _w.append([_d,_close]);
  var _time_dreg=/^((0[0-9])|(1[0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])$/;
  if(this.needTime){
    var _t=$J.ct('div.j-time-w');
    var _t_tw=$J.ct('div.j-tt-w');
      var _t_t_info=$J.ct('div.j-tt-info.j-clearfix');
      _t_t_info.append([$J.ct('div').txt('时'),$J.ct('div').txt('分'),$J.ct('div').txt('秒')])
    _t_tw.append([$J.ct('div').txt('选择时间'),_t_t_info])
    var _t_cw=$J.ct('div.j-tc-w.j-clearfix');
      var _hour=$J.ct('div.j-ti-w');
        for(var i=0;i<24;i++){
          _hour.append($J.ct('div').txt(fixNum(i)));
        }
      var _min=$J.ct('div.j-ti-w');
        for(var i=0;i<60;i++){
          _min.append($J.ct('div').txt(fixNum(i)));
        }
      var _sec=$J.ct('div.j-ti-w');
        for(var i=0;i<60;i++){
          _sec.append($J.ct('div').txt(fixNum(i)));
        }
    _t_cw.append([_hour,_min,_sec]);
    _t_cw.child().clk(function(e){
      var time=e.target.txt();
      this.attr('value',time);
      this.findClass('j-active').removeClass('j-active');
      e.target.addClass('j-active');
      switch(this.index()){
        case 0:_jui._time.h=parseInt(time);break;
        case 1:_jui._time.m=parseInt(time);break;
        case 2:_jui._time.s=parseInt(time);break;
      }
      _jui.value=_jui._value.split(' ')[0]+" "+fixNum(_jui._time.h)+":"+fixNum(_jui._time.m)+":"+fixNum(_jui._time.s);
    });
    var _t_bw=$J.ct('div.j-tb-w');
      var _t_back=$J.ct('button.j-btn.info.xs').txt('返回日期');
      _t_back.clk(function(){
        resetDayList(_jui,_sw,_jui._date.year,_jui._date.month,true,_d_year,_d_month);
        _t.hide();
        _d.show();
      })
      var _t_now=$J.ct('button.j-btn.xs').txt('现在');
      _t_now.clk(function(){
        var d=new Date();
        _jui._date=_dateToJson(d);
        _jui._time={
          h:d.getHours(),
          m:d.getMinutes(),
          s:d.getSeconds()
        }
        _jui._value=_dateToStr(_jui._date);
        _jui.setTime(fixNum(_jui._time.h)+':'+fixNum(_jui._time.m)+':'+fixNum(_jui._time.s));
      });
      var _t_confirm=$J.ct('button.success.j-btn.xs').txt('确定');
      _t_confirm.clk(function(){
        _jui.close();
      });
    _t_bw.append([_t_back,_t_now,_t_confirm]);
    _t.append([_t_tw,_t_cw,_t_bw]);
    _w.append(_t);
    _jui.setTime=function(v){
      if(!_time_dreg.test(v)){
        return
      }
      var arr=v.split(':');
      _jui._time={h:parseInt(arr[0]),m:parseInt(arr[1]),s:parseInt(arr[2])};
      _jui.value=_jui._value.split(' ')[0]+" "+v;
      _t_cw.findClass('j-active').removeClass('j-active');
      _hour.attr('value',arr[0]).child(_jui._time.h).addClass('j-active');
      _hour.scrollTop=_jui._time.h*22;
      _min.attr('value',arr[1]).child(_jui._time.m).addClass('j-active');
      _min.scrollTop=_jui._time.m*22;
      _sec.attr('value',arr[2]).child(_jui._time.s).addClass('j-active');
      _sec.scrollTop=_jui._time.s*22;
    };
    _jui.showTime=function(){
      _t.show();
      _d.hide();
      _jui.setTime(_jui._value.split(' ')[1]);
    }
  }
  var _dv=$J.ct('input.j-date-v[type=text]')//[readonly=true]
  item.append([_w,_dv]);
  var _dreg=/^(([12]\d{3}-((0[1-9])|(1[0-2]))-((0[1-9])|([1-2]\d)|3(0|1))))$/;
  _jui.onchange=function(){
      var value=_jui._value;
      var d=new Date();
      if(d.getDate()!==_jui.today.getDate()){
        _jui.today=d;
        _d_today.txt('今:'+_dateToStr(d));
      }
      var r=_isInRange(_jui,strToDateJson(_jui._value));
      if(r!==true){
        if(r==='1'){
          _jui._value=_dateToStr(_jui.max);
        }else if(r==='-1'){
          _jui._value=_dateToStr(_jui.min);
        }
        if(_jui.needTime){
          _jui._value+=(' '+value.split(' ')[1]);
        }
        value=_jui._value;
        _jui.value=_jui._value;
      }
      if(_dreg.test(_getDate(value))&&_time_dreg.test(_getTime(value))){
          if(_jui.isFromInput!==true){
              _dv.val(value);
          }else{
            _jui.isFromInput=false;
          }
          item.attr('value',value);
          if(_jui._onchange){
              var __t=_jui.jet||_jui;
              _jui._onchange.call(__t,{
                  ele:item,
                  value:value,
                  jui:_jui
              })
          }
      }else{
          //_throw('DATE 格式错误：请修改为xxxx-xx-xx')
          
      }
  }
  item.$jui=_jui;
  if(_isDisabled(item)){
    _dv.attr('readonly','true')
  }
  _dv.clk(function(e){
      if(!_isDisabled(item)){
        _dv.removeAttr('readonly')
        if(!item.hasClass('j-active')){
            _w.css('display','block');
            if(_d.css('display')==='none'){
              _d.show();
              _t.hide();
            }
            setTimeout(function(){item.addClass('j-active')},30);
            if(!_dreg.test(_getDate(_jui._value))){
                resetDayList(_jui,_sw,_jui._date.year,_jui._date.month,true,_d_year,_d_month);
            }else{
                var _val_d=strToDateJson(_jui._value);
                resetDayList(_jui,_sw,_val_d.year,_val_d.month,
                    (_val_d.year==_jui._date.year&&_val_d.month==_jui._date.month)
                    ,_d_year,_d_month);
            }
        }
      }else{
        _dv.attr('readonly','true')
      }
  },true);
  _dv.oninput=function(){
      if(_dreg.test(_getDate(this.val()))&&_time_dreg.test(_getTime(this.val()))){
          this.css('color','#222');
          if((_isInRange(_jui,strToDateJson(this.val()))===true)){
            _jui.isFromInput=true;
          }
          _jui.value=this.val();
          if(_jui.needTime&&_d.css('display')==='none'){
            _jui.setTime(_getTime(_jui._value));
          }else{
            var _val_d=strToDateJson(_jui._value);
            resetDayList(_jui,_sw,_val_d.year,_val_d.month,
                    (_val_d.year==_jui._date.year&&_val_d.month==_jui._date.month)
                    ,_d_year,_d_month);
          }
      }else{
          this.css('color','#d44');
      }
  };
  _close.clk(function(){
      _jui.close();
  });
  this.value=this._value;
};JUI.DATE.prototype.close=function(){
  if(this.ele.hasClass('j-active')){
      var _this=this;
      this.ele.removeClass('j-active');
      setTimeout(function(){_this.ele.child(0).css('display','none');},300);
      this.ele.child(1).css('cursor','pointer');
  }
};
JUI.DATE._name='j-date';
JUI.DATE.init=function(item){
  getEleList(item,this._name).each(function(item){
    if(!item._hasInitJui){
      item._hasInitJui=true;
      new JUI.DATE({ele:item});
    }
  });
};
function _getDate(v){
  return (v.has(' '))?v.split(' ')[0]:v;
}
function _getTime(v){
  return (v.has(' '))?v.split(' ')[1]:'00:00:00';
}
function _dateToStr(date){
  var d=date||new Date();
  if(d.getFullYear){
    return d.getFullYear()+'-'+fixNum(d.getMonth()+1)+'-'+fixNum(d.getDate());
  }else{
    return d.year+'-'+fixNum(d.month)+'-'+fixNum(d.day)
  }
}
function _dateToJson(date){
  return {
      year:date.getFullYear(),
      month:date.getMonth()+1,
      day:date.getDate()
  };
}
function strToDateJson(v){
  var _dreg=/^(([12]\d{3}-((0[1-9])|(1[0-2]))-((0[1-9])|([1-2]\d)|3(0|1))))$/;
  if(_dreg.test(_getDate(v))){
      var arr=v.split('-');
      return {
          year:parseInt(arr[0]),
          month:parseInt(arr[1]),
          day:parseInt(arr[2])
      }
  }
  return {};
}
function fixNum(d){return (d<10)?'0'+d:d};
function _isInRange(jui,year,month,day){
  var d;
  if(typeof year==='object'){
      if(year.getFullYear){
          d=year;
      }else{
          d=new Date(year.year,year.month-1,year.day);
      }
  }else{
      d=new Date(year,month-1,day);
  }
  if(jui.max===null&&jui.min===null){
    return true;
  }
  if(jui.max!==null&&new Date(jui.max.year,jui.max.month-1,jui.max.day)<d){
    return '1';
  }
  if(jui.min!==null&&new Date(jui.min.year,jui.min.month-1,jui.min.day)>d){
      return '-1';
  }
  return true;
}
function resetDayList(_jui,ele,year,month,isCur,_d_year,_d_month,bool){
  var isCurM=false;
  ele.empty();
  var d=strToDateJson(_jui._value);
  getAllDaysList(year,month).forEach(function(day){
      if(day==1&&!isCurM){
          isCurM=true;
      }else if(day==1&&isCurM){
          isCurM=false;
      }
      var range=(_isInRange(_jui,year,month,day)===true);
      var item;
      if(isCurM&&range){
          item=$J.ct('div.j-date-si'+
              ((isCur&&day==_jui.today.getDate())?'.j-date-current':'')+
              ((d.year==year&&d.month==month&&d.day==day)?'.j-active':'')).txt(day).clk(function(){
                _chooseAdate({
                  year:parseInt(_d_year.val()),
                  month:parseInt(_d_month.val()),
                  day:day
                },_jui,this.parent());
            });
      }else{
          if(!bool){
              _d_year.val(d.year);
              _d_month.val(fixNum(d.month));
          }
          item=$J.ct('div.j-date-si.j-disabled').txt(day);
          if(!range&&isCurM){
            item.addClass('j-date-overflow').clk(function(){
              JUI.msg.warn('选择的日期超过了限制的范围')
            })
          }
      }
      if(isCurM&&_jui.detail===true){
        item.on({
          mouseenter:function(){
            _jui.showDetail(day);
          },mouseleave:function(){
            _jui.hideDetail();
          }
        });
      }
      ele.append(item);
  });
}
function _chooseAdate(d,_jui,sw){
  _jui._date=d;
  var date=_dateToStr(_jui._date);
  sw.findClass('j-active').removeClass('j-active');
  if(_jui.needTime){
    _jui.showTime();
    _jui.value=date+" "+_jui._value.split(' ')[1];
  }else{
    _jui.value=date;
    _jui.close();
  }
}
function getAllDaysList(year,month){
  var list=[];
  var first=getFirstDay(year,month);//第一天是星期几，上一个月剩余几天
  var days=getDays(year,month);
  var lastDays=(month==1)?getDays(year-1,12):getDays(year,month-1);
  for(var i=lastDays-first+1;i<=lastDays;i++){
      list.push(i);
  }
  for(var i=1;i<=days;i++){
      list.push(i);
  }
  var lastDay=getLastDay(year,month); 
  for(var i=1;i<=6-lastDay;i++){
      list.push(i);
  }
  return list;
}
function getDays(year,month){
  return new Date(year, month, 0).getDate(); 
}
function getLastDay(year,month){
  return new Date(year, month, 0).getDay(); 
}
function getFirstDay(year,month){
  return new Date(year,month-1,1).getDay(); 
}
function getCurrentDay(){
  return new Date().getDate(); 
}


/*DRAG*********************************** */
JUI.DRAG=function(opt){
  this.ele=opt.ele;
  this.par=opt.par||this.ele.parent();
  this._w=this.ele.wid()/2;
  this._h=this.ele.hei()/2;
  this.x=opt.x||-this._w;
  this.y=opt.y||-this._h;
  this.mode=opt.mode||'xy';
  this.onchange=opt.onchange||function(){};
  this.init();
};
JUI.DRAG.prototype=_createEmpty();
JUI.DRAG.prototype.init=function(){
  var _this=this;
  this.setPosition();
  this.par.on('mousedown',function(ev){
      var oEvent=ev||event;
      var pw=_this.par.wid();
      var ph=_this.par.hei();
      var ew=_this.ele.wid();
      var eh=_this.ele.hei();

      var o=_this.par.getBoundingClientRect();
      _this.x=oEvent.clientX-o.left;
      _this.y=oEvent.clientY-o.top;
      
      // _this.x=oEvent.layerX;
      // _this.y=oEvent.layerY;
      _this.setPosition();
      var disX=oEvent.clientX-_this.ele.offsetLeft; //鼠标的X坐标减去DIV的左边距就等于disX, 这个disXs是用于确定鼠标移动DIV时鼠标点和DIV之间的左面距离，这个距离是不会变的，通过这个新鼠标的X坐标减去disX就是DIV的Left
      var disY=oEvent.clientY-_this.ele.offsetTop; //鼠标的Y坐标减去DIV的左边距就等于disY, 这个disY是用于确定鼠标移动DIV时鼠标点和DIV之间的上面距离，这个距离是不会变的，通过这个新鼠标的Y坐标减去disY就是DIV的Top
      _this.par.onmousemove=function(ev){//为了防止鼠标移动太快而离开了DIV产生了bug，所以要给整个页面加onmousemove事件
          var oEvent=ev||event;
          var oLeft=oEvent.clientX-disX; //新鼠标X坐标减去disX,也就是鼠标移动DIV后的Left
          var oTop=oEvent.clientY-disY; //新鼠标Y坐标减去disY,也就是鼠标移动DIV后的Top
          if(oLeft<-ew/2){//当DIV的Left小于0，也就是移出左边
              oLeft=-ew/2; //就把DIV的Left设置为0，就不能移出左边
          }else if(oLeft>pw-ew/2){//屏幕宽度减去DIV的宽度就得出了DIV到达最右边的宽度，如果Left大于这个像素
              oLeft=pw-ew/2; //就把Left设置为这个像素
          }
          if(oTop<-eh/2){//当DIV的To小于0，也就是移出左边
              oTop=-eh/2; //就把DIV的Top设置为0，就不能移出上边
          }else if(oTop>ph-eh/2){//屏幕高度减去DIV的高度就得出了DIV到达最下面边的像素，如果Top大于这个像素
              oTop=ph-eh/2; //就把Top设置为这个像素
          }
          _this.setPosition(oLeft,oTop);
          return false;
      };
      _this.par.onmouseleave=function(){
          //_this.par.onmousemove=null; //把鼠标移动清楚
          //_this.par.onmouseup=null; //把鼠标松开清楚
      }
      _this.par.onmouseup=function(){//鼠标松开时
          _this.par.onmousemove=null; //把鼠标移动清楚
          _this.par.onmouseup=null; //把鼠标松开清楚
      };
      return false;
  });
  document.documentElement.on('mousemove',function(e){
      if(_this.par.onmousemove)
          _this.par.onmousemove(e);
  },true);
  document.documentElement.on('mouseup',function(e){
      if(_this.par.onmouseup)
          _this.par.onmouseup(e);
  },true);
  
};JUI.DRAG.prototype.setPosition=function(x,y,f){
  if(x){
      this.x=x;
  }
  if(y){
      this.y=y;
  }
  var d={
      x:(this.x+this._w)/this.par.wid(),
      y:(this.y+this._h)/this.par.hei()
  };
  if(this.mode=='x'){
      this.y=y=0;
      delete d.y;
  }else if(this.mode=='y'){
      this.x=x=0;
      delete d.x;
  }
  if(f==undefined)
      this.onchange(d);
  this.ele.css({
      left:this.x+'px',
      top:this.y+'px'
  });
};JUI.DRAG.prototype.setPositionByRate=function(x,y){
  this.setPosition(x*this.par.wid()-this._w,y*this.par.hei()-this._h,false);
}


/*COLOR****************************************/
JUI.COLOR=function(opt){
  this.ele=opt.ele||null;
  this._value=opt.value||'';
  this.onchange=opt.onchange||function(){};
  this.value=opt.value||'';
  this.showAlp=(opt.ele.hasAttr('alpha')&&opt.ele.attr('alpha')!='false');
  this._alpha=1;
  this._showColor={
      r:255,g:0,b:0
  };
  this._rangeColor={
      r:255,g:0,b:0,
      dr:0,dg:255,db:255
  }
  this._rate={
      x:1,y:0
  }
  var _this=this;
  Object.defineProperty(_this,'value',{
      configurable:true,
      get:function(){
          return _this._value;
      },set:function(v){
          _this._value=v;
          _this.onchange();
      }
  });
  this.init();
  if(this._value==''){
      if(this.showAlp){
          this.value=_jsonToRGB(this._showColor,this._alpha);
      }else{
          this.value=_jsonToSixteen(this._showColor);
      }
  }
};
JUI.COLOR.prototype=_createEmpty();
JUI.COLOR.prototype.init=function(){
  var _jui=this;
  var item=this.ele;
  var _cw=$J.ct('div.j-color-w');
      var _pick=$J.ct('div.j-color-pick');
      var _pc1=$J.ct('div.j-color-cover1');
      var _pc2=$J.ct('div.j-color-cover2');
      var _ps=$J.ct('div.j-color-pick-s');
      var _pca=$J.ct('div.j-color-cover-a');
      _pick.append([_pc1,_pc2,_ps,_pca]);
      var _range=$J.ct('div.j-color-range');
      var _rs=$J.ct('div.j-color-range-s');
      var _ra=$J.ct('div.j-color-range-a');
      _range.append([_rs,_ra]);
  _cw.append([_pick,_range]);
  var _colorc=$J.ct('div.j-color-bg');
  if(this.showAlp){
      var _alp=$J.ct('div.j-color-alp');
          var _ac=$J.ct('div.j-color-alp-color');
          var _as=$J.ct('div.j-color-alp-s');
          var _aa=$J.ct('div.j-color-alp-a');
          _alp.append([_ac,_as,_aa]);
      _cw.append(_alp);
      item.addClass('j-color-bg-alp');
  }
      var _vw=$J.ct('div.j-color-vw');
          var _v=$J.ct('input.j-color-v.j-input.s');
          var _bc=$J.ct('div.j-color-btn.j-btn.s.info').txt('清空');
          var _bok=$J.ct('div.j-color-btn.j-btn.s').txt('确定');
      _vw.append([_v,_bc,_bok]);
  _cw.append(_vw);
  var _icon=$J.ct('i.j-icon.j-color-icon.icon-chevron-down');
  item.append([_cw,_colorc,_icon]);
  var setColor=function(color){
      if(color==undefined){
          if(_jui.showAlp){
              color='rgba('+_jui._showColor.r+','+_jui._showColor.g+','+_jui._showColor.b+','+_jui._alpha+')';
          }else{
              color=_jsonToSixteen(_jui._showColor);
          }
      }
      if(_jui._isFromInput){
          _jui._isFromInput=false;
      }else{
          _v.val(color);
      }
      _colorc.css('background-color',color);
      var r=_jui._rangeColor;
      _pick.css('background-color','rgb('+r.r+','+r.g+','+r.b+')');
      if(_jui.showAlp){
          _ac.css('background','linear-gradient(to right, rgba('+r.r+', '+r.g+', '+r.b+', 0) 0%, rgb('+r.r+', '+r.g+', '+r.b+') 100%)');
      }
  }
  var close=function(){
      if(_jui.ele.hasClass('j-active')){
          _jui.ele.removeClass('j-active');
          setTimeout(function(){_jui.ele.child(0).css('display','none');},300);
      }
  };
  _bc.clk(function(){//clear
      if(_jui.showAlp){
          _jui.value='rgba(255,255,255,0)';
      }else{
          _jui.value='#ffffff';
      }
      close();
  });
  _bok.clk(function(){//ok
      _jui.value=_v.val();
      close();
  });
  _icon.clk(function(){
    if(!_isDisabled(item)){
      if(!item.hasClass('j-active')){
          _cw.css('display','block');
          setTimeout(function(){item.addClass('j-active')},30);
          _jui.onchange();
      }else{
          _jui.value=_v.val();
          close();
      }
    }
  },true);
  var color_drag=new JUI.DRAG({
      ele:_ps,
      par:_pca,
      onchange:function(d){
          d.x=1-d.x;
          _jui._rate.x=d.x;//记录上一次的位置
          _jui._rate.y=d.y;
          _jui._showColor.r=parseInt(_jui._rangeColor.r+d.x*_jui._rangeColor.dr);
          _jui._showColor.g=parseInt(_jui._rangeColor.g+d.x*_jui._rangeColor.dg);
          _jui._showColor.b=parseInt(_jui._rangeColor.b+d.x*_jui._rangeColor.db);
          _jui._showColor.r=parseInt(_jui._showColor.r-d.y*(_jui._showColor.r));
          _jui._showColor.g=parseInt(_jui._showColor.g-d.y*(_jui._showColor.g));
          _jui._showColor.b=parseInt(_jui._showColor.b-d.y*(_jui._showColor.b));
          setColor();
      }
  });
  var _split=1/6;
  var range_drag=new JUI.DRAG({
      ele:_rs,
      par:_ra,
      mode:'y',
      onchange:function(d){
          var rate=(d.y%_split)/_split;
          var pos=Math.floor(d.y/_split);
          var c1=255*rate;
          var c2=255-c1;
          var r=_jui._rangeColor;
          switch(pos){
              case 0:r.r=255;r.g=c1;r.b=0;break;
              case 1:r.r=c2;r.g=255;r.b=0;break;
              case 2:r.r=0;r.g=255;r.b=c1;break;
              case 3:r.r=0;r.g=c2;r.b=255;break;
              case 4:r.r=c1;r.g=0;r.b=255;break;
              case 5:r.r=255;r.g=0;r.b=c2;break;
              case 6:r.r=255;r.g=0;r.b=0;break;
          }
          r.dr=255-r.r;r.dg=255-r.g;r.db=255-r.b;
          r.r=Math.round(r.r);
          r.g=Math.round(r.g);
          r.b=Math.round(r.b);
          _pick.css('background-color','rgb('+r.r+','+r.g+','+r.b+')');
          var sc=_jui._showColor;
          sc.r=parseInt(r.r+_jui._rate.x*r.dr);
          sc.g=parseInt(r.g+_jui._rate.x*r.dg);
          sc.b=parseInt(r.b+_jui._rate.x*r.db);
          sc.r=parseInt(sc.r-_jui._rate.y*(sc.r));
          sc.g=parseInt(sc.g-_jui._rate.y*(sc.g));
          sc.b=parseInt(sc.b-_jui._rate.y*(sc.b));
          setColor();
      }
  });
  if(this.showAlp){
      var alpha_drag=new JUI.DRAG({
          ele:_as,
          par:_aa,
          mode:'x',
          onchange:function(d){
              _jui._alpha=parseFloat(d.x.toFixed(2));
              setColor();
          }
      });
  }
  _v.oninput=function(){
      _jui._isFromInput=true;
      if(_checkColorValid(this.val(),_jui.showAlp)){
          this.css('color','#222');
          _jui.value=this.val();
      }else{
          this.css('color','#d44');
      }
  };
  _jui.onchange=function(){
      if(_checkColorValid(_jui._value,_jui.showAlp)){
          var color=_jui._value;
          initParams.call(_jui);
          setColor();
          color_drag.setPositionByRate(1-_jui._rate.x,_jui._rate.y);
          range_drag.setPositionByRate(0,countRangeRate(_jui._rangeColor));
          if(_jui.showAlp)alpha_drag.setPositionByRate(_jui._alpha,0);
          item.attr('value',_jui._value);
          if(_jui._onchange){
              var __t=_jui.jet||_jui;
              _jui._onchange.call(__t,{
                  ele:item,
                  value:_jui._value,
                  jui:_jui
              })
          }
      }else{
      }
  }
  _cw.css('display','none');
  item.$jui=_jui;
};JUI.COLOR.prototype.close=function(){
  
};
JUI.COLOR._name='j-color';
JUI.COLOR.init=function(item){
  getEleList(item,JUI.COLOR._name).each(function(item){
    if(!item._hasInitJui){
      item._hasInitJui=true;
      new JUI.COLOR({ele:item});
    }
  });
};
function _checkColorValid(v,sa){
  var t=_whatTypeColor(v);
  if(t!='not'){
      if(((t=='sixteen'||t=='rgb')&&!sa)||(t=='rgba'&&sa)){
          return true;
      }
  }
  return false;
}
function initParams(){
  if(this._value.has('#')){
      this._showColor=_sixteenToJson(this._value);
  }else{
      this._showColor=_RGBToJson(this._value);
      if(this.showAlp)this._alpha=this._showColor.a;
  }
  var d=colorToRangeColor(this._showColor);
  this._rate=d.rate;
  this._rangeColor=d.rangeColor;
}
function colorToRangeColor(sc){
  if(sc.r==sc.g&&sc.b==sc.g&&sc.r==sc.b){
      return {
          rangeColor:{
              r:255,g:0,b:0,
              dr:0,dg:255,db:255
          },
          rate:{
              x:1,
              y:(255-sc.r)/255
          }
      }
  }
  // debugger;
  // var d={};
  // var max=Math.max(sc.r,sc.g,sc.b);
  // var min=Math.min(sc.r,sc.g,sc.b);
  // var y=max/255;
  // var x=min/max;
  // var rc={};
  // for(var k in sc){
  //   rc[k]=parseInt( ((sc[k]/(1-y)) - 255*x)/(1-x) );
  //   rc['d'+k]=255-rc[k];
  // }
  // return {
  //   rangeColor:rc,
  //   rate:{
  //     x:x,y:y
  //   }
  // };


  var d={};
  var max=Math.max(sc.r,sc.g,sc.b);
  var rate=255/max;
  d.y=1-1/rate;
  var temp={
      r:sc.r*rate,
      g:sc.g*rate,
      b:sc.b*rate,
      dr:255-sc.r*rate,
      dg:255-sc.g*rate,
      db:255-sc.b*rate,
  };
  var min=Math.min(temp.r,temp.g,temp.b);
  rate=min/(255-min);
  d.x=min/255;
  for(var k in temp){
      if(temp[k]!=min){
          temp[k]=Math.round(temp[k]-rate*(255-temp[k]));
      }else{
          temp[k]=0;
      }
  }
  return {
      rangeColor:temp,
      rate:d
  };
};
// f00->ff0->0f0->0ff->00f->f0f->f00
function countRangeRate(c){
  var _split=1/6;
  var rate;
  var index;
  if(c.b==0){//0,1
      if(c.r==255){//0
          index=0;
          rate=c.g/255;
      }else{
          index=1;
          rate=1-c.r/255;
      }
  }else{//2345
      if(c.b!=255){//25
        if(c.g==255){//2
          index=2;
          rate=c.b/255;
        }else{
          index=5;
          rate=1-c.b/255;
        }
      }else if(c.r==0){
        index=3;
        rate=1-c.g/255;
      }else{
        index=4;
        rate=c.r/255;
      }
  }
  return _split*(rate+index);
}
var _sixteenReg=/^#([0-9a-f]{3}|[0-9a-f]{6})$/;
var _sArr=['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
function _sixteenToJson(v){
  v=v.toLowerCase();
  if(_sixteenReg.test(v)){
      if(v.length==4){
          v=v[1]+v[1]+v[2]+v[2]+v[3]+v[3];
      }else{
          v=v.substring(1);
      }
      var c={};
      var t=['r','g','b'];
      for(var i=0;i<3;i++){
          c[t[i]]=_sixteenToNum(v.substring(i*2,(i+1)*2));
      }
      return c;
  }else{
      _throw('色值的16进制格式有误:'+v);
  }
}
function _whatTypeColor(v){
  v=v.toLowerCase();
  if(_sixteenReg.test(v)){
      return 'sixteen';
  }else{
      if(v.has('rgb')){
          var bool=true;
          var str=v.substring(v.indexOf('(')+1,v.indexOf(')')).split(',');
          if(str.length!=3&&str.length!=4){
              bool=false;
          }else{
              str.each(function(item){
                  var num=parseInt(item);
                  if(num.toString()=='NaN'||num<0||num>255){
                      bool=false;
                  }
              });
          }
          if(bool){
              if(v.has('rgba')){
                  return 'rgba';
              }else{
                  return 'rgb';
              }
          }else{
              return 'not';
          }
      }
  }
}
function _sixteenToNum(v){
  return _sArr.indexOf(v[0])*16+_sArr.indexOf(v[1]);
}
function _numToSixteen(v){
      //console.error('色co值的必须在0到255之间:'+v);
  if(v<0)v=0
  else if(v>255)v=255;
  return _sArr[Math.floor(v/16)]+_sArr[v%16];
}
function _jsonToSixteen(v){
  var c='#';
  for(var i in v){
      if(i!='a'){
          c+=_numToSixteen(parseInt(v[i]));
      }
  }
  return c;
}
function _RGBToJson(v){
  var str=v.substring(v.indexOf('(')+1,v.indexOf(')'));
  var arr=str.split(',');
  var c={};
  var t=['r','g','b'];
  for(var i=0;i<3;i++){
      var num=parseInt(arr[i])
      if(num<0||num>255){
          _throw('色值的rgb格式有误:'+v);
      }
      c[t[i]]=num;
  }
  if(arr.length==4){
      c.a=parseFloat(arr[3]);
      if(c.a<0||c.a>1){
          _throw('色值的rgb格式有误:'+v);
      }
  }
  return c;
}
function _jsonToRGB(v,a){
  if('a' in v){
      return 'rgba('+v.r+','+v.g+','+v.b+','+v.a+')';
  }else if(a!=undefined){
      return 'rgba('+v.r+','+v.g+','+v.b+','+a+')';
  }
  return 'rgb('+v.r+','+v.g+','+v.b+')';
}
// f00->ff0->0f0->0ff->00f->f0f->f00

//x:rgb -> r g-- b--
//<div class='j-slider' min='0' max='100' value='0'></div>
/*SLIDER**********************************************************/
JUI.SLIDER=function(opt){
  this.ele=opt.ele||null;
  this._value=opt.value||false;
  this.onchange=opt.onchange||function(){};
  this.value=opt.value||'';
  this.min=0;
  this.max=100;
  this.rate=0;
  var _this=this;
  Object.defineProperty(_this,'value',{
      configurable:true,
      get:function(){
          return _this._value;
      },set:function(v){
          _this._value=v;
          if(_this._value<_this.min)_this._value=_this.min;
          if(_this._value>_this.max)_this._value=_this.max;
          _this.onchange();
      }
  });
  this.init();
};
JUI.SLIDER.prototype=_createEmpty();
JUI.SLIDER.prototype.init=function(){
  var _jui=this;
  var item=this.ele;
  if(item.hasAttr('min'))_jui.min=parseFloat(item.attr('min'));
  if(item.hasAttr('max'))_jui.max=parseFloat(item.attr('max'));
  
  if(item.hasAttr('width')){
      var w=item.attr('width');
      if(!w.has('%')&&!w.has('px')){
          w=w+'px';
      }
      item.css('width',w);
  }
  var pw=item.wid();
  var bar=$J.ct('div.j-slider-bar');
  var c=$J.ct('div.j-slider-c');
  item.append(bar.append(c));
  var func=function(e){
      var o=item.getBoundingClientRect();
      var w=e.clientX-o.left;
      if(w>pw){w=pw;}
      if(w<0){w=0}
      _jui.value=_jui.min+(w/pw)*(_jui.max-_jui.min);
      _jui.onchange();
      return false;
  }
  _jui.onchange=function(){
      _jui.rate=(_jui.value-_jui.min)/(_jui.max-_jui.min);
      bar.css('width',(_jui.rate*100)+'%');
      item.attr('value',_jui._value);
      if(_jui._onchange){
          var __t=_jui.jet||_jui;
          _jui._onchange.call(__t,{
              ele:item,
              value:_jui._value,
              jui:_jui
          })
      }
  }
  if(item.hasAttr('value'))_jui._value=parseFloat(item.attr('value'));
  if(_jui._value<_jui.min)_jui._value=_jui.min;
  if(_jui._value>_jui.max)_jui._value=_jui.max;
  _jui.onchange();
  item.onclick=func;
  c.onmousedown=function(){
      c.onmousemove=func;
      item.onmousemove=func;
      return false;
  }
  c.onmouseup=function(){
      c.onmousemove=null;
      item.onmousemove=null;
  }
  item.onmouseup=function(){
      c.onmousemove=null;
      item.onmousemove=null;
  }
  document.documentElement.on('mousemove',function(e){
      if(c.onmousemove)
          c.onmousemove(e);
  },true);
  document.documentElement.on('mouseup',function(e){
      if(c.onmouseup)
          c.onmouseup(e);
  },true);
  item.attr('value',this._value);
  item.$jui=_jui;
};
JUI.SLIDER._name='j-slider';
JUI.SLIDER.init=function(item){
  getEleList(item,this._name).each(function(item){
    if(!item._hasInitJui){
      item._hasInitJui=true;
      new JUI.SLIDER({ele:item});
    }
  });
};
/*SCREEN_DRAG********************************** */
JUI.SCREEN_DRAG=function(opt){
  this.ele=opt.ele;
  this.drag=opt.drag||opt.ele;
  this._w=this.ele.wid()/2;
  this._h=this.ele.hei()/2;
  this.x=opt.x||-this._w;
  this.y=opt.y||-this._h;
  this.ondrag=opt.ondrag||function(){};
  this.ondrop=opt.ondrop||function(){};
  this.init(opt);
};
JUI.SCREEN_DRAG.prototype=_createEmpty();
JUI.SCREEN_DRAG._name='j-drag';
JUI.SCREEN_DRAG.prototype.init=function(opt){
  var _this=this;
  this.setPosition();
  _this.drag.on('mousedown',function(ev){
      var oEvent=ev||event;
      _stopPro(oEvent)
      var x=_this.ele.offsetLeft;
      var y=_this.ele.offsetTop;
      var sx=oEvent.clientX;
      var sy=oEvent.clientY;
      _this.drag.onmousemove=function(ev2){
          var e=ev2||event;
          var oLeft=x+(e.clientX-sx);
          var oTop=y+(e.clientY-sy);
          _this.setPosition(oLeft,oTop);
          return false;
      };
      _this.drag.onmouseup=function(){//鼠标松开时
          _this.drag.onmousemove=null; //把鼠标移动清楚
          _this.drag.onmouseup=null; //把鼠标松开清楚
      };
      return false;
  });
  document.documentElement.on('mousemove',function(e){
      if(_this.drag.onmousemove)
          _this.drag.onmousemove(e);
  },true);
  document.documentElement.on('mouseup',function(e){
      if(_this.drag.onmouseup)
          _this.drag.onmouseup(e);
  },true);
  var initPos=function(){
    _this.ele.css({
        left:(_this.ele.offsetLeft)+'px',
        top:(_this.ele.offsetTop)+'px',
        margin:'0'
    });
  }
  if(opt.type==='confirm'){
    setTimeout(function(){
      initPos();
    },700)
  }else{
    initPos();
  }
};JUI.SCREEN_DRAG.prototype.setPosition=function(x,y){
  this.x=x;
  this.y=y;
  this.ele.css({
      left:this.x+'px',
      top:this.y+'px'
  });
  this.ondrag();
};
JUI.SCREEN_DRAG._drag_area='j-drag-area';
JUI.SCREEN_DRAG.init=function(item){
getEleList(item,this._name).each(function(item){
  if(!item._hasInitJui){
    item._hasInitJui=true;
    var drag;
    var dragEle=item.findClass(JUI.SCREEN_DRAG._drag_area);
    if(dragEle.exist()){
      drag=dragEle;
    }else{
      drag=item;
      item.addClass(JUI.SCREEN_DRAG._drag_area);
    }
    new JUI.SCREEN_DRAG({
      ele:item,
      drag:drag
    });
  }
});
};
/* <div class='j-drag' style='background:#000;width:300px;height:300px;'>
  <div class='j-drag-area' style='background:#aaa;width:300px;height:100px;'>
      
  </div>
</div> */
/*DIALOG*************************************************************/
JUI.DIALOG=function(opt){
  this.ele=opt.ele||null;
  this.title=(opt.ele.hasAttr('dialog-title'))?opt.ele.attr('dialog-title'):'';
  this._nodrag=(opt.ele.attr('dialog-drag')==='false');
  this._noclose=(opt.ele.attr('dialog-close')==='false');
  this.onchange=opt.onchange||function(){};
  this._value=opt.value||false;
  var _this=this;
  Object.defineProperty(_this,'value',{
      configurable:true,
      get:function(){
          return _this._value;
      },set:function(v){
          _this._value=v;
          _this.onchange.call(_this);
      }
  });
};
JUI.DIALOG.prototype=_createEmpty();
JUI.DIALOG._name='j-dialog';
JUI.DIALOG._ds=[];
JUI.dialog={
  isOpen:function(){
    return ($J.cls('j-dialog-open j-dialog').exist())
  },clear:function(){
    JUI.DIALOG._ds.forEach(function(ele){
      ele.$jui.value=false
    });
  },removeAll:function(){
    JUI.DIALOG._ds.forEach(function(ele){
      ele.$jui.value=false
      setTimeout(function(){
        if(ele.parentNode)
          ele.remove();
      },500)
    });
    JUI.DIALOG._ds=[];
  }
};
JUI.DIALOG.init=function(item){
  getEleList(item,this._name).each(function(item){
    if(!item._hasInitJui){
      item._hasInitJui=true;
      var _jui=new JUI.DIALOG({ele:item});
      var childs=item.childNodes;
      var _head=$J.ct('div.j-dialog-head');
          var _t=$J.ct('div.j-dialog-title').txt(_jui.title);
      _head.append(_t);
      if(!_jui._noclose){
        var _i=$J.ct('i.j-icon.icon-times');
        _i.clk(function(){
            _jui.value=false;
        });
        _head.append(_i);
      }
      var _body=$J.ct('div.j-dialog-body');
          childs.each(function(_item){
              _body.append(_item);
          });
      item.append([_head,_body]);
      var itemHeight=item.hei();
      var itemWidth=item.wid();
      
      item.css({
        'margin-top':'0',
        'margin-left':'0'
      })
      var reinitTop=function(){
        item.css({
            'top':($J.height()-itemHeight)/2+'px',
            'left':($J.width()-itemWidth)/2+'px'
        });
      }
      _jui.reinitPos=function(){
        if(item.hei()!==itemHeight){
          itemHeight=item.hei();
          itemWidth=item.wid();
          reinitTop();
        }
      }
      reinitTop();
      _jui.onchange=function(){
          if(_jui._value){
            _jui.reinitPos();
            _jui.ele.css('visibility','visible');
            _jui.ele.addClass('j-dialog-open').removeClass('j-dialog-close');
          }else{
            _jui.ele.addClass('j-dialog-close').removeClass('j-dialog-open');
            setTimeout(function(){
              _jui.ele.css('visibility','hidden');
            },500);
            if(_jui._onclose){_jui._onclose.call(_jui.jet)}
          }
      };
      item.$jui=_jui;
      if(!_jui._nodrag){
        new JUI.SCREEN_DRAG({
            ele:item,
            drag:_head
        });
      }else{
        _head.css('cursor','default');
      }
      JUI.DIALOG._ds.push(item);
      // setTimeout(function(){
      //   document.body.append(item);
      // },300)
     
    }
  });
};
/*PAGE************************************* */
JUI.PAGE=function(opt){
  this.total=opt.total||10;
  this._value=opt.current||1;
  this.ele=opt.ele||null;
  this.call=opt.call||null;
  var _this=this;
  Object.defineProperty(_this,'value',{
      configurable:true,
      get:function(){
          return _this._value;
      },set:function(v){
          v=_this.checkValue(v);
          if(v!==_this._value){
            _this._value=v;
            _this.onchange();
          }
      }
  });
  this.init();
};
JUI.PAGE.prototype=_createEmpty();
JUI.PAGE.prototype.checkValue=function(v){
if(v<1){
  v=1;
}else if(v>this.total){
  v=this.total;
}
return v;
};
JUI.PAGE.prototype.init=function(){
var _jui=this;
var item=this.ele;
var _f=$J.ct('button.j-btn.s[title=首页]').html('<i class="j-icon icon-step-backward"></i>').clk(function(){
  _jui.value=1;
});
var _p=$J.ct('button.j-btn.s[title=上一页]').html('<i class="j-icon icon-chevron-left"></i>').clk(function(){
  _jui.value=_jui.value-1
});
var _page=$J.ct('span.j-page-text');
  var _cur=$J.ct('span').txt(_jui._value);
  var _split=$J.ct('span').txt(' / ');
  var _total=$J.ct('span').txt(_jui.total);
_page.append([_cur,_split,_total]);
var _input=$J.ct('input.j-input.s[type=number]').val(_jui.value);
var _j=$J.ct('button.j-btn.info.s[title=跳转]').html('<i class="j-icon icon-location-arrow"></i>').clk(function(){
  var v=this.prev().val();
  if(v!=='')_jui.value=parseInt(v);
});
var _n=$J.ct('button.j-btn.s[title=下一页]').html('<i class="j-icon icon-chevron-right"></i>').clk(function(){
  _jui.value=_jui.value+1
});
var _l=$J.ct('button.j-btn.s[title=末页]').html('<i class="j-icon icon-step-forward"></i>').clk(function(){
  _jui.value=_jui.total
});
item.append([_f,_p,_page,_input,_j,_n,_l]);
_jui.onchange=function(){
  _cur.txt(_jui._value);
  _input.val(_jui.value);
  if(_jui.call){
    _jui.call({
      current:_jui._value,
      total:_jui.total
    })
  }
  item.attr('value',this._value);
  if(_jui._onchange){
      var __t=_jui.jet||_jui;
      _jui._onchange.call(__t,{
          ele:item,
          value:_jui._value,
          jui:_jui
      })
  }
}
_jui.onchangetotal=function(){
  _total.txt(_jui.total);
  if(_jui.call){
    _jui.call({
      current:_jui._value,
      total:_jui.total
    })
  }
}
item.attr('value',this._value);
item.$jui=_jui;
};
JUI.PAGE._name='j-page';
JUI.PAGE.init=function(item){
getEleList(item,this._name).each(function(item){
  if(!item._hasInitJui){
    item._hasInitJui=true;
    new JUI.PAGE({ele:item});
  }
});
};
/*TAB********************************************** */
JUI.TAB=function(opt){
  this._value=opt.value||opt.ele.attr('value');
  this.ele=opt.ele||null;
  this.call=opt.call||null;
  this.tabs=[];
  var _this=this;
  Object.defineProperty(_this,'value',{
      configurable:true,
      get:function(){
          return _this._value;
      },set:function(v){
          v=_this.checkValue(v);
          if(v!==_this._value){
            _this._value=v;
            _this.onchange();
          }
      }
  });
  this.init();
  };
  JUI.TAB.prototype=_createEmpty();
  JUI.TAB.prototype.checkValue=function(v){
  if(this.tabs.indexOf(v.toString())!=-1){
    return v.toString();
  }
  return this.tabs[0];
  };
  JUI.TAB.prototype.init=function(){
  var _jui=this;
  var item=this.ele;
  var _active='j-tab-active';
  var childs=item.child();
  var _h=$J.ct('div.j-tab-head');
  var _b=$J.ct('div.j-tab-body');
  var index=0;
  childs.each(function(ele,i){
    var title=(ele.hasAttr('title'))?ele.attr('title'):ele.attr('value');
    var value=(ele.hasAttr('value'))?ele.attr('value'):ele.attr('title');
    var _tab=$J.ct('span').txt(title).clk(function(){
      if(!this.hasClass(_active)){
        _jui.value=this._j_tab_value;
      }
    });
    _tab._j_tab_value=value;
    _jui.tabs.push(value);
    if(i===0||value===_jui._value){
      _tab.addClass(_active);
      _h.append(_tab);
      if(i>0){
        _h.child(0).removeClass(_active);
        index=i;
      }
    }else{
      _h.append(_tab);
    }
    ele.addClass('j-tab-item');
    _b.append(ele);
  });
  _b.child(index).addClass(_active);
  item.append([_h,_b]);

  _jui.onchange=function(){
    var index=_jui.tabs.indexOf(_jui._value);
    item.findClass(_active).removeClass(_active);
    _h.child(index).addClass(_active);
    _b.child(index).addClass(_active);
    if(_jui.call){
      _jui.call({
        current:_jui._value,
        total:_jui.total
      })
    }
    item.attr('value',this._value);
    if(_jui._onchange){
        var __t=_jui.jet||_jui;
        _jui._onchange.call(__t,{
            ele:item,
            value:_jui._value,
            jui:_jui
        })
    }
  }

  item.attr('value',this._value);
  item.$jui=_jui;
};
JUI.TAB._name='j-tab';
JUI.TAB.init=function(item){
  getEleList(item,this._name).each(function(item){
    if(!item._hasInitJui){
      item._hasInitJui=true;
      new JUI.TAB({ele:item});
    }
  });
};

/*CODE********************************************** */
var _ce_btn="buttons",_ce_disabled="disabled",_ce_callback="callback",_ce_full="j_full",_ce_hidden="j_hidden",_def_w=300,_def_h=200;
var _code={
  _str:1,
  _key:["if","else","for","switch","while","try","catch","finally","new ","return","this","break",
      "default","case","continue","throw","throws","in ",//common
  "function","var","undefined","typeof",//js
  "important",//css
  "private","protected","public","abstract","static","void",
  "boolean","byte","char","int ","double","enum","const","final","float","long","short","true","True",
    "false","False","null","String","string","object",
  "assert","class ","do","extends","goto","implements","import","instanceof","interface","native",
    "package","strictfp","super","synchronized","transient","volatile",
  "operator","out ","override","params","readonly","ref","sbyte","sealed","sizeof","stackalloc",
  "struct","uint","ulong","unchecked","unsafe","ushort","using","virtual","void","volatile","as ",
  "base","bool","checked","decimal","delegate","event","explicit","extern","foreach","internal",
  "is ","lock","namespace"//c#
 ],
  _tag:3,
  _attr:4,
  _sign:["#","=","&gt;","&lt;","{","}","\\(","\\)","\\[","\\]",",","&&","\\.",
    "\\?","\\|","\\+","-",";\n",":","!","%","\\^"],//转义
};  
JUI.CODE=function(opt){
  this._value=opt.value||opt.ele.attr('value');
  this.ele=opt.ele||null;
  this.call=opt.call||null;
  this.lineHeight=22;
  var _this=this;
  Object.defineProperty(_this,'value',{
      configurable:true,
      get:function(){
          return _this._value;
      },set:function(v){
          if(v!==_this._value){
            _this._value=v;
            _this.onchange();
          }
      }
  });
  this.init();
};
JUI.CODE.prototype=_createEmpty();
JUI.CODE.prototype.init=function(){
  var _jui=this;
  var item=this.ele;
  _initFrame(item,_jui);
  _initCodeMain(item.findClass("code_editor"),_jui);
  
  _jui.onchange=function(){
    _jui.codearea.val(_jui._value);
    _geneViewCode.call(_jui);
    if(_jui.call){
      _jui.call({
        current:_jui._value,
        total:_jui.total
      })
    }
    if(_jui._onchange){
        var __t=_jui.jet||_jui;
        _jui._onchange.call(__t,{
            ele:item,
            value:_jui._value,
            jui:_jui
        })
    }
  }
  item.$jui=_jui;
};
JUI.CODE._name='j-code';
JUI.CODE.init=function(item){
  getEleList(item,this._name).each(function(item){
    if(!item._hasInitJui){
      item._hasInitJui=true;
      new JUI.CODE({ele:item});
    }
  });
};
function _initCodeMain(item,_jui){
  item.on({
    mouseleave:function(){
      //showResult(false);
    },
    keydown:function(event){
      _codeChange.call(_jui,event,this)
    },
    keyup:function(e){
      var k=e.keyCode;
      if(k==13||k==9){//回车和tab键
        _jui.value=this.value;
      }
      if(k==38||k==40||k==13||k==8){//上下 回车 删除
        _activeLine.call(_jui);
      }
    },
    input:function(){
      _jui.value=this.value;
    },
    scroll:function(event){
      _getView(_jui.ele).scrollTo(this.scroll(),null,10).scrollXTo(this.scrollX(),null,10);
    },
    click:function(){
      _activeLine.call(_jui);
      _jui.setActiveLine('show');
    },blur:function(){
      _jui.setActiveLine('hide');
    }
    //onclick:moveCursor
  });
  _tabEnable(item);
  item.each(function(_i){
    if(_i.parent().hasAttr('onload')){
      window[_i.parent().attr('onload')](item.parent());
    }
  });
}
function _initFrame(item,jui){
  if(item.findClass("code_editor").length==0){//防止两次初始化
    var cont=item.html()//.trim();
    if(!item.hasAttr('jui-code-trim')||item.attr('jui-code-trim')!=='false'){
      while(cont[0]=='\n'){
        cont=cont.substr(1);
      }
      cont=cont.replace(/(\s*$)/g,'')
    }
    var num=/^\d+$/;
    var w=item.hasAttr("width")?item.attr("width"):_def_w+"px";
    if(num.test(w)){
      w+="px";
    }
    var h=item.hasAttr("height")?item.attr("height"):_def_h+"px";
    if(num.test(h)){
      h+="px";
    }
    item.empty();
    var activeLine=$J.ct('div.code_active_line');
    item.append(activeLine);
    var c_view1=$J.ct("pre.code_editor_view._bottom").html(cont);
    item.append(c_view1);
    var c_view2=$J.ct("pre.code_editor_view").html(cont);
    item.append(c_view2);
    jui.view1=c_view1;
    jui.view2=c_view2;
    var ta=$J.ct("textarea.code_editor[spellcheck=false]").html(cont).data("code",cont);
    jui.codearea=ta;
    if(item.hasAttr(_ce_disabled)&&item.attr(_ce_disabled)!=='false'){
      ta.attr(_ce_disabled,_ce_disabled).css("cursor","no-drop");
    }
    item.append(ta);
    var needSubmit=false;
    if(item.hasAttr(_ce_callback)){
      needSubmit=true;
      item.code_callback=_checkFunction(item.attr(_ce_callback));
    }
    item.css({
      width:w,
      height:h
    });
    if(h=="auto"){
      jui.view1.css("height",h);
      jui.view2.css("height",h);
      jui.codearea.data("height","auto").css("overflow-y","hidden").css("height",h);
    }else{
      item.child().css("height","100%");
    }
    if(w=="auto"){
      jui.view1.css("width",h);
      jui.view2.css("width",h);
      jui.codearea.data("width","auto").css("overflow-x","hidden").css("width",w);;
    }else{
      jui.view1.css("width","100%");
      jui.view2.css("width","100%");
      jui.codearea.css("width","100%");
    }
    var mh=45;
    if(item.hasAttr(_ce_btn)){
      jui.view1.css("padding-top","40px");
      jui.view2.css("padding-top","40px");
      jui.codearea.css("padding-top","40px");
      mh+=40;
      var btn=item.attr(_ce_btn);
      var arr=[];
      if(btn==_ce_btn||btn=="true"||btn==""){
        $J.each(_buttons,function(item,attr){
          if(attr!="submit"||needSubmit){
            arr.push(_getButton(item,jui));
          }
        });
      }else{
        var ba=btn.split(";");
        ba.each(function(item){
          if(item!=""){
            if(item!="submit"||needSubmit){
              arr.push(_getButton(_buttons[item.toLowerCase()],jui));
            }
          }
        });
      }
      item.append($J.ct("div.code_set_w").append(arr));
    }
    var line=undefined;
    if(item.attr('jui-code-line')!=='false'){
      line=$J.ct("div.code_line_w");
      item.append(line);
      jui.reinitLine=function(){
        var len=line.children.length;
        var lines=jui.codearea.val().timeOf('\n')+1;
        if(lines>len){
          for(var i=1;i<=lines-len;i++){
            line.append($J.ct("div").txt(fixNum(len+i)));
          }
        }else if(lines<len){
          for(var i=lines;i<len;i++){
            line.child(lines).remove();
          }
        }
      }
    }
    jui.setActiveLine=function(index){
      if(index==='hide'){
        activeLine.css('opacity','0');
        if(line){
          line.findClass('j-active').removeClass('j-active')
        }
      }else if(index==='show'){
        activeLine.css('opacity','1')
      }else{
        var top=index*jui.lineHeight;
        activeLine.css('transform','translate(0,'+top+'px)');
        activeLine.css('-webkit-transform','-webkit-translate(0,'+top+'px)');
        if(line&&line.children.length>0){
          line.findClass('j-active').removeClass('j-active');
          line.child(index).addClass('j-active');
        }
      }
    }
    jui.setHeight=function(){
      if(line){
        line.child().css({
          height:jui.lineHeight+'px',
          'line-height':jui.lineHeight+'px'
        })
      }
      item.child(0).css('height',jui.lineHeight+'px')
    }
    item.css("min-height",mh+"px");
    if(cont!=""){
      _geneViewCode.call(jui);
    }
    if(window.navigator.userAgent.has("iPhone")){
      jui.view1.css("left","3px");
      jui.view2.css("left","3px");
    }
  }
}
function _getCurLine(obj){
    var v = obj.value;
    // 开始到光标位置的内容
    var cv = '';
    if ('selectionStart' in obj) {
        cv = v.substr(0, obj.selectionStart);
    } else if(document.createRange){
        var oSel = document.createRange();
        oSel.moveStart('character', -obj.value.length);
        cv = oSel.text;
    }else{
        var oSel = document.selection.createRange();
        oSel.moveStart('character', -obj.value.length);
        cv = oSel.text;
    }
    // 获取当前是几行
    var cl = cv.split('\n').length - 1;
    //console.log(cl);
    return cl;
}
var _buttons={
  fontsizeup:["fontSizeUp","放大字体","zoom-in"],
  fontsizedown:["fontSizeDown","缩小字体","zoom-out"],
  fullscreen:["fullScreen","全屏显示","expand-full"],//collapse-full
  fix:["fix","修复重影问题","wrench"],
  clearcolor:["clearColor","清除颜色","paint-brush"],
  clearcode:["clearCode","清除代码","trash"],
  resetcode:["resetCode","重置代码","undo"],
  copy:["copy","复制代码","copy"],
  submit:["submit","提交代码","share-sign"]
};
function _getButton(a,jui){
  return $J.ct("i.j-icon.icon-"+a[2]).clk(function(){
    jui[a[0]](this);
  }).tip(a[1]);
}

  JUI.CODE.prototype.fix=function(obj){
    if(obj.data("flag")){
      obj.data("flag",false);
      this.view1.css("left","3px");
      this.view2.css("left","3px");
    }else{
      obj.data("flag",true);
      this.view1.css("left","0px");
      this.view2.css("left","0px");
    }
  };
  JUI.CODE.prototype.clearColor=function(obj){
    this.codearea.toggleClass("bg");
    this.view1.fadeToggle();
    this.view2.fadeToggle();
  };
  JUI.CODE.prototype.clearCode=function(obj){
    JUI.confirm("是否确认清空代码(该操作不可撤销)？",function(){
      var par=this.ele;
      this.view1.empty();
      this.view2.empty();
      this.codearea.val("").focus();
    });
  };
  JUI.CODE.prototype.resetCode=function(obj){
    var _this=this;
    JUI.confirm("是否确认重置代码(该操作不可撤销)？",function(){
      var c=this.codearea;
      c.val(c.data("code").replaceAll('&lt;','<').replaceAll('&gt;','>')).focus();
      _geneViewCode.call(_this);
    });
  };
  JUI.CODE.prototype.copy=function(obj){
    if($J.isMobile()){
      JUI.msg('移动端不支持该方法',"warn");
    }else{
      if(this.codearea.copy()){
        JUI.msg('复制成功！','success');
      }else{
        this.codearea.select();
        JUI.msg("您的浏览器不支持该方法。请按Ctrl+V手动复制","info");
      }
    }
  };
  JUI.CODE.prototype.fullScreen=function(obj){
    this.ele.toggleClass(_ce_full);
    obj.toggleClass('icon-collapse-full');
    $J.body().toggleClass(_ce_hidden);
  };
  JUI.CODE.prototype.fontSizeUp=function(){
    var n=this.fontSize();
    if(n<35){
      this.fontSize(n+1);
    }else{
      JUI.msg("已达到最大大小(35px)",'warn')
    }
  };JUI.CODE.prototype.fontSizeDown=function(){
    var n=this.fontSize();
    if(n>12){
      this.fontSize(n-1);
    }else{
      JUI.msg("已达到最小大小(12px)",'warn')
    }
  };
  JUI.CODE.prototype.submit=function(){
    var par=this.ele;
    par.code_callback.call(this,this.codearea.val());
  };
  JUI.CODE.prototype.txt=function(txt){
    var c=this.codearea;
    if(typeof txt=='undefined'){
      return c.val();
    }else{
      c.val(txt).focus();
      _geneViewCode.call(this);
    }
  };
  JUI.CODE.prototype.fontSize=function(size){
    var par=this.ele;
    if(size!==undefined){
      this.lineHeight=size+4;
      this.setHeight();
      if(this.ele.attr("height")==='auto'){
        _geneViewCode.call(this);
      }
      par.css({
        "font-size":size+"px",
        "line-height":this.lineHeight+"px"
      });
    }else{
      var fs=par.css("font-size");
      return parseInt(fs.substring(0,fs.length-2));
    }
  }
  JUI.CODE.extend=function(a){
    if(typeof a=="array"){
      _code._key.appendArray(a);
    }else if(typeof a=="string"){
      _code._key.append(a);
    }else{
      throw new Error("extend:参数类型错误");
    }
  }
  JUI.CODE.tab='\t';//\t
  function _tabEnable(obj){
    obj.on("keydown",_keyDown,true);
  }
  function _keyDown(e) {
    var a =  JUI.CODE.tab;
    var b = a.length;
    if (e.keyCode === 9) {
      e.preventDefault();
      var c = this.selectionStart,
        currentEnd = this.selectionEnd;
      if (e.shiftKey === false) {
        if (!_isMultiLine(this)) {
          this.value = this.value.slice(0, c) + a + this.value.slice(c);
          this.selectionStart = c + b;
          this.selectionEnd = currentEnd + b
        } else {
          var d = _findStartIndices(this),
            l = d.length,
            newStart = undefined,
            newEnd = undefined,
            affectedRows = 0;
          while (l--) {
            var f = d[l];
            if (d[l + 1] && c != d[l + 1]) f = d[l + 1];
            if (f >= c && d[l] < currentEnd) {
              this.value = this.value.slice(0, d[l]) + a + this.value.slice(d[l]);
              newStart = d[l];
              if (!newEnd) newEnd = (d[l + 1] ? d[l + 1] - 1 : 'end');
              affectedRows++
            }
          }
          this.selectionStart = newStart;
          this.selectionEnd = (newEnd !== 'end' ? newEnd + (b * affectedRows) : this.value.length)
        }
      } else {
        if (!_isMultiLine(this)) {
          if (this.value.substr(c - b, b) == a) {
            this.value = this.value.substr(0, c - b) + this.value.substr(c);
            this.selectionStart = c - b;
            this.selectionEnd = currentEnd - b
          } else if (this.value.substr(c - 1, 1) == "\n" && this.value.substr(c, b) == a) {
            this.value = this.value.substring(0, c) + this.value.substr(c + b);
            this.selectionStart = c;
            this.selectionEnd = currentEnd - b
          }
        } else {
          var d = _findStartIndices(this),
            l = d.length,
            newStart = undefined,
            newEnd = undefined,
            affectedRows = 0;
          while (l--) {
            var f = d[l];
            if (d[l + 1] && c != d[l + 1]) f = d[l + 1];
            if (f >= c && d[l] < currentEnd) {
              if (this.value.substr(d[l], b) == a) {
                this.value = this.value.slice(0, d[l]) + this.value.slice(d[l] + b);
                affectedRows++
              } else {}
              newStart = d[l];
              if (!newEnd) newEnd = (d[l + 1] ? d[l + 1] - 1 : 'end')
            }
          }
          this.selectionStart = newStart;
          this.selectionEnd = (newEnd !== 'end' ? newEnd - (affectedRows * b) : this.value.length)
        }
      }
    } else if (e.keyCode === 13 && e.shiftKey === false) {
      cursorPos = this.selectionStart,
      d = _findStartIndices(this),
      numStartIndices = d.length,
      startIndex = 0,
      endIndex = 0,
      tabMatch = new RegExp("^" + a.replace('\t', '\\t').replace(/ /g, '\\s') + "+", 'g'),
      lineText = '';
      tabs = null;
      for (var x = 0; x < numStartIndices; x++) {
        if (d[x + 1] && (cursorPos >= d[x]) && (cursorPos < d[x + 1])) {
          startIndex = d[x];
          endIndex = d[x + 1] - 1;
          break
        } else {
          startIndex = d[numStartIndices - 1];
          endIndex = this.value.length
        }
      }
      lineText = this.value.slice(startIndex, endIndex);
      tabs = lineText.match(tabMatch);
      if (tabs !== null) {
        e.preventDefault();
        var h = tabs[0];
        var i = h.length;
        var j = cursorPos - startIndex;
        if (i > j) {
          i = j;
          h = h.slice(0, j)
        }
        this.value = this.value.slice(0, cursorPos) + "\n" + h + this.value.slice(cursorPos);
        this.selectionStart = cursorPos + i + 1;
        this.selectionEnd = this.selectionStart
      }
    }
  }
  function _isMultiLine(a) {
    var b = a.value.slice(a.selectionStart, a.selectionEnd),
      nlRegex = new RegExp(/\n/);
    if (nlRegex.test(b)) return true;
    else return false
  }
  function _findStartIndices(a) {
    var b = a.value,
      startIndices = [],
      offset = 0;
    while (b.match(/\n/) && b.match(/\n/).length > 0) {
      offset = (startIndices.length > 0 ? startIndices[startIndices.length - 1] : 0);
      var c = b.search("\n");
      startIndices.push(c + offset + 1);
      b = b.substring(c + 1)
    }
    startIndices.unshift(0);
    return startIndices;
  }


  function _codeChange(e,obj){
    if(obj.attr("jet-change")=="0"){
      obj.attr("jet-change","1");
    }
    if(e.keyCode==13||e.keyCode==9){
      _geneViewCode.call(this);
    }
    //_geneViewCode();
  }
  function _geneLine(){
    if(this.reinitLine)
      this.reinitLine();
  }
  function _activeLine(){
    var line=_getCurLine(this.codearea);
    this.setActiveLine(line);
  }
  function _geneViewCode(){
    //moveCursor();.replaceAll("<","&lt;").replaceAll(">","&gt;")
    var val=this.codearea.val()
    var html=val.replaceAll("<","&lt;").replaceAll(">","&gt;")+" ";//为了不让最后一个字符是换行
    html=_geneHtmlElement(html);
    html=_geneKey(html);
    html=_geneFun(html);
    //html=_geneDefineFun(html);
    html=_geneNumber(html);
    html=_geneString(html);
    html=_geneNote(html);
    html=_geneHtmlNote(html);
    _getView(this.ele,1).html(html); 
    
    var htmlSign=_geneSign(val.replaceAll("<","&lt;").replaceAll(">","&gt;")+" ");
    _getView(this.ele,0).html(htmlSign); 
    _checkSizeAuto(this.codearea);
    _geneLine.call(this);
  }
  function _getView(obj,i){
    if(i!=undefined){
      return obj.child(i+1);
    }
    return obj.findClass("code_editor_view");
  }
  function _checkSizeAuto(obj){
    _checkSizeAutoPart(obj,"height");
    _checkSizeAutoPart(obj,"width");
  }
  function _checkSizeAutoPart(obj,s){
    if(obj.data(s)=="auto"){
      var n=obj.prev().css(s);
      if(n=="auto"){
        setTimeout(function(){obj.css(s,obj.prev().css(s));},0);
      }else{
        obj.css(s,n);
      }
    }
  }

  function _geneSign(html){
    _code._sign.each(function(a){
      html=html.replaceAll(a,"<cd_sign>"+(a.has("\\")?a.substring(1):a)+"</cd_sign>");
    });
    return html;
  }
  function _geneDefineFun(html){//js
    var dFun=html.match(/(function)(.*?)(<)/g);
    if(dFun!=null){
      dFun.each(function(a,i){
        dFun[i]=a.substring(a.lastIndexOf(" ")+1,a.length-1);
      });
      dFun.sortByAttr("length",false);
      dFun.each(function(a,i){
        if(a!=""&&a!="function"){//匿名函数排除掉
          html=html.replaceAll(a,"<cd_dfun>"+a+"</cd_dfun>");
        }
      });
    }
    return html;
  }
  var _funReg=/(\.)(.*?)(\()/g;
  function _geneFun(html){
    var arr=html.match(_funReg);
    if(arr!=null){
      arr.each(function(a,i){
        arr[i]=arr[i].replace(a,a[0]+"<cd_fun>"+a.substring(1,a.length-1)+"</cd_fun>(");
      });
      return html.replaceAll(_funReg,arr);
    }
    return html;
  }
  function _geneKey(html){
    _code._key.each(function(a){
      html=html.replaceAll(a,"<cd_key>"+a+"</cd_key>");
    });
    return html;
  }
  function _geneHtmlElement(html){
    return _geneCommon(html,/(&lt;)(.*?)(&gt;)/g,"cd_tag");
  }
  function _geneNumber(html){
    return _geneCommon(html,/(\d+)/g,"cd_num");
  }
  function _geneString(html){
    return _geneCommon(html,/((")(.*?)("))|((')(.*?)('))/g,"cd_str");
  }
  function _geneNote(html){
    return _geneCommon(html,/((\/\/)(.*?)(\n))|((\/\*)((.|\n)*?)(\*\/))/g,"cd_note");
  }
  function _geneHtmlNote(html){
    return _geneCommon(html,/(&lt;!--)((.|\n)*?)(--&gt;)/g,"cd_note");
  }
  function _geneCommon(html,reg,tag){
    var arr=html.match(reg);
    if(arr!=null){
      arr.each(function(a,i){
        arr[i]="<"+tag+">"+a+"</"+tag+">";
      });
      html=html.replaceAll(reg,arr);
    }
    return html;
  }

//})()