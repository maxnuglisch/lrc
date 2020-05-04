//--------------------------------Settings-------------------------------
cloneCount = 2;
clone = index-1;

// Text Size
basicTextSize = 85; // Scale
basicTextSizeAt = 10; // Characters
textSizeVariation = 7; // Scale Variation per 10 Characters

// \n
breakAtChars = 10;

percent = false;
// [in %]
inStart = 30; 
inEnd = 1; 
outStart = 30;

// [in ms]
inStartMS = 500; 
inEndMS = 0; 
outStartMS = 500;

footageName = "Roses.json";

//--------------------------------Outputs--------------------------------
text = "";
animationProgress = 0; // 0 to 100 to 0
lineProgress = 0; // 0 to 100
textSize = basicTextSize; // Scales the text according to its length 

//---------------------------------Setup---------------------------------
eval("var lyrics=" + footage(footageName).sourceText);
t = Math.round(time * 1000);
i = clone;
max = parseInt(lyrics[lyrics.length-1].time);

//------------------------------GetPosition------------------------------
while(i < lyrics.length && parseInt(lyrics[i].time) < t && t < max){
    i = i+cloneCount;
}
if(i > 0){
    i = i-1;
}
//----------------------------------Run----------------------------------

// Text
text = " " + lyrics[i].text;

if(!text.includes("\n") && text.length > breakAtChars){
    
    breakCount = Math.round(text.length / breakAtChars - 0.4);
    partSize = text.length / (breakCount + 1);
    
    for(var l = partSize; text.length > l; l = l + partSize){
        while(l > 1 && !(text.charAt(l)==' ')){
            l--;
        }
        text = text.substring(0, l) + " AA " + text.substring(l);
        l++;
	}
}


maxLineSize = 0;
if(text.includes("\n")){
	lines = text.split("\n");
	for(var l = 0; l < lines.length; l++){
		if(lines[i].length > maxLineSize){
			maxLineSize = lines[i].length;
		}
	}
}else{
	maxLineSize = text.length;
}
textSize = basicTextSize - ((maxLineSize - basicTextSizeAt) * (textSizeVariation / 10));

// Points
if(i > 0) {
	prePoint = parseInt(lyrics[i-1].time);
}else{
	prePoint = 0;
}
inPoint = parseInt(lyrics[i].time);
if(i < lyrics.length-1){   
    outPoint = parseInt(lyrics[i+1].time);
}
prelineTimeLength = inPoint - prePoint;
lineTimeLength = outPoint - inPoint;

if(percent){
    inStartPoint = inPoint - (prelineTimeLength * (inStart / 100));
    inEndPoint = inPoint + (lineTimeLength * (inEnd / 100));
    outStartPoint = outPoint - (lineTimeLength * (outStart / 100));
}else{
    inStartPoint = inPoint - inStartMS;
    inEndPoint = inPoint + inEndMS;
    outStartPoint = outPoint - outStartMS;
}
inDuration = inEndPoint - inStartPoint;
outEndPoint = outPoint;
outDuration = outEndPoint - outStartPoint;
duration = outPoint - inPoint;

// Animation Progress
if(inEndPoint > t && t > inStartPoint){
        inProgress = t - inStartPoint; 
        animationProgress = (inProgress / inDuration) * 100;
}
if(outStartPoint >= t && t >= inEndPoint){
	animationProgress = 100;
}
if(outEndPoint > t && t > outStartPoint){
    outProgress = t - outStartPoint; 
    animationProgress = 100 - (outProgress / inDuration) * 100;
}
animationProgress = Math.round(animationProgress);

// Line Progress
if(outPoint >= t && t >= inPoint){
    progress = t - inPoint; 
	lineProgress = (progress / duration) * 100;
}

//Choose output here
//[textSize,textSize];
//animationProgress;
text;