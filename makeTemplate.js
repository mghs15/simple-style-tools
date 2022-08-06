const fs = require('fs');

const style = require('./basic.json');

const layers = style.layers;

const tmp = {
  "r": {}, "g": {}, "b": {}, "m": {}
};
const tmp2 = {};
const tmp3 = {};

const collectColorInfo = (colorInfo, info={})=>{
  if(Array.isArray(colorInfo)){
    colorInfo.forEach( colorInfoElement => {
      collectColorInfo(colorInfoElement);
    });
  }else if(typeof(colorInfo)=="string" && ( colorInfo.match(/^rgb/) || colorInfo.match(/^hsl/))){
    
    const ct = classifyColor(colorInfo);
    
    const identifier = (info.metadata) ? info.metadata.path || info.id : info.id;
    
    if(tmp[ct][colorInfo]){
      tmp[ct][colorInfo] += 1;
    }else{
      tmp[ct][colorInfo] = 1;
    }
    return colorInfo;
  }
}

const classifyColor = (colorInfo) => {
  //colorInfoはString

  const colStr = parsecolor(colorInfo);
  const cr = colStr[1];
  const cg = colStr[2];
  const cb = colStr[3];
  
  const ct = (cb == cr && cb == cg) ? "m" : (cr >= cg && cr >= cb) ? "r" : (cg >= cr && cg >= cb) ? "g" : "b";
  
  return ct;
}

/*************************************************/
/*"rgba(r,g,b,a)"などのパース                    */
/*************************************************/
var parsecolor = function(txt){
  if( (txt.indexOf("rgba") == 0) || (txt.indexOf("hsla") == 0) ){
    var length = txt.length - 1;
    var type= txt.slice(0, 4);
    txt = txt.slice(5,length );
    var col = txt.split(",");
  }else{
    var length = txt.length - 1;
    var type= txt.slice(0, 3) + "a";
    txt = txt.slice(4,length );
    var col = txt.split(",");
    col.push(1);
  }
  const color = [];
  color.push( type );
  color.push( parseInt(col[0]) );
  color.push( parseInt(col[1]) );
  color.push( parseInt(col[2]) );
  color.push( Number(col[3]) );
  return color;
}

const addArrEle = (arr, ele) => {
  const n = arr.length;
  if(Array.isArray(arr[n-1])){
    addArrEle(arr[n-1],ele);
  }else{
    arr.push(ele);
  }
}

const convertColor = (colorInfo, arr=[], info={}) => {
  if(Array.isArray(colorInfo)){
    colorInfo.forEach( colorInfoElement => {
      arr.push(convertColor(colorInfoElement, [], info));
    });
    return arr;
  }else if(typeof(colorInfo)=="string" && ( colorInfo.match(/^rgb/) || colorInfo.match(/^hsl/))){
    
    //修正
    let colorInfo2
    
    if(info["prop-name"].match("text-halo") && colorInfo.match("255,255,255")){
      //縁取りの白は区別
      colorInfo2 = "--color-text-white-halo--";
    }else if(info["prop-name"].match("text")){
      colorInfo2 = setupColor(colorInfo, "text");
    }else if(info["source-layer"] == "road" && colorInfo.match("255,255,255")){
      colorInfo2 = "--color-road-normal-main--";
    }else if(info["source-layer"] == "road" && colorInfo.match("240,240,230")){
      colorInfo2 = "--color-road-all-back--";
    }else if(info["source-layer"] == "railway" && colorInfo.match("240,240,230")){
      colorInfo2 = "--color-railway-all-back--";
    }else{ 
      colorInfo2 = setupColor(colorInfo);
    }
    
    if(tmp3[colorInfo2]){
      tmp3[colorInfo2] += 1;
    }else{
      tmp3[colorInfo2] = 1;
    }
    
    
    const identifier = (info.metadata) ? info.metadata.path || info.id : info.id;
    if( colorInfo2.match(/^rgb/) || colorInfo2.match(/^hsl/) ){
      if(tmp2[colorInfo2]){
        tmp2[colorInfo2].push( identifier );
      }else{
        tmp2[colorInfo2] = [ identifier ];
      }
    }
    
    return(colorInfo2); 
    
  }else if(typeof(colorInfo)=="string" && colorInfo.match(/^--.*--$/)){
    return(colorInfo);
  }else{
    return(colorInfo);
  }
  
}


const textColorSetOrg = {
  
  'rgba(20,90,255,1)': '--color-water-main-vivid--', //水涯線
  'rgb(20,90,255)': '--color-water-main-vivid--', //水涯線
  'rgb(190,210,255)': '--color-water-main-main--', //水域
  'rgba(201,201,181,1)': '--color-landform-main-main--', //等高線
  
  'rgba(19,97,69,1)': '--color-text-green-main--', //〇文字色 e.g. station
  
  'rgba(113,112,113,1)': '--color-text-gray-main--', //〇標高点文字色
  'rgba(101,101,101,1)': '--color-text-gray-main--', //〇文字色
  'rgba(99,99,99,1)': '--color-text-gray-main--', //〇文字色
  'rgba(160,160,160,1)': '--color-text-gray-main--', //〇文字色
  'rgba(80,80,80,1)': '--color-text-gray-main--', //〇文字色
  
  'rgba(0,0,0,1)': '--color-text-black-main--', //〇文字色
  
  'rgba(255,255,255,1)': '--color-text-white-main--', //〇文字色
  
}


const colorSetOrg = {
  'rgba(101,100,100,1)': '--color-railway-normal-main--', //ZL4-8 主要な鉄道
  'rgba(101,100,100,0.75)': '--color-railway-normal-main--', //ZL4-8 主要な鉄道トンネル
  'rgba(89,88,88,1)': '--color-railway-shinkansen-main--', //ZL4-8 鉄道-新幹線
  'rgba(89,88,88,0.75)': '--color-railway-shinkansen-main--', //ZL4-8 鉄道-新幹線
  'rgb(238,202,119)': '--color-road-major-main--', //ZL4-8 道路-主要な道路
  'rgba(255,190,190,1)': '--color-road-highway-main--', //☆★国道
  'rgba(255,211,111,1)': '--color-road-prefectural-main--', //☆★県道
  'rgba(112,112,112,1)': '--color-road-edge--', //道路-徒歩・庭園・石段
  'rgba(152,152,152,1)' : '--color-road-edge--', //ZL17 道路縁
  
  'rgb(255,230,190)': '--color-building-normal-main--', //●建物
  
  'rgba(153,238,192,1)': '--color-wetland-main-main--', //湿地
  'rgb(123,183,124)': '--color-road-expressway-main--', //ZL4-8 道路-高速自動車道トンネル
  'rgba(0,151,0,1)': '--color-road-expressway-main--', //☆★高速道路
  //'rgba(19,97,69,1)': '--color-text-green-main--', //〇文字色 e.g. station
  
  'rgb(240,240,230)': '--color-background-base-main--', //★背景
  'rgb(190,210,255)': '--color-water-main-main--', //★水域
  'rgb(20,90,255)': '--color-water-main-vivid--', //水涯線
  'rgb(254,254,255)': '--color-water-main-blank--', //ZL17 水域
  'rgba(43,107,255,1)': '--color-water-main-vivid--', //枯れ川水涯線
  'rgb(101,159,216)': '--color-water-main-vivid--', //ZL6-8 河川
  'rgba(20,90,255,1)': '--color-water-main-vivid--', //水涯線
  'rgba(100,150,255,0.2)': '--color-water-main-vivid--', //万年雪
  'rgba(201,201,181,1)': '--color-landform-main-main--', //砂礫地、岩、崖
  'rgba(200,160,60,1)': '--color-landform-main-main--', //砂礫地
  'rgba(20, 90, 255,1)': '--color-water-main-vivid--', //水部凹地方向線
  'rgba(100,150,255,1)': '--color-water-main-vivid--', //万年雪
  
  'rgb(113,112,113)': '--color-line-gray--', //ZL6-8 航路-航路
  'rgba(200,145,255,1)': '--color-border-muni-main--', //●市区町村界
  'rgba(170,170,170,1)': '--color-border-muni-main--', //都府県界、所属を明示する境界線
  'rgba(240,240,230,1)': '--color-background-base-main--', //背景色（高架背景）
  'rgba(0,0,255,1)': '--color-railway-shinkansen-main--', //小縮尺 鉄道-通常-新幹線
  'rgb(190,230,255)': '--color-building-high-main--', //●建物（高層建物）
  //'rgba(113,112,113,1)': '--color-text-gray-main--', //〇標高点文字色
  'rgba(180,180,180,1)': '--color-building-middle-main--', //●建物
  //'rgba(0,0,0,1)': '--color-text-black-main--', //〇文字色
  'rgba(111,111,111,1)': '--color-railway-normal-main--', //★鉄道
  'rgba(160,160,160,1)': '--color-line-gray--', //雪覆い、航路等
  //'rgba(255,255,255,1)': 255, //白
  'rgb(200,200,200)': '--color-building-middle-main--', //ZL17-18 建物等
  
  'rgba(99,99,99,1)' : '--color-line-gray--', //送電線、structurel、landforml、堤防など
  'rgba(128,128,128,1)' : '--color-line-gray--',//高塔
  'rgb(140,140,140)' : '--color-line-gray--', //見つからない
  'rgba(100,100,100,1)' : '--color-line-gray--', //特定地区界、その他の境界
  'rgb(100,100,100)' : '--color-line-gray--', //人工水路、ダム
  'rgba(200,200,200,1)': '--color-line-gray--', //ダム(面)

}


const setupColor = (txt, isLabel = "") => {
  
  const key = (isLabel == "text") ? textColorSetOrg[txt] || "--color-text-gray-main--" : colorSetOrg[txt] || "--none-other--";
  
  if(!key.match("-none-")){
    return key;
  }else{
    return txt;
  }
  

}



const changeColor = (arr, info={}) => {
  
  const mode = "_d";
  
  
  const divNum = 1;
  
  let r = Math.floor(arr[1]/divNum)*divNum;
  let g = Math.floor(arr[2]/divNum)*divNum;
  let b = Math.floor(arr[3]/divNum)*divNum;
  
  return(["rgba", r, g, b, a]);
  
}

/*************************************************/
/*メイン                                         */
/*************************************************/

//テキスト形式を配列へ
layers.forEach( layer => {
  if(layer.paint){
    for( name in layer.paint){
      if(name.match("color")){
        const colorInfo = layer.paint[name];
        collectColorInfo(colorInfo, { ...layer, "prop-name": name}); // 分析
        layer.paint[name] = convertColor(colorInfo, [], { ...layer, "prop-name": name});
        //console.log(layer.paint[name]);
      }
    }
  }
});


console.log(tmp);
console.log(tmp2);
//console.log(layers);

console.log(Object.keys(tmp3).sort());




const resstring = JSON.stringify(style, null, 4);
fs.writeFileSync("template.json", resstring);

