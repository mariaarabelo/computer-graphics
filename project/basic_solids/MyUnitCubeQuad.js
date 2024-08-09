import {CGFobject} from  '../../lib/CGF.js';
import { MyQuad } from "./MyQuad.js";

/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 * @param topTexture - Top texture of the unit cube
 * @param leftTexture - Left texture of the unit cube
 * @param rightTexture - Right texture of the unit cube
 * @param frontTexture - Front texture of the unit cube
 * @param backTexture - Back texture of the unit cube
 * @param bottomTexture - Bottom texture of the unit cube
 */
export class MyUnitCubeQuad extends CGFobject {
	constructor(scene, topTexture = null, leftTexture = null, rightTexture = null, 
        frontTexture = null, backTexture = null, bottomTexture = null) {
		super(scene);
        this.quad = new MyQuad(this.scene);
        this.topTexture = topTexture;
        this.leftTexture = leftTexture;
        this.rightTexture = rightTexture;
        this.frontTexture = frontTexture;
        this.backTexture = backTexture;
        this.bottomTexture = bottomTexture;
	}


	display() { 
        // top face
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        if (this.topTexture) this.scene.cubeMaterial.setTexture(this.topTexture);
        this.scene.cubeMaterial.apply();
        this.quad.display();
        this.scene.popMatrix();

        // front face       
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        if (this.frontTexture) this.scene.cubeMaterial.setTexture(this.frontTexture);
        this.scene.cubeMaterial.apply();
        this.quad.display();
        this.scene.popMatrix();

        // right face
        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        if (this.rightTexture) this.scene.cubeMaterial.setTexture(this.rightTexture);
        this.scene.cubeMaterial.apply();
        this.quad.display();
        this.scene.popMatrix();

        // back face         
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(Math.PI, 0, 1, 0); // because it is not double sided
        if (this.backTexture) this.scene.cubeMaterial.setTexture(this.backTexture);
        this.scene.cubeMaterial.apply();
        this.quad.display();
        this.scene.popMatrix();

        // left face
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        if (this.leftTexture) this.scene.cubeMaterial.setTexture(this.leftTexture);
        this.scene.cubeMaterial.apply();
        this.quad.display();
        this.scene.popMatrix();
        
        // bottom face
        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        if (this.bottomTexture) this.scene.cubeMaterial.setTexture(this.bottomTexture);
        this.scene.cubeMaterial.apply();
        this.quad.display();
        this.scene.popMatrix();
    }
}

