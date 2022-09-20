export default `

' Start of PIXI text function
function text(s, x, y)
  return call("_sb.text(s,x,y);")
endfunction

function setText(obj, text)
  call("_sb.setText(obj,text)")
endfunction 

' End of PIXI text functions

' Start of PIXI drawing functions
function drawLine(x,y,x2,y2)
return call("_sb.drawLine(x,y,x2,y2)")
endfunction

function drawRect(x,y,width,height)
return call("_sb.drawRect(x,y,width,height);")
endfunction

function drawCircle(x,y,radius)
return call("_sb.drawCircle(x, y, radius);")
endfunction

' End of PIXI drawing functions

' Start of PIXI manipulation functions

function setFillColor(r,g,b)
  call("_sb.setFillColor(r,g,b);")
endfunction

function setLineColor(r,g,b)
  call("_sb.setLineColor(r,g,b);")
endfunction

function setAlpha(obj,a)
  call("_sb.setAlpha(obj, a);")
endfunction

function setPosition(obj, x, y)
  call("_sb.setPosition(obj, x, y)")
endfunction

function getPositionX(obj)
  return call("_sb.getPosition(obj).x")
endfunction

function getPositionY(obj)
  return call("_sb.getPosition(obj).y")
endfunction

function setAngle(obj, angle)
  call("_sb.setAngle(obj, angle);")
endfunction

function boxCollide(a,b)
  return call("_sb.boxCollide(a,b);")
endfunction

' End of PIXI manipulation functions

'Start of PIXI keyboard functions
function getKeyDown(keycode)
  return call("_sb.getKeyDown(keycode)")
endfunction

' Start of Math functions
function abs(n):return call("Math.abs("+n+")"):endfunction
function acos(n):return call("Math.acos("+n+")"):endfunction
function acosh(n):return call("Math.acosh("+n+")"):endfunction
function asin(n):return call("Math.asin("+n+")"):endfunction
function asinh(n):return call("Math.asinh("+n+")"):endfunction
function atan(n):return call("Math.atan("+n+")"):endfunction
function atan2(n1, n2):return call("Math.atan2("+n1+","+n2+")"):endfunction
function atanh(n):return call("Math.atanh("+n+")"):endfunction
function cbrt(n):return call("Math.cbrt("+n+")"):endfunction
function ceil(n):return call("Math.ceil("+n+")"):endfunction
function cos(n):return call("Math.cos("+n+")"):endfunction
function cosh(n):return call("Math.cosh("+n+")"):endfunction
function euler():return call("Math.E"):endfunction
function exp(n):return call("Math.exp("+n+")"):endfunction
function floor(n):return call("Math.floor("+n+")"):endfunction
function log(n):return call("Math.log("+n+")"):endfunction
function log2(n):return call("Math.log2("+n+")"):endfunction
function log10(n):return call("Math.log2("+n+")"):endfunction
function pi(): return call("Math.PI"):endfunction
function pow(x,y):return call("Math.pow("+x+","+y+")"):endfunction
function random(max):return call("Math.random("+max+")"):endfunction
function round(n):return call("Math.round("+n+")"):endfunction
function sign(n):return call("Math.sign("+n+")"):endfunction
function sin(n):return call("Math.sin("+n+")"):endfunction
function sinh(n):return call("Math.sinh("+n+")"):endfunction
function sqrt(n):return call("Math.sqrt("+n+")"):endfunction
function tan(n):return call("Math.tan("+n+")"):endfunction
function tanh(n):return call("Math.tanh("+n+")"):endfunction
function trunc(n):return call("Math.trunc("+n+")"):endfunction
function val(s):return call("Number("+s+")"):endfunction
' End of Math functions

' Start of string functions
function len(s):return call(s+".length"):endfunction
function lcase(s):return call(s+".toLowerCase()"):endfunction
function padstart(s, n, p): return call(s+".padStart("+n+","+p+")"):endfunction
function padend(s, n, p): return call(s+".padEnd("+n+","+p+")"):endfunction
function split(s, c): return call(s+".split("+c+")"):endfunction
function str(n):return call(n+".toString()"):endfunction
function substr(s, start, end):return call(s+".substring("+start+","+end+")"):endfunction
function trim(s):return call(s+".trim()"):endfunction
function ucase(s):return call(s+".toUpperCase()"):endfunction
'End of string functions

' Start of Array functions
function arrLength(a): return call(a+".length"):endfunction
function join(a, s): return call(a+".join("+s+")"):endfunction

`;
