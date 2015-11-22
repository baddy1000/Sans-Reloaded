
function BattleScene() {

	SceneContext.call(this);

	// a single heart for the battle scene.
	this.heart_sprite = this.addSprite("img/blueheart.png");
	this.heart_sprite.scale.set(32, 32, 1);
	this.heart_sprite.position.set(0, -104, 2);	
	//this.heart_sprite.position.set(160, 228, 2);

	this.heart = heart;
	this.heart.sprite = this.heart_sprite;

	this.camera.position.set(0, 120, 10);

	this.getScene().add(this.heart_sprite);

	this.difficulty = "easy";
	this.bone_groups = [];
	this.mvBone_group = new MVBoneGroup(this, 20);
	
	this.play_state = "intro";
	this.play_speed = 1;
	this.wave_counter = 0;
	
	this.elapsed_time = 0;
	this.final_time = 0;
	this.final_message = false;
	
	this.debug_mode = false;
	this.debug_set = prog_bone_set_2L;
	//this.debug_set = prog_bone_set_4A;

};

inherit(BattleScene, SceneContext);

BattleScene.prototype.update = function(delta) {

	sans.update(delta);

	if (this.play_state == "playing") {

		var collided = false;

		this.mvBone_group.update();
		this.heart.update(delta * this.play_speed);
		for (var a = 0; a < this.bone_groups.length; ++a) {
			if (this.bone_groups[a].completed == true) {
				this.bone_groups.splice(a, 1);
				a -= 1;
				continue;
			}
			this.bone_groups[a].update(delta * this.play_speed);
			if (this.bone_groups[a].collidesWithHeart()) {
				collided = true;
			}
		}

		if (collided == true) {
			document.getElementById("se_damage").currentTime = 0;
			document.getElementById("se_damage").play();
			if (this.difficulty == "easy" || this.difficulty == "progressive") {
				heart.hp = Math.max(0, heart.hp - delta);
				document.getElementById("hp").innerHTML = heart.hp.toFixed(2);
			} else {
				heart.hp = 0;
				document.getElementById("hp").innerHTML = "0";
			}
			document.getElementById("hp_yellow_bar").style.width = (heart.hp * 60) + "px";
		}

		if (heart.hp <= 0) {
			this.final_time = this.elapsed_time;
			this.elapsed_time = 0;
			this.play_state = "gameover";
			console.log("Game over!");
			document.getElementById("time").innerHTML = this.final_time.toFixed(2);
		} else {
			this.elapsed_time += delta;
			document.getElementById("time").innerHTML = this.elapsed_time.toFixed(2);
		}

	} else if (this.play_state == "gameover") {

		this.elapsed_time += delta;

		this.heart.updateGameover(this.elapsed_time);

		if (this.final_message == false){
			this.final_message = true;
			audio.pause();
			sans.sendGameOverMessage();
		}

		if (this.elapsed_time >= 1.0) {
			this.elapsed_time = 0;
			this.play_state = "not-playing";
			document.getElementById("select_text").innerHTML = "Play again?";
		}

	}

};

BattleScene.prototype.sendNewBones = function(bone_set, elapsed_time) 
{
	this.bone_groups.push(new BoneGroup(this, bone_set, elapsed_time));
};

BattleScene.prototype.clearAllBones = function() {
	for (var a = 0; a < this.bone_groups.length; ++a) {
		this.bone_groups[a].clearBones();
	}
};

BattleScene.prototype.setState = function(name){
this.play_state = name;
}

BattleScene.prototype.resetGame = function(diff_level) {
	this.clearAllBones();
	this.difficulty = diff_level;
	this.heart.hp = 1;
	document.getElementById("hp").innerHTML = "1";
	document.getElementById("hp_yellow_bar").style.width = "60px";
	this.heart.pos_x = 0;
	this.heart.pos_y = 224;
	this.heart.update(0);
	this.elapsed_time = 0;
	this.wave_counter = 0;
	document.getElementById("time").innerHTML = "0.00";
	this.play_state = "preplaying";
	this.bone_groups = [];
	this.final_message = false;
	if (diff_level == "progressive")
	{	
		this.sendNewBones(default_prog_bone_set); 
	}/* Checks for progressive mode*/
	else
	{
		this.sendNewBones(default_bone_set);
	}
	switch (diff_level) {
		case "easy":
			heart.tolerance = 0;
			this.play_speed = 1;
			document.getElementById("love").innerHTML = "1";
			break;
		case "medium":
			heart.tolerance = 2;
			this.play_speed = 1;
			document.getElementById("love").innerHTML = "10";
			break;
		case "hard":
			heart.tolerance = 2;
			this.play_speed = 1.5;
			document.getElementById("love").innerHTML = "99";
			break;
		case "progressive":
			heart.tolerance = 0;
			this.play_speed = 1;
			document.getElementById("love").innerHTML = "1";
			break;
	}
	if (this.debug_mode == true)
	{
		this.bone_groups = [];
		this.sendNewBones(this.debug_set);
		heart.tolerance = 0;
		this.play_speed = 1;
		document.getElementById("love").innerHTML = "1";
	}
	document.getElementById("select_difficulty").className = "closed";
	document.getElementById("gameplay_area").className = "";
//	audio.src = document.getElementById("bgm").src;
	audio.currentTime = 0;
	audio.play();
//	document.getElementById("bgm").currentTime = 0;
//	document.getElementById("bgm").play();
	document.activeElement.blur();
}

BattleScene.prototype.check_wave_counter = function()
{
	if (this.difficulty == "progressive" )
	{
		this.wave_counter++;
		if (this.wave_counter >= 5)
		{
			this.play_speed = this.play_speed + 0.02;
			this.wave_counter = 0;
			document.getElementById("love").innerHTML++;
		}
	}
}

