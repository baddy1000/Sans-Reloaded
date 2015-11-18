function MusicMenu(){

	this.current_music = 0;
	this.music = [
		"audio/megalovania.ogg",
		"audio/death_by_glamour.mp3",
		"audio/ultralovania.mp3"
	];

}

MusicMenu.prototype.moveUp = function() {
	this.current_music -= 1;
	if (this.current_music < 0){
		this.current_music += this.music.length;
	}
	this.updateHeartPosition();
}

MusicMenu.prototype.moveDown = function() {
	this.current_music += 1;
	if (this.current_music >= this.music.length){
		this.current_music -= this.music.length;
	}
	this.updateHeartPosition();
}

MusicMenu.prototype.select = function() {
		document.getElementById("bgm").src = this.music[this.current_music];
		set_state("music-menu", "main-menu");
}

MusicMenu.prototype.updateHeartPosition = function(pos) {
	for (var a = 0; a < this.music.length; ++a) {
		if (a == this.current_music) {
			document.getElementById("music" + a).className = "sel menu-bullet";
		} else {
			document.getElementById("music" + a).className = "menu-bullet";
		}
	}
}

var musicmenu = new MusicMenu();
