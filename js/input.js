var keyboard = null;

keyboard = new THREEx.KeyboardState();

var InputManager = {

    handlePressInput: function(event) {
		// only handle input when no other DOM element has focus.
		if (document.activeElement != document.body) return;

        if (event.repeat) {
			event.preventDefault();
            return;
        }
        if ( keyboard.eventMatches(event, 'left') ||
			 keyboard.eventMatches(event, 'a')) {
            event.preventDefault();
			heart.move("left");
        }
        if ( keyboard.eventMatches(event, 'right') ||
			 keyboard.eventMatches(event, 'd')) {
            event.preventDefault();
			heart.move("right");
        }
        if ( keyboard.eventMatches(event, 'up') ||
			 keyboard.eventMatches(event, 'w')) {
            event.preventDefault();
			if (maruju.rootScene.play_state == "main-menu"){
				menu.moveUp();
			} 
			else if (maruju.rootScene.play_state == "music-menu"){
				musicmenu.moveUp();
			} 
			else if (maruju.rootScene.play_state == "difficulty-menu"){
				diffmenu.moveUp();
			} 
			
			else {
				heart.move("up");
			}
        }
        if ( keyboard.eventMatches(event, 'down') ||
			 keyboard.eventMatches(event, 's')) {
            event.preventDefault();
			if (maruju.rootScene.play_state == "main-menu"){
				menu.moveDown();
			}
			else if (maruju.rootScene.play_state == "music-menu"){
				musicmenu.moveDown();
			} 
			else if (maruju.rootScene.play_state == "difficulty-menu"){
				diffmenu.moveDown();
			}
        }
    	if ( keyboard.eventMatches(event, 'z') ||
			 keyboard.eventMatches(event, 'space') ||
	 		 keyboard.eventMatches(event, 'enter')) {
      		event.preventDefault();
			if (maruju.rootScene.play_state == "main-menu"){
				menu.select();
			} 
			else if (maruju.rootScene.play_state == "music-menu"){
				musicmenu.select();			
			} 
			else if (maruju.rootScene.play_state == "difficulty-menu"){
				diffmenu.select();
			}
			else {
				sans.advanceTextA();
			}
    	}
		if ( keyboard.eventMatches(event, 'x')) {
			event.preventDefault();
			sans.advanceTextB();
		}
    },

	handleReleaseInput: function(event) {
		if ( keyboard.eventMatches(event, 'z') ||
	 		 keyboard.eventMatches(event, 'x') ||
	 	     keyboard.eventMatches(event, 'space') ) {
			event.preventDefault();
		}
		if ( keyboard.eventMatches(event, 'left') ||
			 keyboard.eventMatches(event, 'a')) {
            event.preventDefault();
			heart.move("clear_h");
        }
        if ( keyboard.eventMatches(event, 'right') ||
			 keyboard.eventMatches(event, 'd')) {
            event.preventDefault();
			heart.move("clear_h");
        }
        if ( keyboard.eventMatches(event, 'up') ||
			 keyboard.eventMatches(event, 'w')) {
            event.preventDefault();
			heart.move("clear_v");
        }
        if ( keyboard.eventMatches(event, 'down') ||
			 keyboard.eventMatches(event, 's')) {
            event.preventDefault();
        }
	},

	injectInto: function(domElement) {
		domElement.addEventListener('keydown', InputManager.handlePressInput);
		domElement.addEventListener('keyup', InputManager.handleReleaseInput);
	},

};

InputManager.injectInto(document);


function reset_game(difficulty) {
	maruju.rootScene.resetGame(difficulty);
	sans.queueText([
		"Alright, here we go."
	]);
}

function open_menu(state){
	if (state == "main-menu"){
		menu.updateHeartPosition();
		document.getElementById("select_main").className = "";
	}
	else if (state == "music-menu"){
		musicmenu.updateHeartPosition();
		document.getElementById("select_music").className = "";
	}
	else if (state == "difficulty-menu"){
		diffmenu.updateHeartPosition();
		document.getElementById("select_difficulty").className = "";
	}
}

function close_menu(state){
	if (state == "main-menu"){
		document.getElementById("select_main").className = "closed";
	}
	else if (state == "music-menu"){
		document.getElementById("select_music").className = "closed";
	}
	else if (state == "difficulty-menu"){
		document.getElementById("select_difficulty").className = "closed";
	}
}

function set_state(oldstate, newstate){

	close_menu(oldstate);
	maruju.rootScene.setState(newstate);
	open_menu(newstate);
}


