function Menu(){

	this.current_choice = 0;
	this.choice = [
		"difficulty",
		"music",
	];
	this.state = [
		"difficulty-menu",
		"music-menu",
	];
}

Menu.prototype.moveUp = function() {
	this.current_choice -= 1;
	if (this.current_choice < 0){
		this.current_choice += this.choice.length;
	}
	this.updateHeartPosition();
}

Menu.prototype.moveDown = function() {
	this.current_choice += 1;
	if (this.current_choice >= this.choice.length){
		this.current_choice -= this.choice.length;
	}
	this.updateHeartPosition();
}

Menu.prototype.select = function() 
		{
		var newstate = this.state[this.current_choice];
		set_state("main-menu", newstate);
		}	

Menu.prototype.updateHeartPosition = function(pos) {
	for (var a = 0; a < this.choice.length; ++a) {
		if (a == this.current_choice) {
			document.getElementById("main" + a).className = "sel menu-bullet";
		} else {
			document.getElementById("main" + a).className = "menu-bullet";
		}
	}
}

var menu = new Menu();
