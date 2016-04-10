Array.prototype.last = function() {
    return this[this.length-1];
}


Array.prototype.shuffle = function(){
var currentIndex = this.length, temporaryValue, randomIndex;
 while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
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



TABLE = function(name, id){
	this.name = name || "New Game";
	this.id = id || null;
	this.dom = {};
	this.dom.master = $('game');
	
	this._init();
};

TABLE.prototype._init = function(){
	if(this.id){
	}else{
	this._createData();
	}
};

TABLE.prototype._createData = function(){
	this.players = [];
	var ball = TABLE.BALLS;
	this.games = [];
	this.ballArray = [
	$.extend(true, {}, ball.Cue),
	$.extend(true, {}, ball.One),
	$.extend(true, {}, ball.Two),
	$.extend(true, {}, ball.Three),
	$.extend(true, {}, ball.Four),
	$.extend(true, {}, ball.Five),
	$.extend(true, {}, ball.Six),
	$.extend(true, {}, ball.Seven),
	$.extend(true, {}, ball.Eight),
	$.extend(true, {}, ball.Nine),
	$.extend(true, {}, ball.Ten),
	$.extend(true, {}, ball.Eleven),
	$.extend(true, {}, ball.Twelve),
	$.extend(true, {}, ball.Thirt),
	$.extend(true, {}, ball.Fourt),
	$.extend(true, {}, ball.Fift),
	];
	this._start();
};

TABLE.prototype._start = function(){
	var newPop = $(TABLE.DOM.start);
	$('body').append(newPop);
	var parent = this;
	$( "input#number-of-players" ).slider();
	$( "#input#table-name").textinput();
	newPop.find('button').bind('click', function(e){
		newPop.remove();
		var gameName = newPop.find('input#table-name').val();
		if(gameName && gameName != ""){
			parent.name = gameName;
		}
		parent._assignPlayers(newPop.find('input#number-of-players').val());
	});
	
};

TABLE.prototype._assignPlayers = function(players){
	if(players){
	for(var i =0; i<players; i++){
		this.players.push(new TABLE.PLAYER("Player "+(i+1)));
	}
	}
	
	var newPop = $(TABLE.DOM.Player.setup.popup);
	$('body').append(newPop);
	var insertTarget = newPop.find('div#player-blocks');
	var parent = this;
	$.each(this.players,function(i,e){
		var newPlayer = $(TABLE.DOM.Player.setup.playerBlock);
		newPlayer.attr('id',i);
		newPlayer.find('input#player-name').val(e.name);
		
		var tempColor;
		if(players){
		tempColor = randomColor();
		}else{
			var colorFix = e.color.substring(4,e.color.length-1);
			colorFix = colorFix.split(",");
			colorFix = {r:colorFix[0],g:colorFix[1],b:colorFix[2]};
			tempColor = colorFix;	
		}
		
		newPlayer.find('#player-color').ColorPicker({
		color: tempColor,
			onShow: function (colpkr) {
			$(colpkr).fadeIn(300);
			return false;
			},
			onHide: function (colpkr) {
			$(colpkr).fadeOut(300);
			newPlayer.parent().focus();
			return false;
			},
			onChange: function (hsb, hex, rgb) {
			newPlayer.find('#player-color').css('background-color', "#" + hex);
			}
		}).css('background-color', "rgb("+tempColor.r+","+tempColor.g+","+tempColor.b+")");
		
		
		insertTarget.append(newPlayer);
		
	});	
	
	newPop.find("input").textinput();
	
	newPop.find('button').click(function(e){
		var act = $(e.target).attr('act');
		
			if(act=='back'){
				newPop.remove();
				parent._createData();	
			}
			if(act=='confirm'){
				newPop.find('player').each(function(i, e) {
					var curPlayer = parseInt($(e).attr('id'),10);
                    parent.players[curPlayer].color = $(e).find('color').css('background-color');
					parent.players[curPlayer].name = $(e).find('input#player-name').val();
					parent.players[curPlayer].email = $(e).find('input#player-email').val();
                });
				newPop.remove();
				$('.colorpicker').remove();
				
				parent._assignOrder();	
			}
	});

};

TABLE.prototype._assignOrder = function(){
	var newPop = $(TABLE.DOM.Player.assignOrder.popup);
	$('body').append(newPop);
	var insertTarget = newPop.find('div#player-blocks');
	var parent = this;
	$.each(this.players,function(i,e){
		
		var newPlayer = $(TABLE.DOM.Player.assignOrder.playerBlock);
		newPlayer.attr('id',i);
		newPlayer.css('background-color', e.color);
		newPlayer.find('#player-name').text(e.name);
		newPlayer.find('#player-email').text(e.email);
		insertTarget.append(newPlayer);
	});
	
	newPop.find('button').click(function(e){
		var act = $(e.target).attr('act');
		console.log(act);
		
			if(act=="move-up"){
				var player = $(e.target).parent().parent().parent();
				player.insertBefore(player.prev('player'));	
			}
			if(act=="move-down"){
				var player = $(e.target).parent().parent().parent();
				player.insertAfter(player.next('player'));	
			}
			if(act=="back"){
				newPop.remove();
				parent._assignPlayers();
			}
			if(act=="confirm"){
				var order = [];
					newPop.find('player').each(function(i, e) {
                        order.push(parent.players[parseInt($(e).attr('id'),10)]);
                    });
					
					parent.players = order;
					newPop.remove();
					parent._startGame();
			}
	});
	
};

TABLE.prototype._startGame = function(newTurn){
	var infobox, gamebox;
	
	if(!newTurn){
	this.startPlayer = 0;
	if(this.games.length){
		this.startPlayer = this.games.last().startingPlayer + 1;
		if(this.startPlayer > this.players.length-1){
			this.startPlayer = 0;
		}
	}
	
	this.currentPlayer = this.startPlayer;
	
	this.games.push(new TABLE.GAME());
	
	infobox = $(TABLE.DOM.Game.infobox);
	gamebox = $(TABLE.DOM.Game.gamebox);
	infobox.find('#game-name').text(this.name);
	infobox.find('#game-count').text(this.games.length);
	infobox.find('#game-turn').text(this.games.last().currentTurn);
		
	$('body').append(gamebox);
	this.dom.gamebox = gamebox;
	
	$('body').append(infobox);
	this.dom.infobox = infobox;
	this.targetBall;
	
	}else{
	
	infobox = $('info');
	gamebox = $('gamebox');
	infobox.find('#game-turn').text(this.games.last().currentTurn);
		
	}
	
	
	var player = this.players[this.currentPlayer];
	
	
	
	
	
	infobox.find('player #player-name').text(player.name);
	infobox.find('player #player-score').text(player.score);
	
	if(player.score < 0 ){
	infobox.find('player #player-score').addClass('negitive');
	}
	infobox.find('player').css('background-color', player.color);	
	
	
	var balltarget = gamebox.children('balls#mainTarget');
	var addsink = gamebox.children('balls#add-sinks');
	var phaseBox = infobox.find('#phase');
	var topButtons = infobox.find('#topButtons');
	
	if(balltarget.not(':visible')){
		balltarget.fadeIn(600);
	}
	
	balltarget.html('');
	$.each(this.ballArray,function(i, e){
		if(!i || e.sunk){
		return true
		}
		var newBall = $('<ball id="'+i+'"><img src="'+e.imgUrl+'" /></ball>');
		newBall.attr('act','target-ball');
		balltarget.append(newBall);
	});
	
if(!newTurn){
	var parent = this;
	this.dom.gamebox.bind('click',function(e){
		var target = $(e.target);
			if(target.attr('act')){
				var act = target.attr('act');
				if(act == "target-ball"){
					
					parent.targetBall = parseInt(target.attr('id'),10);
					balltarget.fadeOut(600);
					parent.dom.gamebox.children('results').fadeIn(600);
					phaseBox.text("- Shot Results? -");
					topButtons.html('');
					
				}
				
				if(act == 'result' ){
					addsink.html("");
					parent.dom.gamebox.children('results').fadeOut(600);
					parent.currentShot = target.attr('id');
					
					$.each(parent.ballArray, function(i,e){
						if(i == parent.targetBall || e.sunk){
						return true	
						}
					
						
						var newBall = $('<ball id="'+i+'"><img src="'+e.imgUrl+'" /></ball>');
						newBall.attr('act','add-sink');
						addsink.append(newBall);
						
						});
					
					addsink.fadeIn(600);
					phaseBox.text("- Additonal Balls -");
					topButtons.append($(TABLE.DOM.Game.topButtons.goBack));
					topButtons.append($(TABLE.DOM.Game.topButtons.endTurn));	
				}
				
				if(act == 'add-sink'){
					target.toggleClass('added');
				}
				
				if(act == 'go-back'){
					if(parent.dom.gamebox.children('results').is(':visible')){
					parent.dom.gamebox.children('results').fadeOut(600);
					balltarget.fadeIn(600);
					phaseBox.text("- Select Target Ball -");
					topButtons.html('');
					}
				}
			}
		});
		
		topButtons.bind('click', function(e){
			var target = $(e.target);
			if(target.attr('act')){
				var act = target.attr('act');
				if(act == "go-back"){
					addsink.fadeOut(600);
					parent.dom.gamebox.children('results').fadeIn(600);
					phaseBox.text("- Shot Results? -");
					topButtons.html('');
					
				}
				if(act=='end-turn'){
					var addsinkArray = [];
					addsink.find('ball.added').each(function(i, e){
							addsinkArray.push(parent.ballArray[parseInt($(e).attr('id'),10)]);
					});
					
					if(parent.currentShot == "easy-shot" || parent.currentShot == "hard-shot"){
						addsinkArray.push(parent.ballArray[parent.targetBall]);
					}
					 
					 parent.newShot = new TABLE.SHOT(parent.players[parent.currentPlayer], parent.targetBall, parent.currentShot, addsinkArray);
					 addsink.fadeOut(0);
					 topButtons.html('');
					 topButtons.append($(TABLE.DOM.Game.topButtons.cancelShot));
					 topButtons.append($(TABLE.DOM.Game.topButtons.acceptShot));
					 var newPop = $(TABLE.DOM.Game.shotReport);
					 newPop.children('#player-name').text(parent.players[parent.currentPlayer].name);
					 var curScore = parent.players[parent.currentPlayer].score;
					 
					 newPop.children('#player-score').text(curScore);
					 if(curScore < 0){
						 newPop.children('#player-score').addClass('negative'); 
					 }
					 
					 var shotSum = "";
					 var scratchTrigger = false;
					 var shotValue = 0;
					 
					 $.each(parent.newShot.result, function(i,e){
					 	if(e.name == "Cue"){
							scratchTrigger = true;
							return false
						}
					 });
					 
					 if(scratchTrigger){
						shotValue += parent.ballArray[0].rules.make;
					 	shotSum += "Scrached on a ";
						if(parent.newShot.type == "easy-shot"){
						shotValue += parent.ballArray[parent.newShot.target].rules.make*-1;
						shotSum += "easy shot, ";
						}else if(parent.newShot.type == "easy-miss"){
						shotValue += parent.ballArray[parent.newShot.target].rules.miss;
						shotSum += "easy miss, ";
						}else if(parent.newShot.type == "hard-shot"){
						shotValue += parent.ballArray[parent.newShot.target].rules.hard_shot_make*-1;
						shotSum += "hard shot, ";
						}else if(parent.newShot.type == "hard-miss"){
						shotValue += parent.ballArray[parent.newShot.target].rules.hard_shot_miss;
						shotSum += "hard miss, ";
						}else if(parent.newShot.type == "safe-shot"){
						shotSum += "safe shot, ";
						}
						shotSum += "while shooting at the ";
						
					 }else{
						if(parent.newShot.type == "easy-shot"){
						shotValue += parent.ballArray[parent.newShot.target].rules.make;
						shotSum += "Made an easy shot on the ";
						}else if(parent.newShot.type == "easy-miss"){
						shotValue += parent.ballArray[parent.newShot.target].rules.miss;
						shotSum += "Missed an easy shot on the ";
						}else if(parent.newShot.type == "hard-shot"){
						shotValue += parent.ballArray[parent.newShot.target].rules.hard_shot_make;
						shotSum += "Made an hard shot on the ";
						}else if(parent.newShot.type == "hard-miss"){
						shotValue += parent.ballArray[parent.newShot.target].rules.hard_shot_miss;
						shotSum += "Missed an hard shot on the ";
						}else if(parent.newShot.type == "safe-shot"){
						shotSum += "Played an safe shot on the ";
						}
						
						 
					 }
					 
					 shotSum += parent.ballArray[parent.newShot.target].name+" ball. ";
					 console.log(parent.newShot.result);
					 if(parent.newShot.result.length >= 1){
						 var textTrigger = false;
						$.each(parent.newShot.result, function(i,e){
							if(e.name == parent.ballArray[parent.newShot.target].name || e.name == "Cue" ){
								return true
							}
							if(!textTrigger){
							shotSum += "The "
							textTrigger = true;
							}
							if(!scratchTrigger){
								if(parent.newShot.type == "safe-shot"){
									shotValue += e.rules.make*-1;
								}else{
									shotValue += e.rules.make;
								}
							
							}else{
							shotValue += e.rules.make*-1;	
							}
							
							shotSum+=e.name+", ";
						});
						shotSum = shotSum.substring(0, shotSum.length-2);
						shotSum += " ball(s) were also made."
					 }
					 
					 
					 newPop.children('#shot-summary').text(shotSum);
					 newPop.children('#shot-score').text(shotValue);
					 
					 if(shotValue < 0){
						newPop.children('#shot-score').addClass('negitive'); 
					 }
					 
					 parent.newShot.value = shotValue;
					 
					 $('body').append(newPop);
					 
					
				}
				
			}
			
			if(act=='cancel-shot'){
				addsink.html("");
					$('pop#shot-report').remove();
					
					
					$.each(parent.ballArray, function(i,e){
						if(i == parent.targetBall){
						return true	
						}
					
						
						var newBall = $('<ball id="'+i+'"><img src="'+e.imgUrl+'" /></ball>');
						newBall.attr('act','add-sink');
						addsink.append(newBall);
						
						});
					
					addsink.fadeIn(600);
					phaseBox.text("- Additonal Balls -");
					topButtons.html('');
					topButtons.append($(TABLE.DOM.Game.topButtons.goBack));
					topButtons.append($(TABLE.DOM.Game.topButtons.endTurn));
					
			}
			
			if(act=='accept-shot'){
				$('pop').remove();
				parent._completeTurn();
			}
			
		});
}
	
};

TABLE.prototype._completeTurn = function(){
	var parent = this;
	parent.players[parent.currentPlayer].shotRecord.push($.extend(true, {}, parent.newShot));
	parent.games.last().shots.push(parent.players[parent.currentPlayer].shotRecord.last());
	

	$.each(parent.newShot.result, function(i,e){
		if(e.name == "Cue"){
			return true	
		}
		e.sunk = true;
	});
	
	
	var gameOver = true;
	$.each(parent.ballArray, function(i,e){
		if(!i){
			return true	
		}
		if(!e.sunk){
			gameOver = false;
		}
	});
	
	if(!gameOver){
		parent.players[parent.currentPlayer].score += parent.newShot.value;
		parent.currentPlayer++;
		if(parent.currentPlayer>parent.players.length-1){
			parent.currentPlayer = 0;
		}
		
		parent.currentTurn++;
		
		
		$('#topButtons').html('');
		parent._startGame(true);
		
	}
	
	
};



/*OBJECTS*/
TABLE.DOM = {
	start : "<pop id='start'>"+
			"<h1 name='New Match' />"+	
			'<label for="table-name">Table Name:</label>'+
			'<input type="text" name="table-name" id="table-name" value="New Game" data-defaults="true">'+
			'<label for="number-of-players" class="hidden">Input slider:</label>'+
			'<input name="number-of-players" id="number-of-players" value="2" min="1" max="8">'+
			'<options><button name="OK!" id="ok" act="confirm"/></options>'+
			"</pop>",
	Player : {
			setup : {
				popup : 
				"<pop id='player-setup'>"+
				"<h1 name='Player Setup' />"+	
				"<div id='player-blocks'></div>"+
				'<options><button name="Back" id="back" act="back"/>'+
				'<button name="OK!" id="ok" act="confirm"/></options>'+				
				"</pop>",
				playerBlock :
				"<player>"+
				'<div class="ui-grid-a">'+
				'<div class="ui-block-a" style="width:20%">'+
				'<div id="color-wrap"><color id="player-color"></color></div>'+
				'</div>'+
				'<div class="ui-block-b" style="width:80%">'+
				'<label for="player-name" class="hidden">Player:</label>'+
				'<input type="text" name="player-name" id="player-name" value="" data-defaults="true">'+
				'<label for="player-email" class="hidden">Player:</label>'+
				'<input type="email" name="player-email" id="player-email" value="player@email.com" data-defaults="true">'+
				'<label for="player-color" class="hidden">Player:</label>'+
				'</div>'+
				'</div>'+
				"</player>",
			},
			assignOrder:{
				popup : 
				"<pop id='player-setup'>"+
				"<h1 name='Player Order' />"+	
				"<div id='player-blocks'></div>"+
				'<options><button name="Back" id="back" act="back"/>'+
				'<button name="OK!" id="ok" act="confirm"/></options>'+				
				"</pop>",
				playerBlock :
				"<player>"+
				'<div class="ui-grid-a">'+
				'<div class="ui-block-a padfix" style="width:20%" >'+
				'<button name="Move Up" act="move-up" /><BR /><button name="Move Down" act="move-down" />'+
				'</div>'+
				'<div class="ui-block-b">'+
				'<div name="player-name" id="player-name" ></div>'+
				'<div name="player-name" id="player-email" ></div>'+
				'</div>'+
				"</player>",
				
			},
			
	},
	Game: {
		infobox : 
		"<info>"+
		"<span id='game-name'></span>"+
		"Game/Turn&nbsp;(<span id='game-count'></span>"+
		":<span id='game-turn'></span>)&nbsp;"+
		"<player>"+
		"<span id='player-name'></span>"+
		"<span id='player-score'></span>"+
		"</player>"+
		"<span id='phase'> - Select Target Ball -</span>"+
		"<span id='topButtons'></span>"+
		"</info>",
		gamebox : "<gamebox><balls id='mainTarget'></balls>"+
		"<results>"+
		
				'<div class="ui-grid-e">'+
				'<div class="ui-block-a >'+
				'<label for="easy-shot" class="hidden" />'+
				'<button type="button" name="easy-shot" id="easy-shot" value="" act="result" data-defaults="true" />'+
				'</div>'+
				'<div class="ui-block-b >'+
				'<label for="easy-miss" class="hidden" />'+
				'<button type="button" name="easy-miss" id="easy-miss" value="" act="result" data-defaults="true" />'+
				'</div>'+
				'<div class="ui-block-c >'+
				'<label for="hard-shot" class="hidden" />'+
				'<button type="button" name="hard-shot" id="hard-shot" value="" act="result" data-defaults="true" />'+
				'</div>'+
				'<div class="ui-block-d >'+
				'<label for="hard-miss" class="hidden" />'+
				'<button type="button" name="hard-miss" id="hard-miss" value="" act="result" data-defaults="true" />'+
				'</div>'+
				'<div class="ui-block-d >'+
				'<label for="safe-shot" class="hidden" />'+
				'<button type="button" name="safe-shot" id="safe-shot" value="" act="result" data-defaults="true" />'+
				'</div>'+
				
				'</div>'+
				'<BR />'+
				'<label for="go-back" class="hidden" />'+
				'<button type="button" name="Go Back" id="go-back" value="" act="go-back" data-defaults="true" />'+

		
		"</results>"+
		"<balls id='add-sinks'></balls></gamebox>",
		topButtons : {
			newGame : 
				'<label for="new-game" class="hidden" />'+
				'<button type="button" name="New Game" id="new-game" value="" act="new-game" data-defaults="true" />',
			endGame : 
				'<label for="end-game" class="hidden" />'+
				'<button type="button" name="End Game" id="end-game" value="" act="end-game" data-defaults="true" />',
			goBack : 
				'<label for="go-back" class="hidden" />'+
				'<button type="button" name="Go Back" id="go-back" value="" act="go-back" data-defaults="true" />',
			endTurn : 
				'<label for="end-turn" class="hidden" />'+
				'<button type="button" name="End Turn" id="end-Turn" value="" act="end-turn" data-defaults="true" />',
			acceptShot : 
				'<label for="accept-shot" class="hidden" />'+
				'<button type="button" name="Accept Shot" id="accept-shot" value="" act="accept-shot" data-defaults="true" />',
			cancelShot : 
				'<label for="cancel-shot" class="hidden" />'+
				'<button type="button" name="Cancel Shot" id="cancel-shot" value="" act="cancel-shot" data-defaults="true" />',		
		},
	shotReport :
	"<pop id='shot-report'>"+
	"<h1 name='Turn Report' />"+
	"<span id='player-name'></span> - Current Score:"+	
	"<span id='player-score'></span><BR />"+
	"<span id='shot-summary'></span><BR />"+
	"Shot Score: <span id='shot-score'></span>"+		
	"</pop>",
		
	}
};

TABLE.BALLS = {
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
	},

};

TABLE.PLAYER = function(name){
	this.name = name;
	this.email = "Player Email";
	this.color = null;
	this.score = 0;
	this.shotRecord = [];
};

TABLE.SHOT = function(player, target, type, result){
	this.player = player;
	this.target = target;
	this.type = type;
	this.result = result;
};

TABLE.GAME = function(){
	this.startingPlayer = 0;
	this.currentTurn = 1;
	this.shots = [];
	this.timestamp = new Date(Date.now());
};