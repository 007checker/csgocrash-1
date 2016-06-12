// THIS SCRIPT IS INTENDED ONLY FOR MODS/ADMINS AND DOES NOTHING FOR NORMAL USERS
// THIS IS NOT AN AUTOBET SCRIPT
// CREATED BY FREEDOM - 100% FREE SCRIPTS

// ============== TURN ON / OFF =================== 
var steam64 = true; 	// Check for steam64 		(true = on, false = off)
var offensive = true;   // Check for offensive language (true = on, false = off)
var spam = true; 	// Check for spam 		(true = on, false = off)
var command = true;     // Commands on/off		(true = on, false = off)
var antiBots = true;    // Permanent mute for people posting ceratin stuff
// ================================================


// ============= Steam64 settings =============================
var steam64Duration = 3; 	 // Steam64 ban duration.
var steam64B = "h"; 		 // (m = minutes, h = hours, d = days, y = years)

// ============= Profanity settings =============================
/*
Stacking now results in a multiplication of one mute instead of several small mutes
Example: "RIGGED RIGGED RIGGED" would now yield a 90 minute ban and not 3 bans á 30min.
Turning stacking off now only mutes once, the first profanity that is detected
*/
var languageDuration = 30; 	 // Offensive language ban duration.
var languageB = "m"; 		 // (m = minutes, h = hours, d = days, y = years)
var stack = true;

var profanity = ["nigga", "nigger","rigged","scam site"];

// ============= Spam settings =============================
var spamDuration = 45;		 // Spam ban duration.
var messagesMax = 5;   		 // Amount of messages within an interval to be counted as spam
var spamB = "m"; 		 // (m = minutes, h = hours, d = days, y = years)

// NOT IMPLEMENTED YET
//var notSpam = 1000;        // Everytime someone types something his "counter" goes up by one. Everytime the code hits this interval, his counter goes down by one
			 // Meaning that if he types too much too fast he gets muted.
			 // Milli, 1000 = 1 second	

// ============= Anti Bots settings =============================
// Permanent mute
var advertising = ["csgohill.com","csgo500.com","csgodouble.com","csgopolygon.com"];
var responseA  = "<Automated> Advertising leads to a permanent mute without warning";
// ==============================================================



							 
// ============= Command settings =============================
// Do not forget to add a response for every command.
var commandMessage = "<Automated> You can type !commands to get a list of commands."
var commandMessageInterval = 150000; // 1000 = 1 second
/*
"mutesTotal" equals all people that have been muted since running the script, restarting resets the counter.
"nickname" equals the message owners name.
"id" equals his steamid
"role" equals his role (user, mod, admin).
Can add more, just ask what is needed
*/
var commands = ["!commands" , "!help" , "!servers" , "!name","!totalmutes"];
function updateResponse() {
response = [
"Current commands are: "+commands.toString(), 
"Bots may be offline due to overload. If you have waited more than 20 minutes for coins, open a ticket", 
"There are currently 5 servers to play on",
"Your name is "+nickname+"",
"This session a total of "+mutesTotal+" people has been muted" ];
}








// No touchy touchy beyond this line (unless you know what youre doin)
var nickname, message, id, idS, returnMessage, spamLastID, role, debug, response;
var takingCommands = true;
var mutesTotal = 0;
var spamCount = 0;
var numbers = "0123456789";
updateResponse();
setTimeout(function(){ engine.chat(commandMessage) }, commandMessageInterval);
// mutes-------
function muteSteam64() {
	mutesTotal++;
	returnMessage = "<Automated> Steam64 detected - "+nickname+", posting your ID is prohibited";
	engine.chat(returnMessage);
	returnMessage = "/mute "+id+" "+steam64Duration+steam64B;
	engine.chat(returnMessage);
}
function muteOffensive(x) {
	mutesTotal++;
	if (x==1) returnMessage = "<Automated> Profanity detected - "+nickname+", do not use rude/offensive words";
	else returnMessage = "<Automated> Multiple profanity detected - "+nickname+", multiple mutes delivered";
	if (stack) x = x*languageDuration;
	else x = languageDuration;
	engine.chat(returnMessage);
	returnMessage = "/mute "+id+" "+x+languageB;
	engine.chat(returnMessage);	
}
function muteSpam () {
	mutesTotal++;
	returnMessage = "<Automated> Spam detected - "+nickname+", try to speak in one sentence";
	engine.chat(returnMessage);
	returnMessage = "/mute "+id+" "+spamDuration+spamB;
	engine.chat(returnMessage);		
}
function muteBots () {
	mutesTotal++;
	engine.chat(responseA);
	returnMessage = "/mute "+id+" 999y";
	engine.chat(returnMessage);		
}
// -------------


function stitchMe() {
	var rM = "";
	for (var i = 0; i<message.length; i++) {
		for (var ii = 0; ii<numbers.length; ii++) {
			if (message.charAt(i)==numbers[ii])
				rM = rM+message.charAt(i);
		}
		
	}
	return rM;
}

engine.on('msg', function(data) {
	role = data.role;
	nickname = data.nickname;  			
	message = data.message;
	message = message.toLowerCase();
	id = data.steamid;					
	idS = id.toString();
	updateResponse();
 	if (takingCommands&&command&&(role=="user"))    commandi();			
	if (steam64&&(role=="user")) 	steam64i();		
	if (spam&&(role=="user"))		spami();	
	if (offensive&&(role=="user")) 	offensivei();
	if (antiBots&&(role=="user")) 	antiBotsi();
});
function commandi() {
	takingCommands = false;
	looptroop:
	for (var i = 0; i<commands.length; i++) {
		for (var k = 0; k<message.length+1-commands[i].length; k++) {
			if (message.substring(k, k+commands[i].length)==commands[i]) {
				engine.chat(response[i]);
				break looptroop;
			}		
		}
	}
	setTimeout(function(){ takingCommands = true; }, 3000);
}

function steam64i() {
	var stichedMessage = stitchMe();
	loopi:
	for (var i = 0; i < stichedMessage.length+1-id.length; i++) {
		if (stichedMessage.substring(i,(i+id.length))==id) {
			muteSteam64();
			break;				
		}                      
	}
}

function offensivei() {
	var totalen = 0;
	for (var i = 0; i<profanity.length; i++) {
		for (var k = 0; k<message.length+1-profanity[i].length; k++) {
			if (message.substring(k, k+profanity[i].length)==profanity[i]) {
				totalen++;
			}		
		}
	}
	if (totalen > 0 ) muteOffensive(totalen);
}
function spami() {
	if (id==spamLastID) {
		spamCount += 1;
		if (spamCount>=messagesMax) {
			spamCount = 0;
			muteSpam();
		}
	}
	else {
		spamCount = 0;
		spamLastID = id;
	}
}
function antiBotsi() {
	for (var i = 0; i<advertising.length; i++) {
		for (var k = 0; k<message.length+1-advertising[i].length; k++) {
			if (message.substring(k, k+advertising[i].length)==advertising[i]) {
				muteBots();
				break;
			}		
		}
	}
}
