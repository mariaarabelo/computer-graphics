import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyPlane } from "./basic_solids/MyPlane.js";
import { MyGarden } from "./main_objects/flower/MyGarden.js";
import { MyBee } from "./main_objects/MyBee.js";
import { MyPanorama } from "./main_objects/MyPanorama.js";
import { MyRock } from "./main_objects/MyRock.js";
import { MyRockSet } from "./main_objects/MyRockSet.js";
import { MyRockTower } from "./main_objects/MyRockTower.js";
import { MyGrass } from "./main_objects/MyGrass.js"
import { MyHive } from "./main_objects/MyHive.js";

// Project 
// https://docs.google.com/document/u/2/d/e/2PACX-1vQ0ymjive-vR4jEyY916m-aSCIKBL6Z-nYvbwds5Z4ZZCJWloZ0hdrU99DWDy2BxzUauuUJYKNjf_iQ/pub

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }

  init(application) {
    super.init(application);
    
    this.initCameras();
    this.initLights();

    //Background color
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    //Objects connected to MyInterface
    this.displayAxis = false;
    this.displayNormals = false;
    this.gardenWidth = 5;
    this.gardenLength = 6;
    this.scaleFactor = 1.0;
    this.speedFactor = 1;
    this.baseSpeed = 0.5;
    this.baseRotate = 0.1;
    this.followBee = false;

    this.enableTextures(true);
    this.texture = new CGFtexture(this, "images/field.jpeg");
    this.appearance = new CGFappearance(this);
    this.appearance.setTexture(this.texture);
    this.appearance.setTextureWrap('REPEAT', 'REPEAT');
    
    this.initTextures();
    this.initMaterials();
    this.initShaders();

    //Initialize scene objects
    this.axis = new CGFaxis(this);
    this.plane = new MyPlane(this,30);
    this.gardens = [
      new MyGarden(this, this.gardenWidth, this.gardenLength),
    ]

    this.garden_translate = [35, 0, -10];

    this.rock = new MyRock(this, 15, 5, 0.8, 1.2);
    this.rock_set = new MyRockSet(this, 25, 0, 0, 45);
    this.rock_set2 = new MyRockSet(this, 12, 0, 0, 25);
    this.rock_tower = new MyRockTower(this, 6, -45, 30);

    // Hive transformations
    this.hive_scale = 2.0;
    this.hive_rot = 3*Math.PI/4;

    this.hive_translate = [this.rock_tower.topX, this.rock_tower.topY, this.rock_tower.topZ];

    this.hive = new MyHive(this);

    this.panorama = new MyPanorama(this, this.panorama_texture);
    
    this.bee = new MyBee(this, 0, 10, 0, 0.1, 2, this.gardens);

    this.grass = new MyGrass(this);

    // Activate transparency
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
    this.gl.enable(this.gl.BLEND)

    // Set update period
    this.setUpdatePeriod(50);
  }

  initLights() {
    
    this.lights[0].setPosition(15, 0, 5, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
    
    this.lights[1].setPosition(20, 7.0, 4.0, 1.0);
    this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[1].setSpecular(1.0, 1.0, 0.0, 1.0);
    this.lights[1].enable();
    this.lights[1].update();

  }

  initCameras() {
    this.camera = new CGFcamera(
      1.8,
      0.1,
      1000,
      vec3.fromValues(-2, 9.7, 2),
      vec3.fromValues(0, 10, 0)
    );
  }

  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
  }

  initTextures() {
    this.panorama_texture = new CGFtexture(this, 'images/panorama4.jpg');
    this.rock_moss_texture = new CGFtexture(this, 'images/boulder.jpg');
    this.bee_body_texture = new CGFtexture(this, 'images/bee_body.png');
    this.bee_head_texture = new CGFtexture(this, 'images/yellow_fur.png');
    this.pollen_texture = new CGFtexture(this, 'images/pollen.jpg');
    this.receptacle_texture = new CGFtexture(this, 'images/receptacle.jpg');
    this.light_wood_texture = new CGFtexture(this, 'images/light-wood.jpeg');
    this.cross_wood_texture = new CGFtexture(this, 'images/cross-wood.jpeg');
    this.bee_hive_sheet = new CGFtexture(this, 'images/bee_hive_sheet.png');
    this.grass_texture = new CGFtexture(this, 'images/grass.jpg')
		this.sky_shader_texture = new CGFtexture(this, "images/clouds_alpha.png");
    this.leaf_texture = new CGFtexture(this, './images/leaf.jpeg');
    this.stem_texture = new CGFtexture(this, './images/stem.jpg');

    this.petal_textures = [
      new CGFtexture(this, './images/petal.jpg'), // red
      new CGFtexture(this, './images/petal2.jpeg') // pink
  ]

  }

  initMaterials() {
    this.panorama_material = new CGFappearance(this);
    this.panorama_material.setEmission(1.0, 1.0, 1.0, 1.0);
    this.panorama_material.setTexture(this.earthTexture);

    this.rock_material = new CGFappearance(this);
    this.rock_material.setAmbient(1, 1, 1, 1.0);
    this.rock_material.setDiffuse(1, 1, 1, 1.0);
    this.rock_material.setSpecular(1, 1, 1, 1.0);
    this.rock_material.setTexture(this.rock_moss_texture)
  
    // brown
    this.cubeMaterial = new CGFappearance(this);
    this.cubeMaterial.setDiffuse(0.8, 0.8, 0.8, 1.0);
    this.cubeMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
    this.cubeMaterial.setShininess(10.0);

    // pink
    this.petalMaterial = new CGFappearance(this);
    this.petalMaterial.setAmbient(246/256, 153/256, 205/256, 1.0); 
    this.petalMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
    this.petalMaterial.setShininess(10.0);

    this.bee_body_material = new CGFappearance(this);
    this.bee_body_material.setTexture(this.bee_body_texture);

    this.bee_head_material = new CGFappearance(this);
    this.bee_head_material.setTexture(this.bee_head_texture);

    this.black_material = new CGFappearance(this);
    this.black_material.setAmbient(0, 0, 0, 1.0);
    this.black_material.setDiffuse(0, 0, 0, 1.0);
    this.black_material.setSpecular(1, 1, 1, 1.0);

    this.wing_material = new CGFappearance(this);
    this.wing_material.setAmbient(0.0, 0.0, 0.0, 0.0);
    this.wing_material.setDiffuse(0.5, 0.5, 0.5, 0.9);
    this.wing_material.setSpecular(0.0, 0.0, 0.0, 0.0);
    this.wing_material.setEmission(0.0, 0.0, 0.0, 0.0);

    this.pollen_material = new CGFappearance(this);
    this.pollen_material.setTexture(this.pollen_texture);

    this.greenMaterial= new CGFappearance(this);
    this.greenMaterial.setAmbient(167/256, 200/256, 50/256, 1.0);
    this.greenMaterial.setDiffuse(0, 0, 0, 1.0);
    this.greenMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
    this.greenMaterial.setShininess(10.0);

    this.darkGreenMaterial= new CGFappearance(this); 
    this.darkGreenMaterial.setAmbient(167/256, 230/256, 50/256, 1.0);
    this.darkGreenMaterial.setDiffuse(0, 0, 0, 1.0);
    this.darkGreenMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
    this.darkGreenMaterial.setShininess(10.0);
  }

  initShaders() {
    this.grassShader = new CGFshader(this.gl, 'shaders/grass.vert', 'shaders/grass.frag');
    this.skyShader = new CGFshader(this.gl, "shaders/sky.vert", "shaders/sky.frag")
  }

  checkKeys() {
    if (this.gui.isKeyPressed("KeyW")) {
      this.bee.accelerate(this.baseSpeed * this.speedFactor);
    }

    if (this.gui.isKeyPressed("KeyS")) {
      this.bee.accelerate(-this.baseSpeed * this.speedFactor);
    }

    if (this.gui.isKeyPressed("KeyA")) {
      this.bee.turn(this.baseRotate * this.speedFactor);
    }

    if (this.gui.isKeyPressed("KeyD")) {
      this.bee.turn(-this.baseRotate * this.speedFactor);
    }

    if (this.gui.isKeyPressed("KeyR")) {
      this.bee.reset();
    }

    if (this.gui.isKeyPressed("KeyF")) {
      this.bee.fetchPollen();
    }

    if (this.gui.isKeyPressed("KeyP")) {
      this.bee.returnUp();
    }

    if (this.gui.isKeyPressed("KeyO")) {
      this.bee.goToHive();
    }
  }

  update(t) {
    this.checkKeys();
    this.bee.update(t);
    this.grassShader.setUniformsValues({
      timeFactor: t / 1000 % 1000,
    });

    this.skyShader.setUniformsValues({
      uSampler2: 1,
      timeFactor: t / 1000 % 1000,
    });

    if (this.followBee) {
      this.camera.position = vec3.fromValues(this.bee.x + 3, this.bee.y + 0.5, this.bee.z - 3);
      this.camera.target = vec3.fromValues(this.bee.x, this.bee.y, this.bee.z);
    }
  }


  updateGardens() {
    for (let i = 0; i < this.gardens.length; i++) {
      this.gardens[i] = new MyGarden(this, this.gardenWidth, this.gardenLength);
    }
  }

  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    if (this.displayAxis) this.axis.display();
    // ---- BEGIN Primitive drawing section

		this.setActiveShader(this.skyShader);
    this.sky_shader_texture.bind(1);

    this.panorama.display();

		this.setActiveShader(this.defaultShader);

    this.pushMatrix();
    this.appearance.apply();
    this.scale(100,100,100);
    this.rotate(-Math.PI/2.0,1,0,0);
    this.plane.display();
    this.popMatrix();

    this.pushMatrix();
    this.gardens.forEach(garden => {
      this.translate(...this.garden_translate);
      garden.display();
    })
    this.popMatrix();
    
    this.pushMatrix();
    this.translate(-45, 0, -25);
    this.rock_set.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(-30, 0, 25);
    this.rock_set2.display();
    this.popMatrix();

    this.rock_tower.display();

    this.pushMatrix();
    this.translate(...this.hive_translate);
    this.rotate(this.hive_rot, 0, 1, 0);
    this.scale(this.hive_scale, this.hive_scale, this.hive_scale)
    this.hive.display();
    this.popMatrix();
    
    this.grass.display();

    this.pushMatrix();
    this.bee.display();
    this.popMatrix();


    // ---- END Primitive drawing section
  }
}
