console.log('v.240914')

const imgSize = [480,640];
const expImgSize = [50,50];
const screenScale = 0.75;

let cam;
const img = {};
const anim = {};
let exposure = undefined;
const params = {};

function setup() {

	pixelDensity(1); 
	const w = window.innerWidth;
	const h = window.innerHeight;
	if (w>h) {
    createCanvas(h*screenScale*imgSize[0]/imgSize[1],h*screenScale);
  }	else {
    createCanvas(w*screenScale,w*screenScale*imgSize[1]/imgSize[0]);
  }

  cam = createCapture({ 
    audio: false, 
    video: { 
      height: {max: imgSize[1]}, 
      facingMode: "environment" 
    }
  });
	cam.hide(); 
	cam.width=1;

	img.cam = createGraphics(imgSize[0],imgSize[1]);
	img.get = createGraphics(imgSize[0],imgSize[1]);
	img.exp = createGraphics(expImgSize[0],expImgSize[1]);
	params.frame = 0;

	anim.s = 1.0;
	anim.yPos = height;
	anim.a = 0.0;
	anim.fy = 0.0;
	params.mem = 0; //getItem('pic4u_dsc');
	if (params.mem==null) params.mem = 0;

	params.mes = "";
	params.mes += "👋";
	params.mes += random(["😄","😁","😆","😅","😊","😇","🙂","😉","😌","😍","🥰","😘","😚","😋","😛","😝","😜","🤪","🤨","🧐","🤓","🤩","🥳","😏","😎","🤯","😳","😱","🤭","🤫","😐","😲","🤤","😵","🥴","🤠","👽","🤖","🎃"]);
	params.mes += random(["🖐","✋","🖖","👌","✌️","🤟","🤘","🤙","☝️","✊","💅","🤳"]);
	params.appreciate = random(["❤️","👍","⭐️","💎"]);

	params.skin = {bgr: '#FFFFFF', msg1: '#00B2FF', msg2: '#006AFF'};
	params.fontSize = height/10;
	textAlign(CENTER,CENTER);

}

function checkEnvironment() {
  const url = window.location.href;
  const isLocal = url.includes('localhost') || url.includes('127.0.0.1') || url.includes('file://');
  return isLocal;
}

function exposureCheck(src) {
	img.exp.image(src,0,0,expImgSize[0],expImgSize[1]);
	const pixelsTotal = 4 * img.exp.width * img.exp.height;
	let pixelsCounted = 0;
	loadPixels();
	for (let i = 0; i < pixelsTotal; i += 4) {
		pixelsCounted += pixels[i]+pixels[i + 1]+pixels[i + 2];
	}
	pixelsCounted /= 255;
	pixelsCounted /= 3 * img.exp.width * img.exp.height;
	return pixelsCounted.toFixed(3);
}

/*function mes2bot() {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "https://cp.puzzlebot.top/api?token=PLACE_TOKEN_HERE&method=postSend&chats_ids=-PLACE_ID_HERE&type=message&text="+"📩");
	xhr.responseType = "json";
	xhr.send();
}*/

function pad(num, size) {
	num = num.toString();
	while (num.length < size) num = "0" + num;
	return num;
}

function draw() {
	background(params.skin.bgr);
  switch(params.frame) {
    case 0: drawF0(); break;
    case 1: drawF1(); break;
    case 2: drawF2(); break;
    case 3: drawF3(); break;
    case 4: drawF4(); break;
    case 5: drawF5(); break;
    case 6: drawF6(); break;
    case 7: drawF7(); break;
    case 8: drawF8(); break;
  }
}

// looking for camera
function drawF0() {
  const ready = true;
	textSize(params.fontSize).fill(255).noStroke();
  text(ready?"🔎📷":"⌚📭",width/2,height/2);
	if (ready && cam.width>1) params.frame=1;
	// print("params.mem="+params.mem+" dsc="+dsc);
}

// shooting
function drawF1() {
	anim.yPos -= 0.1*anim.yPos;
	const fit = cam.width>cam.height*0.75 ? img.cam.height/cam.height : img.cam.width/cam.width;
	img.cam.imageMode(CENTER);
	img.cam.image(cam,imgSize[0]/2,imgSize[1]/2,cam.width*fit,cam.height*fit); 
	image(img.cam,0,anim.yPos,width,height);
	textSize(params.fontSize).fill(255).noStroke();
  text("📸",width/2,height*0.90);
	if (mouseIsPressed && mouseY>height*0.8) { 
		mouseIsPressed = false; 
		const exposure = exposureCheck(img.cam); 
		if (exposure>0.05 && exposure<0.9) params.frame=2; 
	}
}

// shot preview
function drawF2() {
	anim.yPos = 0;
	image(img.cam,0,0,width,height);
	textSize(params.fontSize).fill(255).noStroke();
  text("🔁",width*0.25,height*0.90);
	text("✉️",width*0.75,height*0.90);
  if (mouseIsPressed && mouseY>height*0.8) {
    if (mouseX<width*0.5) {
      params.frame = 1;
    } else {
      params.frame = 3;
    }
    mouseIsPressed=false;
  }
}

// downloading image from the server
function drawF3() {
	image(img.cam,0,0,width,height);
	img.get = loadImage('img.jpg?'+ random(10000));
  params.frame = 4;
}

// uploading new image to the server
function drawF4() {
	image(img.cam,0,0,width,height);
	textSize(params.fontSize).fill(255).noStroke();
  text("⌛",width/2,height/2);
	if (img.get.width>1) {
		var canvas = img.cam.canvas;
		var data = canvas.toDataURL('image/jpeg').replace(/data:image\/jpeg;base64,/, '');
		iname = 'img.jpg';
		$.post('save.php',{data: data, iname });
    if(!checkEnvironment()) {
      //mes2bot();
    }
		params.frame = 5;
	}
}

// animations
function drawF5() {

	let st = 0.8;
	const yt = height;
	if (yt-anim.yPos<3) {
    st = 1.0;
  }
	anim.s -= (anim.s-st)*0.1;
	if (anim.s-st<0.001) anim.yPos -= (anim.yPos-yt)*0.05;
	
	if ((yt-anim.yPos<3) && (anim.s>0.999)) {
		params.frame=6;
		// storeItem('pic4u_dsc', dsc);
	}

	noStroke();
	rectMode(CENTER);

	fill(params.skin.msg1);
	rect(width/2,height/2-anim.yPos, width*0.9, height*0.9, 20);
	triangle(width*0.90, height*0.95-anim.yPos, 
					 width*0.97, height*0.95-anim.yPos, 
					 width*0.90, height*0.90-anim.yPos);

	fill(params.skin.msg2);
	rect(width/2,height/2-anim.yPos+yt, width*0.9, height*0.9, 20);
	triangle(width*0.10, height*0.95-anim.yPos+yt, 
					 width*0.03, height*0.95-anim.yPos+yt, 
					 width*0.10, height*0.90-anim.yPos+yt);

	imageMode(CENTER);
	image(img.cam,width/2,height/2-anim.yPos,width*anim.s,height*anim.s);
	image(img.get,width/2,height/2-anim.yPos+yt,width*anim.s,height*anim.s);

}

// saving downloaded image
function drawF6() {
	imageMode(CORNER);
	image(img.get,0,0,width,height);
	textSize(params.fontSize).fill(255).noStroke().text("🗑️",width*0.25,height*0.90);
	textSize(params.fontSize).fill(255).noStroke().text("📥",width*0.75,height*0.90);
	if (mouseIsPressed && mouseY>height*0.8) {
    if (mouseX<width*0.5) {
      anim.yPos = height/2;
      params.frame=8;
    } else {
      // img_get.save('DSC'+pad(dsc,5)+'.JPG');
      img.get.save('DSC'+pad(random()*1000,5)+'.JPG');
      anim.yPos = 0;
      params.frame=7;
    }
    mouseIsPressed=false; 
  }
}

// goodbye screen
function drawF7() {
	textSize(params.fontSize).fill(255).noStroke();
  text(params.mes,width*0.5,height*0.50);
	image(img.get,0,anim.yPos,width,height);
	anim.yPos -= (anim.yPos-height)*0.05;
	textSize(params.fontSize*2.0).fill(255,255-anim.fy**0.5*255).noStroke();
  text(params.appreciate,width*0.5,height*0.75-anim.fy*height*0.3);
	if (anim.fy<1.0) { 
    anim.fy+=0.03;
  }
}

// delete screen
function drawF8() {

	push();
		translate(width*0.5,height*0.75);
		rotate(sin(anim.fy*35)*0.25*max(1.0-anim.fy,0));
		textSize(params.fontSize*3.0).fill(255).noStroke().text("🗑️",0,0);
	pop();

	let at = PI/4;
	let st = 0.3;
	let yt = height*0.25;

	if (abs(anim.a-at)<0.03) {
		yt = height*1.5;
		st = 0.2;
	}

	if (abs(anim.a-at)<0.03 && anim.yPos > height*0.75) {
		textSize(params.fontSize*2.0).fill(255,255-anim.fy**0.5*255).noStroke().text("🔥",width*0.5,height*0.75-anim.fy*height*0.3);
		if (anim.fy<1.0) anim.fy+=0.03;
	}

	anim.a -= (anim.a-at)*0.05;
	anim.yPos -= (anim.yPos-yt)*0.05;
	anim.s -= (anim.s-st)*0.1;

	push();
		translate(width/2,anim.yPos);
		rotate(anim.a);
		imageMode(CENTER);
		if (abs(anim.a-at)>0.03 || anim.yPos < height*0.7) {
      image(img.get,0,0,width*anim.s,height*anim.s);
    }
	pop();

}

