var e=e||{};
(function(b){b.d=function(a){this.c=document.getElementById(a);this.f=this.c.parentNode;this.o=this.c.getContext("2d");this.g=[];this.resize=!1;this.refresh=!0;this.b={visible:!1,I:1E3/60,F:0,frames:0,K:0,G:0,w:0,J:0,l:void 0,text:void 0,D:0};this.b.l=new b.i(this);this.b.l.bind(this.o);this.b.l.id="Canvas Performance Statistics";this.b.l.visible=!1;this.b.text=this.b.l.add(new b.Text("",0,12));this.b.text.set("colour","white");this.c.style.margin="0";this.c.style.padding="0";this.c.style.display="block";
this.c.style.outline="none";this.c.tabIndex=1E3;this.f.style.padding="0";this.f.style.backgroundColor="#000";this.f==document.body?(this.f.style.margin="0",this.c.width=window.innerWidth,this.c.height=window.innerHeight):(this.c.width=this.f.offsetWidth,this.c.height=this.f.offsetHeight);this.width=this.c.width;this.height=this.c.height};b.d.prototype.handleEvent=function(a){console.log(a.type+" event");switch(a.type){case "resize":this.resize=!0}};b.d.prototype.T=function(a){var c=this;setInterval(function(){c.b.w=
(new Date).getTime();c.b.J=c.b.w-c.b.G;c.b.G=c.b.w;a&&a();c.resize&&c.N();c.j();c.b.K=(new Date).getTime()-c.b.w;c.b.frames++;c.b.visible&&(c.b.text.set("string","objects: "+c.b.D.toString()+"\ndraw time: "+c.b.K.toString()+"\nframe time: "+c.b.J.toString()+"\nfps: "+c.b.F.toString()),c.b.l.j())},c.b.I);setInterval(function(){c.b.F=c.b.frames;c.b.frames=0},1E3)};b.d.prototype.S=function(){this.b.visible=!0;this.b.l.visible=!0};b.d.prototype.background=function(a){this.f.style.backgroundColor=a};b.d.prototype.C=
function(){var a=new b.i(this);a.bind(this.o);this.g.push(a);a.id="Layer "+this.g.length.toString();return a};b.d.prototype.j=function(){var a=0;if(this.refresh){for(this.clear();a<this.g.length;a++)this.g[a].j();this.refresh=!1}};b.d.prototype.N=function(){var a=0,c=0,b=0;this.f==document.body?(c=window.innerWidth,a=window.innerHeight):(c=this.f.offsetWidth,a=this.f.offsetHeight);if(this.width!=c||this.height!=a){this.c.width=c;this.c.height=a;this.width=this.c.width;for(this.height=this.c.height;b<
this.g.length;b++)this.g[b].resize();this.refresh=!0;console.log("canvas size "+c.toString()+" x "+a.toString())}this.resize=!1};Object.defineProperty(b.d.prototype,"autofill",{set:function(a){1==a?(window.addEventListener("resize",this,!1),console.log("canvas will fill "+this.f)):(window.removeEventListener("resize",this,!1),console.log("canvas will stay fixed size"))}});Object.defineProperty(b.d.prototype,"fps",{set:function(a){this.Y.I=1E3/a}});Object.defineProperty(b.d.prototype,"showStats",{set:function(a){a&&
(this.b.visible=!0,this.b.l.visible=!0)}});b.d.prototype.getElementById=function(a){for(var c=0,b=this.g.length,d;c<b;c++){if(this.g[c].id==a)return this.g[c];if(d=this.g[c].getElementById(a))return d}return null};b.d.prototype.clear=function(a,c,b,d){a=a||0;c=c||0;b=b||this.width;d=d||this.height;this.o.save();this.o.setTransform(1,0,0,1,0,0);this.o.clearRect(a,c,b,d);this.o.restore()};b.d.prototype.add=function(){this.b.D++};b.d.prototype.q=function(){this.refresh=!0};b.i=function(a){this.parent=
a;this.p=[];this.width=this.parent.width;this.height=this.parent.height;this.id="";this.visible=!0;this.b={objects:0}};b.i.prototype.bind=function(a){this.display=a};b.i.prototype.add=function(a){a.parent(this);this.p.push(a);this.b.D++;this.parent.add();return a};b.i.prototype.getElementById=function(a){for(var c=0,b=this.p.length;c<b;c++)if(this.p[c].id==a)return this.p[c];return null};b.i.prototype.j=function(){if(this.visible)for(var a=0;a<this.p.length;a++)this.p[a].j(this.display)};b.i.prototype.resize=
function(){this.width=this.parent.width;this.height=this.parent.height};b.i.prototype.q=function(){this.parent.q()};b.e=function(){this.a={}};b.e.prototype.B=function(a,c,b){for(var d=0,g=a.length,h=c.length;d<g;d++)this.a[c[d]]=a[d];for(;d<h;d++)this.a[c[d]]=b[d]};b.e.prototype.parent=function(a){this.a.parent=a};b.e.prototype.q=function(){this.a.parent.q()};b.e.prototype.set=function(a,b){this.a[a]=b;this.q()};b.e.prototype.get=function(a){return this.a[a]};Object.defineProperty(b.e.prototype,"id",
{set:function(a){this.a.id=a},get:function(){return this.a.id}});b.Text=function(a,c,f,d,g,h,k,l){b.e.call(this);this.a={u:a.split("\n")||[],x:c||0,y:f||0,fontSize:d||12,fontFamily:g||"Arial",t:h||"#000000",align:k||"left",position:l||"absolute"}};b.Text.prototype=Object.create(b.e.prototype);b.Text.prototype.constructor=b.Text;b.Text.prototype.set=function(a,b){"string"==a?this.a.u=b.split("\n"):this.a[a]=b;this.q()};b.Text.prototype.j=function(a){var b=0;a.font=Math.round(this.a.fontSize).toString()+
"px "+this.a.fontFamily;a.fillStyle=this.a.t;for(a.textAlign=this.a.align;b<this.a.u.length;b++)"absolute"==this.a.position?a.fillText(this.a.u[b],this.a.x,this.a.y+this.a.fontSize*b):"relative"==this.a.position&&a.fillText(this.a.u[b],this.a.x+this.a.parent.width/2,this.a.y+this.a.parent.height/2+this.a.fontSize*b-(this.a.u.length-1.5)*this.a.fontSize/2)};b.s=function(a,c,f){b.e.call(this);this.B(arguments,["origin","direction","magnitude","colour"],[[0,0],[0,0],0,"#000"]);this.a.H=[this.a.origin[0]+
this.a.direction[0]*this.a.Q,this.a.origin[1]+this.a.direction[1]*this.a.Q]};b.s.prototype=Object.create(b.e.prototype);b.s.prototype.constructor=b.s;b.s.prototype.j=function(a){a.strokeStyle=this.a.t;a.beginPath();a.moveTo(this.a.origin[0],this.a.origin[1]);a.lineTo(this.a.H[0],this.a.H[1]);a.stroke()};b.m=function(a,c,f,d,g,h,k){b.e.call(this);this.B(arguments,"x y r a b cc colour".split(" "),[0,0,0,0,Math.PI,!1,"#000"])};b.m.prototype=Object.create(b.e.prototype);b.m.prototype.constructor=b.m;
b.m.prototype.j=function(a){a.beginPath();a.arc(this.a.x,this.a.y,this.a.R,this.a.L,this.a.M,this.a.V);a.fillStyle=this.a.t;a.fill()};b.v=function(a,c,f,d){b.m.call(this);this.B(arguments,["x","y","d","colour"],[[0,0],[0,0],1,"#000"]);this.a.R=this.a.W/2;this.a.L=0;this.a.M=6.28318530718};b.v.prototype=Object.create(b.m.prototype);b.v.prototype.constructor=b.v;b.random=b.random||{};b.random.A=function(a,b){return a==b?a:Math.random()*(b-a)+a};b.random.k=function(a,c){return a==c?a:Math.floor(b.random.A(a,
c+1))};b.random.element=function(a){return a[b.random.k(0,a.length-1)]};b.random.O=function(){var a=b.random.t(void 0);return[a[0].toString(16),a[1].toString(16),a[2].toString(16)]};b.random.t=function(a){var c=b.random.k(0,255),f=b.random.k(0,255),d=b.random.k(0,255);for(a="undefined"===a?0:a;c+d+f<a;)c=b.random.k(0,255),f=b.random.k(0,255),d=b.random.k(0,255);return[c,f,d]};b.random.P=function(){function a(a){return 1==a.length?"0"+a:a}var c=b.random.O();return a(c[0])+a(c[1])+a(c[2])}})(e);e=e||{};
(function(b){var a;b.r=function(){this.h=NaN;this.n=0;this.speed=1};a=b.r.prototype;Object.defineProperty(a,"time",{get:function(){return isNaN(this.h)?this.n:this.n+((new Date).getTime()-this.h)*this.scale},set:function(a){this.n=a;this.h=NaN;console.log("clock time set to "+this.time.toString())}});Object.defineProperty(a,"scale",{get:function(){return this.speed},set:function(a){this.speed==a?console.log("clock scale already at "+this.speed.toString()):(this.n=this.time,this.speed=a,isNaN(this.h)||(this.h=
(new Date).getTime()),console.log("clock scale set to "+this.speed.toString()))}});Object.defineProperty(a,"milliseconds",{get:function(){return Math.floor(this.time)},set:function(a){this.time=a}});Object.defineProperty(a,"seconds",{get:function(){return Math.floor(this.time/1E3)},set:function(a){this.time=1E3*a}});Object.defineProperty(a,"minutes",{get:function(){return Math.floor(this.time/6E4)},set:function(a){this.time=6E4*a}});Object.defineProperty(a,"hours",{get:function(){return Math.floor(this.time/
36E5)},set:function(a){this.time=36E5*a}});Object.defineProperty(a,"days",{get:function(){return Math.floor(this.time/864E5)},set:function(a){this.time=864E5*a}});Object.defineProperty(a,"weeks",{get:function(){return Math.floor(this.time/6048E5)},set:function(a){this.time=6048E5*a}});Object.defineProperty(a,"years",{get:function(){return Math.floor(this.time/314496E5)},set:function(a){this.time=314496E5*a}});b.r.prototype.reset=function(){console.log("clock reset at "+this.time.toString());this.h=
NaN;this.n=0;this.speed=1};b.r.prototype.start=function(){isNaN(this.h)?(console.log("clock started at "+this.time.toString()),this.h=(new Date).getTime()):console.log("clock already ticking")};b.r.prototype.stop=function(){this.n=this.time;this.h=NaN;console.log("clock stopped at "+this.time.toString())}})(e);(function(){function b(){var d=e.random.k(1,30);setTimeout(function(){c.add(new e.v(e.random.A(d,a.width-d),e.random.A(d,a.height-d),d,"#"+e.random.P()));b()},100)}var a=new e.d("canvas"),c=a.C(),f=a.C(),d=a.C(),g,h,k=f.add(new e.s([40,60],[1,.3],999)),l=new e.r,m=d.add(new e.Text("",200,12));f.add(new e.Text("HELLO WORLD\nxD\nayy lmao",0,0,100)).id="text";f=a.getElementById("text");f.set("colour","yellow");f.set("align","center");f.set("position","relative");k.set("colour","blue");m.set("colour",
"red");a.U=!0;a.T(function(){g=Math.floor(l.X/100);h=(g/10).toString()+(g%10?"":".0");m.set("string",h)});a.S=!0;l.start();b()})();
