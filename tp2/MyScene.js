import { CGFscene, CGFcamera, CGFaxis } from "../lib/CGF.js";
import { MyTangram } from "./MyTangram.js";
import { MyUnitCube } from "./MyUnitCube.js";
import { MyUnitCubeQuad } from "./MyUnitCubeQuad.js";

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
    
    //Initialize scene objects
    this.axis = new CGFaxis(this);
    this.tangram = new MyTangram(this);
    this.unitCube = new MyUnitCube(this);
    this.unitCubeQuad = new MyUnitCubeQuad(this);

    //Objects connected to MyInterface
    this.displayAxis = true;
  }
  initLights() {
    this.lights[0].setPosition(15, 2, 5, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      0.4,
      0.1,
      500,
      vec3.fromValues(15, 15, 15),
      vec3.fromValues(0, 0, 0)
    );
  }
  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
  }

  convert_radians(ang) {
    return Math.PI / 180 * ang;
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
    if (this.displayAxis) 
      this.axis.display();

    this.setDefaultAppearance();

    // Unit cube transformations
    this.pushMatrix();
    this.translate(5, 0, 5)
    this.rotate(this.convert_radians(-90), 1, 0, 0);
    this.translate(0, 0, -0.25);
    this.scale(10, 10, 0.5);
    // this.unitCube.display();
    this.popMatrix();

    // Tangram transformations
    this.pushMatrix();
    // The cube isn't placed exactly on top of the tangram so that the tangram can be clearly seen.
    // A small translation in the y axis was used in the tangram so that it is slightly above its base
    this.translate(5, 0.05, 5);
    this.rotate(this.convert_radians(-90), 1, 0, 0);
    this.tangram.display();
    this.popMatrix();

    // Unit cube quad transformations
    this.pushMatrix();
    this.rotate(this.convert_radians(-90), 1, 0, 0);
    this.scale(10, 10, 0.5);
    this.translate(0.5, -0.5, -0.5);
    this.unitCubeQuad.display();
    this.popMatrix();
  }
}
