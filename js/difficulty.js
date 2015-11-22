//Constructor
function DiffMenu(){

	this.current_diff = 0;
	this.difficulty = [
		"easy",
		"medium",
		"hard",
		"progressive"
	];

}

DiffMenu.prototype.moveUp = function() {
	this.current_diff -= 1;
	if (this.current_diff < 0){
		this.current_diff += this.difficulty.length;
	}
	this.updateHeartPosition();
}

DiffMenu.prototype.moveDown = function() {
	this.current_diff += 1;
	if (this.current_diff >= this.difficulty.length){
		this.current_diff -= this.difficulty.length;
	}
	this.updateHeartPosition();
}

DiffMenu.prototype.select = function() {
	close_menu("difficulty-menu");
	reset_game(this.difficulty[this.current_diff]);
}

DiffMenu.prototype.updateHeartPosition = function(pos) {
	for (var a = 0; a < this.difficulty.length; ++a) {
		if (a == this.current_diff) {
			document.getElementById("diff" + a).className = "sel menu-bullet";
		} else {
			document.getElementById("diff" + a).className = "menu-bullet";
		}
	}
}

var diffmenu = new DiffMenu();