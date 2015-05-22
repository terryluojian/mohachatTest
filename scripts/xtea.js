function DecToHex(x){
var s="",x_=!isNaN(Number(x))?Number(x):0;
while(Boolean(x_)){
s="0123456789ABCDEF".charAt(x_&15)+s;
x_>>>=4;
}
while(s.length&7){
s="0"+s;
}
return (s);
}
function Encipher(p1,p2,k){
var _7=new Array();
_7[0]=1;
_7[1]=new Number(p1);
_7[2]=new Number(p2);
var _8=0;
var _9=2654435769;
var n=32;
while(n-->0){
_7[1]=(_7[1]+((_7[2]<<4^((_7[2]>>5)&134217727))+_7[2]^_8+k[(_8&3)]))&4294967295;
_8=(_8+_9)&4294967295;
_7[2]=(_7[2]+((_7[1]<<4^((_7[1]>>5)&134217727))+_7[1]^_8+k[(((_8>>11)&2097151)&3)]))&4294967295;
}
return (_7);
}
function Decipher(p1,p2,k){
var _e=new Array();
_e[0]=1;
_e[1]=new Number(p1);
_e[2]=new Number(p2);
var _f=3337565984;
var _10=2654435769;
var n=32;
while(n-->0){
_e[2]=(_e[2]-((_e[1]<<4^((_e[1]>>5)&134217727))+_e[1]^_f+k[(((_f>>11)&2097151)&3)]))&4294967295;
_f=(_f-_10)&4294967295;
_e[1]=(_e[1]-((_e[2]<<4^((_e[2]>>5)&134217727))+_e[2]^_f+k[(_f&3)]))&4294967295;
}
return (_e);
}
function EncipherText(_12,key){
var p1D=0;
var p2D=0;
var res=null;
var _17="";
var tmp;
var i;
var _1a="!!!!!!!\r\r!!!!!!!";
tmp=""+String.fromCharCode((_12.length/16777216)&255)+String.fromCharCode((_12.length/65536)&255)+String.fromCharCode((_12.length/256)&255)+String.fromCharCode(_12.length&255);
_12=tmp+_12;
while(_12.length&7){
_12+="\x00";
}
i=0;
while(key.length&21){
key+=key.charAt(i++);
}
tmp=key;
key=new Array(key.length/4);
i=0;
j=0;
while(i<tmp.length){
key[j++]=(((tmp.charCodeAt(i++)&255)<<24)|((tmp.charCodeAt(i++)&255)<<16)|((tmp.charCodeAt(i++)&255)<<8)|((tmp.charCodeAt(i++)&255)))&4294967295;
}
i=0;
j=0;
k=new Array(4);
while(i<_12.length){
if(j+4<=key.length){
k[0]=key[j];
k[1]=key[j+1];
k[2]=key[j+2];
k[3]=key[j+3];
}else{
k[0]=key[j%key.length];
k[1]=key[(j+1)%key.length];
k[2]=key[(j+2)%key.length];
k[3]=key[(j+3)%key.length];
}
j=(j+4)%key.length;
p1D=_12.charCodeAt(i++)<<24;
p1D|=_12.charCodeAt(i++)<<16;
p1D|=_12.charCodeAt(i++)<<8;
p1D|=_12.charCodeAt(i++);
p1D&=4294967295;
p2D=_12.charCodeAt(i++)<<24;
p2D|=_12.charCodeAt(i++)<<16;
p2D|=_12.charCodeAt(i++)<<8;
p2D|=_12.charCodeAt(i++);
p2D&=4294967295;
res=Encipher(p1D,p2D,k);
_17+=(res[0]?""+DecToHex(res[1])+DecToHex(res[2]):_1a);
p1D=0;
p2D=0;
res=null;
}
return _17;
}
function DecipherText(_1b,key){
var p3H="";
var p4H="";
var p3D=0;
var p4D=0;
var res=null;
var _22="";
var i;
var j;
var tmp;
i=0;
while(key.length&21){
key+=key.charAt(i++);
}
tmp=key;
key=new Array(key.length/4);
i=0;
j=0;
while(i<tmp.length){
key[j++]=(((tmp.charCodeAt(i++)&255)<<24)|((tmp.charCodeAt(i++)&255)<<16)|((tmp.charCodeAt(i++)&255)<<8)|((tmp.charCodeAt(i++)&255)))&4294967295;
}
i=0;
while(i<_1b.length){
p3H+=_1b.charAt(i++);
p3H+=_1b.charAt(i++);
p3H+=_1b.charAt(i++);
p3H+=_1b.charAt(i++);
p3H+=_1b.charAt(i++);
p3H+=_1b.charAt(i++);
p3H+=_1b.charAt(i++);
p3H+=_1b.charAt(i++);
p4H+=_1b.charAt(i++);
p4H+=_1b.charAt(i++);
p4H+=_1b.charAt(i++);
p4H+=_1b.charAt(i++);
p4H+=_1b.charAt(i++);
p4H+=_1b.charAt(i++);
p4H+=_1b.charAt(i++);
p4H+=_1b.charAt(i++);
p3D=parseInt(p3H,16);
p4D=parseInt(p4H,16);
res=Decipher(p3D,p4D,key);
if(res[0]){
_22+=String.fromCharCode((res[1]&4278190080)>>24);
_22+=String.fromCharCode((res[1]&16711680)>>16);
_22+=String.fromCharCode((res[1]&65280)>>8);
_22+=String.fromCharCode((res[1]&255));
_22+=String.fromCharCode((res[2]&4278190080)>>24);
_22+=String.fromCharCode((res[2]&16711680)>>16);
_22+=String.fromCharCode((res[2]&65280)>>8);
_22+=String.fromCharCode((res[2]&255));
}
p3H="";
p4H="";
p3D=0;
p4D=0;
res=null;
}
tmp=(((_22.charCodeAt(0)&255)<<24)|((_22.charCodeAt(1)&255)<<16)|((_22.charCodeAt(2)&255)<<8)|((_22.charCodeAt(3)&255)))&4294967295;
return _22.substring(4,4+tmp);
}
updateProgress("scripts/xtea.js");
