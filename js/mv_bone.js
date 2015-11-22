function MVBones(scene, sprite_url, props) {

	this.scene = scene;
	this.sprite = this.scene.addBGSprite(sprite_url);

	// default dimensions
	this.height = props.height;
	this.width = props.width;
	this.sprite.scale.set(this.width, this.height, 1);

	this.pos_x = props.pos_x;
	this.pos_y = props.pos_y;
	this.sprite.position.set(this.pos_x, this.pos_y, 3);

	this.colour = props.colour || "white"; // can be white, blue, or orange.

	this.vel_x = props.vel_x;
	this.scene.getScene().add(this.sprite);

}

MVBones.prototype.setColour = function(colour) //sets bone color
{
	this.colour = colour;
	switch (this.colour) {
		case "white":
			this.sprite.material.color = new THREE.Color(0xffffff); break;
		case "blue":
			this.sprite.material.color = new THREE.Color(0x00ffff); break;
		case "orange":
			this.sprite.material.color = new THREE.Color(0x555555); break;
	}
}
/*
MVBones.prototype.update = function(delta) //updates bone position
{
	this.pos_x += this.vel_x * delta;
	this.sprite.position.set(this.pos_x, this.pos_y, 3);
}
*/
MVBones.prototype.update = function(pos_x, pos_y, i) //updates bone position
{
	fbc_array = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(fbc_array);
	this.pos_y = -(fbc_array[i]/1.5)+350;
	this.pos_x = this.pos_x;
	this.sprite.position.set(this.pos_x, this.pos_y, 2);
}

function createmvBonesFrommvBoneSet(scene, mvbone_set) //creates bones from bone set
{
	var MVbones = [];
	console.log(mvbone_set);
	for (var a = 0; a < mvbone_set; ++a) {
		var new_bone = new MVBones(scene, "img/vmbone.png", {
			pos_x: a*32-320+16,
			pos_y: 350,
			width: 32,
			height: 256,
		});
		new_bone.setColour("orange");
		MVbones.push(new_bone);
	}
	return MVbones;
}

function MVBoneGroup(scene, mvbone_set) {
	this.scene = scene;
	this.MVbones = createmvBonesFrommvBoneSet(this.scene, mvbone_set);
	
}
MVBoneGroup.prototype.update = function(pos_x, pos_y) {
	for (var a = 0; a < this.MVbones.length; ++a) {
		this.MVbones[a].update(pos_x, pos_y, a);
	}
}

MVBoneGroup.prototype.clearmvBones = function() {
	var scene = this.scene.getScene();
	for (var a = 0; a < this.MVbones.length; ++a) {
		scene.remove(this.MVbones[a].sprite);
	}
}
/*
function frameLooper()
{
	window.requestAnimationFrame(frameLooper);
	fbc_array = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(fbc_array);
	ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
	ctx.fillStyle = '#00CCFF'; // Color of the bars
	bars = 100;
	for (var i = 0; i < bars; i++) 
	{
		bar_x = i * 3;
		bar_width = 2;
		bar_height = -(fbc_array[i] / 2);
		//  fillRect( x, y, width, height ) // Explanation of the parameters below
		ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
	}
}
*/
/*
function createBonesFromBoneSet(scene, bone_set) //creates bones from bone set
{
	var bones = [];
	console.log(bone_set);
	for (var a = 0; a < bone_set.length; ++a) {
		var new_bone = new Bone(scene, "img/edgebone.png", {
			pos_x: bone_set[a][0],
			pos_y: bone_set[a][1],
			width: bone_set[a][2],
			height: bone_set[a][3],
			vel_x: bone_set[a][4],
		});
		if (bone_set[a].length > 5) {
			new_bone.setColour(bone_set[a][5]);
		}
		bones.push(new_bone);
	}
	return bones;
}

function BoneGroup(scene, bone_set, elapsed_time) {

	this.scene = scene;
	this.bones = createBonesFromBoneSet(this.scene, bone_set.bones);
	this.elapsed_time = 0;

	this.next_time = bone_set.next_time;
	this.next_sent = false;

	this.delete_time = bone_set.total_time;
	this.next_bone_sets = bone_set.next_bone_sets;

	if (elapsed_time > 0){
		this.update(elapsed_time);
	}
	maruju.rootScene.check_wave_counter();
}

BoneGroup.prototype.collidesWithHeart = function() {
	for (var a = 0; a < this.bones.length; ++a) {
		if (this.bones[a].collidesWithHeart()) {
			return true;
		}
	}
	return false;
}

BoneGroup.prototype.update = function(delta) {

	for (var a = 0; a < this.bones.length; ++a) {
		this.bones[a].update(delta);
	}
	this.elapsed_time += delta;

	if (this.elapsed_time > this.next_time && this.next_sent == false) {
		this.next_sent = true;
		if (maruju.rootScene.debug_mode == true) 
		{
			this.scene.sendNewBones(maruju.rootScene.debug_set, this.elapsed_time - this.next_time);		
			return;
		}
		else 
		{
			this.scene.sendNewBones(bone_sets[this.next_bone_sets[Math.floor(this.next_bone_sets.length * Math.random())]], this.elapsed_time - this.next_time);		
		}
	}

	if (this.elapsed_time > this.delete_time) {
		this.clearBones();
		this.completed = true;	
	}
	
	if (this.elapsed_time > this.delete_time && this.next_sent == false) {
		this.next_sent = true;
		if (maruju.rootScene.debug_mode == true) 
		{
			this.scene.sendNewBones(maruju.rootScene.debug_set, this.elapsed_time - this.delete_time);
		}
		else 
		{
			this.scene.sendNewBones(bone_sets[this.next_bone_sets[Math.floor(this.next_bone_sets.length * Math.random())]], this.elapsed_time - this.delete_time);		
		}
		this.clearBones();
		this.completed = true;	
	}
}

BoneGroup.prototype.clearBones = function() {
	var scene = this.scene.getScene();
	for (var a = 0; a < this.bones.length; ++a) {
		scene.remove(this.bones[a].sprite);
	}
}
*/