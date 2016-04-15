// poolHall
Array.prototype.last = function() {
    return this[this.length-1];
}
Array.prototype.shuffle = function(){
var currentIndex = this.length, temporaryValue, randomIndex;
 while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = this[currentIndex];
    this[currentIndex] = this[randomIndex];
    this[randomIndex] = temporaryValue;
  }
  return;
}

function randomColor(){

var rgb = {
r: Math.floor( Math.random() * 255),
g: Math.floor( Math.random() * 255),
b: Math.floor( Math.random() * 255)
};

return rgb	
}



poolHall = function(){
	this.table = null;	
	this.game = $('game');
	this.playArea = $('<div id="play-area"></div>');
	this.game.append(this.playArea);
	this.panes = {};
	this.panes.newGame = $(poolHall.PANES.NEWGAME);
	this.addedSinks = []; //decliration fix... lazy...
	
	
	for (var game in poolHall.GAMETYPE) {
      this.panes.newGame.find('#select-table-type').append('<option value="'+game+'">'+poolHall.GAMETYPE[game].name+'</option>');
	}
	
	var summary = this.panes.newGame.find('#table-rules-summary');
	summary.find("p").html(poolHall.GAMETYPE.Eight_Ball_Crazy.outline+"<BR/>"+poolHall.GAMETYPE.Eight_Ball_Crazy.scoring);
	
	
	this.panes.pO =  this.panes.newGame.find('#player-order');
	
	
	
	
	this._AddNewPlayerBlock();
	this._AddNewPlayerBlock();	
	
	this.panes.newGame.find("[type='button']").button();
	
	summary.collapsible();
	
	this.panes.newGame.find("#table-add-rules" ).collapsible();
	
	
	this.panes.newGame.find(".toggle" ).bind('click',function(e){
		$(e.target).parent().find('.toggle.selected').removeClass('selected');
		$(e.target).addClass('selected');		
	});
	
	
	

	
	
	
	this.panes.newGame.find("input#player-count").attr("min",poolHall.GAMETYPE.Eight_Ball_Crazy.minPlayers).attr("max",poolHall.GAMETYPE.Eight_Ball_Crazy.maxPlayers);
	
	this.panes.newGame.find("select").selectmenu({
		hidePlaceholderMenuItems: false,
		});
	this.panes.newGame.find("input[type='text']").textinput();
	this.panes.newGame.find("input#player-count").slider();
	
	var parent = this;
	
	this.panes.newGame.find("select").bind('change', function(e){
		var gameType = eval("poolHall.GAMETYPE."+$(this).val());
		summary.find("p").html(gameType.outline+"<BR/>"+gameType.scoring);
		this.panes.newGame.find("input#player-count").attr("min",gameType.minPlayers).attr("max",gameType.maxPlayers);
		this.panes.newGame.find("input#player-count").slider("refresh");
	});
	
	
	this.panes.newGame.find("input#player-count").bind( "slidestop", function(e, ui) {
 		var playerCount = $(this).val();
		var dif = playerCount - parent.panes.pO.find('player').length;
		
		if(dif>0){
			for(var i=0; i < dif; i++){
				parent._AddNewPlayerBlock();
			}
		}else if(dif<0){
			for(var i=0; i < (-1*dif); i++){
				parent.panes.pO.find('player').last().remove();
			}
		}
	
	});
	
	this.panes.newGame.find("input#start-game").bind('click',function(){
		parent._startNewGame();
	});
	
	this.playArea.append(this.panes.newGame);
	
};

poolHall.prototype._AddNewPlayerBlock = function(){
	var newPlayer = $(poolHall.PLAYER.newPlayerBlock);
	var color = randomColor();
	
	newPlayer.css({
		"background": "rgba("+color.r+","+color.g+","+color.b+",0.2)",
		"border-color" :"rgb("+color.r+","+color.g+","+color.b+")",
		});
		
		var pN = this.panes.pO.find('player').length+1;
		newPlayer.find("#player-name").val("Player "+pN);	
		
	newPlayer.find("#color").css({
		"background": "rgb("+color.r+","+color.g+","+color.b+")"});	
	
	newPlayer.find("input[type='text']").textinput();
	
	newPlayer.find('#color').ColorPicker({
			color: color,
			onShow: function (colpkr) {
			$(colpkr).fadeIn(300);
			$(colpkr).css({
			"left" : ($('body').width()*0.5)-($(colpkr).width()*0.5) +"px",
			"top"  :  ($('body').height()*0.5)-($(colpkr).height()*0.5) +"px",
			});
			return false;
			},
			onHide: function (colpkr) {
			$(colpkr).fadeOut(300);
			newPlayer.parent().focus();
			return false;
			},
			onChange: function (hsb, hex, rgb) {
			newPlayer.find('#color').css('background-color', "#" + hex);
			newPlayer.css({
			"background": "rgba("+rgb.r+","+rgb.g+","+rgb.b+",0.4)",
			"border-color" :"rgb("+rgb.r+","+rgb.g+","+rgb.b+")",
			});
			}
		});
		
	this.panes.pO.append(newPlayer);
}

poolHall.prototype._startNewGame = function(){
	
	
	var 
	nameOfGame = this.panes.newGame.find('input#name-of-table').val(),
	typeOfGame = this.panes.newGame.find('select#select-table-type').val();
	
	if(!nameOfGame){
		alert('Please set a Table Name!');
		return false;
	};
	
	var trigger = false;
	
	this.panes.pO.find('player input#player-name').each(function(i, e){
		var pName = $(e).val();
		if(!pName){
			trigger = true;
			return false;	
		}
	});
		
	if(trigger){
	alert('Make sure all players have a name!');
	return false;	
	}
	
	this.table = new poolHall.TABLE(this);
	this.panes.newGame.fadeOut(0);
	
	this.panes.table = $(poolHall.PANES.TABLE);
	
	this.info = {};
	this.info.tableName = this.panes.table.find("#table-name");
	this.info.tableName.text(nameOfGame);
	
	this.info.gameNumber = this.panes.table.find("#game-number");
	this.info.turnNumber = this.panes.table.find("#turn-number");
	
	this.info.playerBar = this.panes.table.find("#player-bar");
	
	var parent = this;
	$.each(this.table._players, function(i,e){
		var newPlayer = $('<player><span id="name"></span> - Score:<span id="score">0</span></player>');
		newPlayer.find('#name').text(e.name);
		newPlayer.css({"background-color":e.color.background, "border-color": e.color.border});
		parent.info.playerBar.append(newPlayer);
		
	});
	
	
	this.panes.balls = $(poolHall.PANES.BALLSON);
	
	this._ballsOnTable('target');
	
	
	this.tools = $(poolHall.PANES.TOOLS);
	
	this.tools.find("[type='button']").button();
	
	this.tools.find("[type='button']").bind('click', function(e){
		var act = $(e.target).attr('id');
		if(act=="back"){
			parent.shotType = null;
			parent.selectedBall = null;
			parent.addedSinks = [];
			parent._toggleTools('target-select');
			
		}
		if(act=="back-two"){
			parent.addedSinks = [];
			parent.shotType = null;
			parent._toggleTools('target-selected');
			
		}
		if(act=="Easy-Shot" || act=="Easy-Miss"){
			parent.shotType = act;
			parent._toggleTools(act);
		}
		if(act=="Add-Sink"){
			parent._toggleTools(act);
		}
		if(act=="Confirm-Sinks"){
			parent._toggleTools(act);
		}
		
	
		console.log(parent);
	});
	
		
	this.playArea.append(this.panes.balls);
	this.game.append(this.panes.table);
	this.game.append(this.tools);
	
	
};

poolHall.prototype._ballsOnTable = function(state){
	this.panes.balls.html('');
	var parent = this;
	$.each(this.table.balls, function(k,e){
		
		if(state == "target"){if(e.sunk || e.name == "Cue"){return true;}};
		if(state == "selected"){
			if(parent.shotType == "Easy-Shot"){			
			if(k != parent.selectedBall){
				var doNotSkip = false;

				$.each(parent.addedSinks, function(i, v){
					if(k == v){doNotSkip = true; return false;}
				});
				if(!doNotSkip){
				return true;
				}
			}
			}else if(parent.shotType == "Easy-Miss"){
				var doNotSkip = false;

				$.each(parent.addedSinks, function(i, v){
					if(k == v){doNotSkip = true; return false;}
				});
				if(!doNotSkip){
				return true;
				}
			}else if(!parent.shotType){
				if(k != parent.selectedBall){
					return true;
				}
			}
			
			
		};
		if(state == "Add-Sink"){
			if(parent.shotType == "Easy-Shot"){
			if(e.sunk || k == parent.selectedBall){return true;}
			}else if(parent.shotType == "Easy-Miss"){
			if(e.sunk){return true;}	
			}
			
		};
		
		
		
		
		
		var newBall = $('<ball id="'+k+'"><img src="'+e.imgUrl+'" /></ball>');
			if(state == "target"){
				newBall.bind('click', function(e){
						parent.panes.balls.find('.added').removeClass('added');
						$(e.target).addClass('added');
						parent.selectedBall = $(e.target).attr('id');
						parent._toggleTools('target-selected');
					});	
			}
			if(state == "Add-Sink"){
				newBall.bind('click', function(e){
						$(e.target).toggleClass('added');
					});	
			}
		
		parent.panes.balls.append(newBall);
	})
};

poolHall.prototype._toggleTools = function(state){
	if(state=="target-selected"){
		this._ballsOnTable('selected');
		this.tools.children("div").css('display', 'none');	
		this.tools.children("div#result").css('display', 'block');	
		if(this.tools.css('right')!= "0"){
		this.tools.css({"right":"0"});
		if($('body').width()> $('body').height()){
		this.playArea.css({"right": (this.tools.width()*1.5)});
		}
		
		}
	};
	if(state=="target-select"){
		
		this._ballsOnTable('target');
		this.tools.children("div").css('display', 'none');
		if(this.tools.css('right')!= "-100%"){
		this.panes.balls.find('.added').removeClass('added');
		this.tools.css({"right":"-100%"});
		if($('body').width() > $('body').height()){
		this.playArea.css({"right":($('body').width()*0.1)});
		}
		}
	};
	if(state=="Easy-Shot"){
		this._ballsOnTable('selected');
		this.tools.children("div").css('display', 'none');	
		this.tools.children("div#Easy-Shot").css('display', 'block');	
	};
	
	if(state=="Easy-Miss"){
		this._ballsOnTable('selected');
		this.tools.children("div").css('display', 'none');	
		this.tools.children("div#Easy-Miss").css('display', 'block');	
	};
		
		
	if(state=="Add-Sink"){
		if($('body').width() > $('body').height()){
		this.playArea.css({"right":(this.tools.width()*1.5)});
		}
		this._ballsOnTable('Add-Sink');
		this.tools.children("div").css('display', 'none');	
		this.tools.children("div#Add-Sink").css('display', 'block');	
	};
	
	if(state=="Confirm-Sinks"){
		var temp = [];
		$('balls').find('.added').each(function(i,e){
			temp.push($(e).attr('id'));
		});
		this.addedSinks = temp;
		temp = null;
		
		if(this.shotType == "Easy-Shot" || this.shotType == "Easy-Miss"){
		this._ballsOnTable('selected');
		}
		
		this.tools.children("div").css('display', 'none');	
		
		this.tools.children("div#"+this.shotType).css('display', 'block');	
	};
};


poolHall.TABLE = function(hall){
	this._hall = hall;
	this._name = this._hall.panes.newGame.find('input#name-of-table').val();
	this._type = this._hall.panes.newGame.find('select#select-table-type').val();
	this.rules = {
		breakOrder : parseInt(this._hall.panes.newGame.find('#breaking-rules .selected').attr('value'),10),
		rotation : parseInt(this._hall.panes.newGame.find('#shot-rotation-rules .selected').attr('value'),10),
	};
	
	this._players = [];
	this.currentPlayer = 0;
	this.currentTurn = 0;
	this.currentGame = 0;
	this._timestamp = new Date(Date.now());
	this.shots = [];
	this.games = [];
	
	this.games.push(new poolHall.GAME(this));
	
	this._type = eval("poolHall.GAMETYPE."+this._type);
	
	
	this.balls = $.extend(true, {}, this._type.balls);

	
	var parent = this;
	
	this._hall.panes.pO.find("player").each(function(i,e){
		parent._players.push(new poolHall.PLAYER(parent));
		var player = parent._players.last();
		player.name = $(e).find('input#player-name').val();
		player.email = $(e).find('input#player-email').val();
		
		player.color.background = $(e).css('background-color');
		player.color.border = $(e).css('border-left-color');
	});
	
}



poolHall.PLAYER = function(table){
	this.table = table;
	this.name = null;
	this.email = null;
	this.color = {background:null,border:null};
	this.score = 0;
	this.shots = [];
	
};

poolHall.GAME = function(table){
	this.table = table;
	this.gameNumber = 0;
	this.shots = [];
	this.turn = 0;
	this.breakingPlayer = 0;
	this.timestamp = new Date(Date.now());
	
	this.results = {
		playerPlaces : [],
		playerScores : [],
		endTimestamp : null,		
	};
};

poolHall.SHOT = function(player, turn, target, result, addsinks){
	this._player = player;
	this._turn = turn;
	this._target = target;
	this._result = result;
	this._addsinks = addsinks;
	this._timestamp = new Date(Date.now());
};



poolHall.PANES = {
	NEWGAME : 
	'<pane id="new-game">'+
						'<div id="pt-logo"><span>pool</span><span>TRACK</span></div>'+
						'<label for="name-of-table" class="hidden">Table Name:</label>'+
						'<input type="text" name="name-of-table" id="name-of-table" placeholder="Name of Table" value="New Game" data-clear-btn="true" style="font-size:0.8em">'+
						'<label for="select-table-type" class="label-head"  data-theme="a">Table Type:</label>'+
  						'<select name="select-table-type" id="select-table-type">'+
						'</select>'+
						'<div id="table-rules-summary" data-role="collapsible" data-collapsed="true">'+
 						'<h3>Game Rules</h3>'+
  						'<p></p>'+
						'</div>'+
						'<div id="player-slider-block">'+
						'# of Players:'+
						'<label for="player-count" class="hidden"># of Players:</label>'+
						'<input type="text" data-type="range" name="player-count" id="player-count" value="2" min="2" max="12" data-highlight="true">'+
						'</div>'+
						'<div id="player-order"></div>'+
						
						'<div id="table-add-rules" data-role="collapsible" data-collapsed="false">'+
 						'<h3>Set Rules</h3>'+
  						'<p>'+
						'<div id="breaking-rules">'+
						'Who Breaks?<BR />'+
						'<div class="toggle selected" value="0">Rotate Break Every Game</div>'+
						'<div class="toggle" value="1">Winner Always Breaks</div>'+
						'<div class="toggle" value="2">Loser Always Breaks</div>'+						
						'</div>'+
						
						'<div id="shot-rotation-rules">'+
						'Shot Rotation?<BR />'+
						'<div class="toggle selected" value="0">Standard</div>'+
						'<div class="toggle" value="1">Every Shot</div>'+		
						'</div>'+

						'</p>'+
						'</div>'+

			'<input type="button" value="Start Game!" id="start-game" data-theme="a" />'+
		
		
	'</pane>',
	TABLE :
	'<pane id="table">'+
			'<div id="table-stats">'+
			'<span id="table-info"><span id="table-name"></span><span id="table-details"> - Game/Turn #:<span id="game-number">1</span>/<span id="turn-number">1</span></span></span>'+
			'<span id="player-bar"></span>'+
			'</div>'+		
	'</pane>',
	BALLSON : '<balls></balls>',
	TOOLS : "<div id='tools'>"+
	"<div id='result'>"+
	'<input type="button" value="Easy-Shot" id="Easy-Shot" data-theme="a" data-mini="true" />'+
	'<input type="button" value="Easy-Miss" id="Easy-Miss" data-theme="a" data-mini="true" />'+
	'<input type="button" value="Hard-Shot" id="Hard-Shot" data-theme="a" data-mini="true" />'+
	'<input type="button" value="Hard-Miss" id="Hard-Miss" data-theme="a" data-mini="true" />'+
	'<input type="button" value="Safe-Shot" id="Safe-Shot" data-theme="a" data-mini="true" />'+
	'<input type="button" value="Foul-Shot" id="Foul-Shot" data-theme="b" data-mini="true" />'+
	'<input type="button" value="Back" id="back" data-theme="a" data-mini="true" />'+
	"</div>"+
	"<div id='Easy-Shot'>"+
	'<input type="button" value="Add-Sink(s)" id="Add-Sink" data-theme="b" data-mini="true" />'+
	'<input type="button" value="Add-Off-Table(s)" id="Add-Off-Tables" data-theme="b" data-mini="true" />'+
	'<input type="button" value="Confirm-Shot" id="Confirm-Shot" data-theme="a" data-mini="true" />'+
	'<input type="button" value="Back" id="back-two" data-theme="a" data-mini="true" />'+
	'<input type="button" value="Cancel" id="back" data-theme="a" data-mini="true" />'+
	"</div>"+
	"<div id='Easy-Miss'>"+
	'<input type="button" value="Add-Sink(s)" id="Add-Sink" data-theme="b" data-mini="true" />'+
	'<input type="button" value="Add-Off-Table(s)" id="Add-Off-Tables" data-theme="b" data-mini="true" />'+
	'<input type="button" value="Confirm-Shot" id="Confirm-Shot" data-theme="a" data-mini="true" />'+
	'<input type="button" value="Back" id="back-two" data-theme="a" data-mini="true" />'+
	'<input type="button" value="Cancel" id="back" data-theme="a" data-mini="true" />'+
	"</div>"+
	"<div id='Add-Sink'>"+
	'<input type="button" value="Confirm-Sinks" id="Confirm-Sinks" data-theme="a" data-mini="true" />'+
	'<input type="button" value="Back" id="back-two" data-theme="a" data-mini="true" />'+
	"</div>"+
	"</div>",
};



poolHall.PLAYER.newPlayerBlock = 
"<player>"+
'<div class="ui-grid-a">'+
  '<div class="ui-block-a" style="width:20%;">'+
  	"<div id='color'>"+
	"</div>"+
  '</div>'+
  '<div class="ui-block-b" style="width:80%;">'+
  	'<label for="player-name" class="hidden"></label>'+
	'<input type="text" name="player-name" id="player-name" placeholder="Player Name" value="" data-clear-btn="true" >'+
	'<label for="player-email" class="hidden"></label>'+
	'<input type="text" name="player-email" id="player-email" placeholder="Player Email" value="" data-clear-btn="true" data-mini="true" data-type="email">'+
  '</div>'+
'</div>'+



"</player>"

poolHall.GAMETYPE = {
Eight_Ball_Crazy : {
			name : "Crazy Eight-Ball",
			outline : "Players can shoot at any ball, must declair a target shot before every shot.  Each ball is valued at its face number.<BR/>"+
			"There four kinds of shots:Easy, Hard, Safe, Foul. An Easy shot is defined as a single target ball and a pocket with no intent to play a bank, carum, massay, jump or other variation on a basic shot.<BR/>"+
			"A Hard shot is defined as any variation of a basic shot, including combos declairing more then one target ball and pocket, banks, carums, massays, jumps, etc. Any additonally sunk balls undeclaired do not contribute to score, player must declair the secondary balls and pockets but does not have to specify any additonal carums,banks,ect.  A hard shot is considered missed, if all conditions of the primary target shot are not met, and if any secondary declirations do not go into their target pocket.<BR/>"+
			"In both Hard and Safe shots, any balls that sink in additon to undeclaired targets will have its face value deducted from the shooters score.<BR/>"+
			"A Safe shot is declaired with a target ball and no target pocket, if a ball goes in on a safe it becomes a foul shot or if the target ball/cue ball do not hit a rail after their intital contact it is also considered a foul.<BR/>"+
			"Foul shot's are defined as a shot that did not result in the players declaired intent, a ball going off the table, scratching, no rail contact after initial target contact.  Any balls that go off the table or are sunk during a foul shot will have their face value deducted from the shooters score, with any balls that went off the table being returned to play by the next player in rotation as close to the center rack point as possible.<BR/>"+
			"Any shot where the Cue ball is sunk, or goes off the table counts as Foul shot with all balls that were sunk being deducted from the shooting players score.<BR/>",
			scoring: 
			"<ul>"+
			"<li>Easy-Shot : Balls Face Value</li>"+
			"<li>Hard-Shot : 2x Balls Face Value</li>"+
			"<li>Safe-Shot : No Score Change</li>"+
			"<li>Easy-Miss : Minus 2x Balls Face Value</li>"+
			"<li>Hard-Miss : Minus Balls Face Value for All Declaired Sinks</li>"+
			"<li>Scratch : Minus Value of Cue Ball and Minus Face Value of all sunk Balls</li>"+
			"<ul>",
			minPlayers : 2,
			maxPlayers : 4,
			balls : {
				Cue : {
		id : 0,
		name : "Cue",
		rules : {
			make : -50,
		},
		imgUrl : "./imgs/balls/Cue.png",
		sunk : false,
		},
	One : {
		id : 1,
		name : "One",
		rules : {
			make : 1,
			miss : -2,
			hard_shot_make : 2,
			hard_shot_miss : -1,
		},
		imgUrl : "./imgs/balls/1.png",
		sunk : false,
	},
	Two : {
		id : 2,
		name : "Two",
		rules : {
			make : 2,
			miss : -4,
			hard_shot_make : 4,
			hard_shot_miss : -2,
		},
		imgUrl : "./imgs/balls/2.png",
		sunk : false,
	},
	Three : {
		id : 3,
		name : "Three",
		rules : {
			make : 3,
			miss : -6,
			hard_shot_make : 6,
			hard_shot_miss : -3,
		},
		imgUrl : "./imgs/balls/3.png",
		sunk : false,
	},
	Four : {
		id : 4,
		name : "Four",
		rules : {
			make : 4,
			miss : -8,
			hard_shot_make : 8,
			hard_shot_miss : -4,
		},
		imgUrl : "./imgs/balls/4.png",
		sunk : false,
	},
	Five : {
		id : 5,
		name : "Five",
		rules : {
			make : 5,
			miss : -10,
			hard_shot_make : 10,
			hard_shot_miss : -5,
		},
		imgUrl : "./imgs/balls/5.png",
		sunk : false,
	},
	Six : {
		id : 6,
		name : "Six",
		rules : {
			make : 6,
			miss : -12,
			hard_shot_make : 12,
			hard_shot_miss : -6,
		},
		imgUrl : "./imgs/balls/6.png",
		sunk : false,
	},
	Seven : {
		id : 7,
		name : "Seven",
		rules : {
			make : 7,
			miss : -14,
			hard_shot_make : 14,
			hard_shot_miss : -7,
		},
		imgUrl : "./imgs/balls/7.png",
		sunk : false,
	},
	Eight : {
		id : 8,
		name : "Eight",
		rules : {
			make : 8,
			miss : -16,
			hard_shot_make : 16,
			hard_shot_miss : -8,
		},
		imgUrl : "./imgs/balls/8.png",
		sunk : false,
	},
	Nine : {
		id : 9,
		name : "Nine",
		rules : {
			make : 9,
			miss : -18,
			hard_shot_make : 18,
			hard_shot_miss : -9,
		},
		imgUrl : "./imgs/balls/9.png",
		sunk : false,
	},
	Ten : {
		id : 10,
		name : "Ten",
		rules : {
			make : 10,
			miss : -20,
			hard_shot_make : 20,
			hard_shot_miss : -10,
		},
		imgUrl : "./imgs/balls/10.png",
		sunk : false,
	},
	Eleven : {
		id : 11,
		name : "Eleven",
		rules : {
			make : 11,
			miss : -22,
			hard_shot_make : 22,
			hard_shot_miss : -11,
		},
		imgUrl : "./imgs/balls/11.png",
		sunk : false,
	},
	Twelve : {
		id : 12,
		name : "Twelve",
		rules : {
			make : 12,
			miss : -24,
			hard_shot_make : 24,
			hard_shot_miss : -12,
		},
		imgUrl : "./imgs/balls/12.png",
		sunk : false,
	},
	Thirt : {
		id : 13,
		name : "Thirteen",
		rules : {
			make : 13,
			miss : -26,
			hard_shot_make : 26,
			hard_shot_miss : -13,
		},
		imgUrl : "./imgs/balls/13.png",
		sunk : false,
	},
	Fourt : {
		id : 14,
		name : "Fourteen",
		rules : {
			make : 14,
			miss : -28,
			hard_shot_make : 28,
			hard_shot_miss : -14,
		},
		imgUrl : "./imgs/balls/14.png",
		sunk : false,
	},
	Fift : {
		id : 15,
		name : "Fifteen",
		rules : {
			make : 15,
			miss : -30,
			hard_shot_make : 30,
			hard_shot_miss : -15,
		},
		imgUrl : "./imgs/balls/15.png",
		sunk : false,
	}
	}
},		Crazy_Nine_Ball : {
			name : "Crazy Nine-Ball",
				outline : "COMING SOON...<BR/>",
			scoring: 
			"<ul>"+
			"<li>Coming soon...</li>"+
			"<ul>",
			balls : {
				Cue : {
		id : 0,
		name : "Cue",
		rules : {
			make : -50,
		},
		imgUrl : "./imgs/balls/Cue.png",
		sunk : false,
	},
	One : {
		id : 1,
		name : "One",
		rules : {
			make : 1,
			miss : -2,
			hard_shot_make : 2,
			hard_shot_miss : -1,
		},
		imgUrl : "./imgs/balls/1.png",
		sunk : false,
	},
	Two : {
		id : 2,
		name : "Two",
		rules : {
			make : 2,
			miss : -4,
			hard_shot_make : 4,
			hard_shot_miss : -2,
		},
		imgUrl : "./imgs/balls/2.png",
		sunk : false,
	},
	Three : {
		id : 3,
		name : "Three",
		rules : {
			make : 3,
			miss : -6,
			hard_shot_make : 6,
			hard_shot_miss : -3,
		},
		imgUrl : "./imgs/balls/3.png",
		sunk : false,
	},
	Four : {
		id : 4,
		name : "Four",
		rules : {
			make : 4,
			miss : -8,
			hard_shot_make : 8,
			hard_shot_miss : -4,
		},
		imgUrl : "./imgs/balls/4.png",
		sunk : false,
	},
	Five : {
		id : 5,
		name : "Five",
		rules : {
			make : 5,
			miss : -10,
			hard_shot_make : 10,
			hard_shot_miss : -5,
		},
		imgUrl : "./imgs/balls/5.png",
		sunk : false,
	},
	Six : {
		id : 6,
		name : "Six",
		rules : {
			make : 6,
			miss : -12,
			hard_shot_make : 12,
			hard_shot_miss : -6,
		},
		imgUrl : "./imgs/balls/6.png",
		sunk : false,
	},
	Seven : {
		id : 7,
		name : "Seven",
		rules : {
			make : 7,
			miss : -14,
			hard_shot_make : 14,
			hard_shot_miss : -7,
		},
		imgUrl : "./imgs/balls/7.png",
		sunk : false,
	},
	Eight : {
		id : 8,
		name : "Eight",
		rules : {
			make : 8,
			miss : -16,
			hard_shot_make : 16,
			hard_shot_miss : -8,
		},
		imgUrl : "./imgs/balls/8.png",
		sunk : false,
	},
	Nine : {
		id : 9,
		name : "Nine",
		rules : {
			make : 9,
			miss : -18,
			hard_shot_make : 18,
			hard_shot_miss : -9,
		},
		imgUrl : "./imgs/balls/9.png",
		sunk : false,
	}
  }
}


};