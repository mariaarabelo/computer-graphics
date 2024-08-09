import {CGFappearance, CGFobject} from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleBig } from "./MyTriangleBig.js";

/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends CGFobject {
	constructor(scene) {
		super(scene);
		// Initialize all the parts of the Tangram
        this.diamond = new MyDiamond(this.scene);
        this.triangle = new MyTriangle(this.scene);
        this.triangleSmall = new MyTriangleSmall(this.scene);
        this.parallelogram = new MyParallelogram(this.scene);
        this.bigTriangle = new MyTriangleBig(this.scene);

        this.displayDiamond = true;
        this.displayTriangle = true;
        this.displayTriangleSmall = true;
        this.displayParallelogram = true;
        this.displayBigTriangle = true;
        this.scaleFactor = 1;

        // Purple small triangle 8600c8
        this.purpleMaterial = new CGFappearance(scene);
        this.purpleMaterial.setAmbient(134/256, 0, 200/256, 1.0);
        this.purpleMaterial.setDiffuse(0, 0, 0, 1.0);
        this.purpleMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
        this.purpleMaterial.setShininess(10.0);

        // Green diamond a7f432
        this.greenMaterial= new CGFappearance(scene);
        this.greenMaterial.setAmbient(167/256, 244/256, 50/256, 1.0);
        this.greenMaterial.setDiffuse(0, 0, 0, 1.0);
        this.greenMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
        this.greenMaterial.setShininess(10.0);

        // Red small triangle
        this.redMaterial = new CGFappearance(scene);
        this.redMaterial.setAmbient(1.0, 0, 0, 1.0); 
        this.redMaterial.setDiffuse(0, 0, 0, 1.0);
        this.redMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
        this.redMaterial.setShininess(10.0);

        // Pink medium triangle F699CD
        this.pinkMaterial = new CGFappearance(scene);
        this.pinkMaterial.setAmbient(246/256, 153/256, 205/256, 1.0); 
        this.pinkMaterial.setDiffuse(0, 0, 0, 1.0);
        this.pinkMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
        this.pinkMaterial.setShininess(10.0);

        // Yellow parallelogram
        this.yellowMaterial = new CGFappearance(scene);
        this.yellowMaterial.setAmbient(1.0, 1.0, 0, 1.0); // param 4: alpha, opacidade, transparencia
        this.yellowMaterial.setDiffuse(0, 0, 0, 1.0);
        this.yellowMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
        this.yellowMaterial.setShininess(10.0);

        // Big blue triangle
        this.lightBlueMaterial = new CGFappearance(scene);
        this.lightBlueMaterial.setAmbient(0, 0.6, 1, 1.0); // param 4: alpha, opacidade, transparencia
        this.lightBlueMaterial.setDiffuse(0, 0, 0, 1.0);
        this.lightBlueMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
        this.lightBlueMaterial.setShininess(10.0);

        // Big orange triangle
        this.orangeMaterial = new CGFappearance(scene);
        this.orangeMaterial.setAmbient(1, 0.7, 0, 1.0); // param 4: alpha, opacidade, transparencia
        this.orangeMaterial.setDiffuse(0, 0, 0, 1.0);
        this.orangeMaterial.setSpecular(1, 1, 1, 1.0);
        this.orangeMaterial.setShininess(10.0);
	}

    convert_radians(ang) {
        return Math.PI / 180 * ang;
    }

    enableNormalViz() {
        this.diamond.enableNormalViz();
        this.triangle.enableNormalViz();
        this.triangleSmall.enableNormalViz();
        this.bigTriangle.enableNormalViz();
        this.parallelogram.enableNormalViz();
    }

    disableNormalViz() {
        this.diamond.disableNormalViz();
        this.triangle.disableNormalViz();
        this.triangleSmall.disableNormalViz();
        this.bigTriangle.disableNormalViz();
        this.parallelogram.disableNormalViz();
    }

	display() {
        var sca = [
            this.scaleFactor, //escala em x
            0.0,
            0.0,
            0.0,
            0.0,
            this.scaleFactor, //escala em y
            0.0,
            0.0,
            0.0,
            0.0,
            this.scaleFactor, //escala em z
            0.0,
            0.0,
            0.0,
            0.0,
            1.0, //1 para coordenadas homogéneas
            ];

            this.scene.multMatrix(sca);

            //Rotation 45 degrees
            var rad = this.convert_radians(45) 
            var rotZ = [
                Math.cos(rad), Math.sin(rad), 0.0, 0.0,
                -Math.sin(rad),  Math.cos(rad), 0.0, 0.0,
                0.0,            0.0,           1.0, 0.0,
                0.0,            0.0,           0.0, 1.0
            ];

            // Translation for diamond
            var tra = [
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                Math.sqrt(2)/2, 5*Math.sqrt(2)/2, 0.0, 1.0
            ];

            //Diamond transformations
            this.scene.pushMatrix();
            this.scene.multMatrix(tra);
            this.scene.multMatrix(rotZ);
            // this.greenMaterial.apply();
            this.scene.customMaterial.apply();
            if (this.displayDiamond) this.diamond.display();
            this.scene.popMatrix();

            // Parallelogram transformations
            this.scene.pushMatrix();
            this.scene.translate(0, Math.sqrt(2), 0);
            this.scene.rotate(this.convert_radians(-45), 0, 0, 1);
            this.scene.scale(1, -1, 1)
            this.yellowMaterial.apply();
            if (this.displayParallelogram) this.parallelogram.display();
            this.scene.popMatrix();

            // Down small triangle transformations
            this.scene.pushMatrix();
            this.scene.translate(Math.sqrt(2)/2, 3*Math.sqrt(2)/2, 0);
            this.scene.rotate(this.convert_radians(45), 0, 0, 1);
            this.redMaterial.apply();
            if (this.displayTriangleSmall) this.triangleSmall.display();
            this.scene.popMatrix();

            // Top small triangle
            this.scene.pushMatrix();
            this.scene.translate(3*Math.sqrt(2)/2, 5*Math.sqrt(2)/2, 0);
            this.scene.rotate(this.convert_radians(135), 0, 0, 1);
            this.purpleMaterial.apply();
            if (this.displayTriangleSmall) this.triangleSmall.display();
            this.scene.popMatrix();

            //Medium triangle transformations
            this.scene.pushMatrix();
            this.scene.translate(Math.sqrt(2), Math.sqrt(2), 0);
            this.scene.rotate(this.convert_radians(-45), 0, 0, 1);
            this.pinkMaterial.apply();
            if (this.displayTriangle) this.triangle.display();
            this.scene.popMatrix();

            //Right big triangle
            this.scene.pushMatrix();
            this.scene.translate(Math.sqrt(2) - 2, -Math.sqrt(2), 0)
            this.scene.rotate(this.convert_radians(-90), 0, 0, 1)
            this.lightBlueMaterial.apply();
            if (this.displayBigTriangle) this.bigTriangle.display();
            this.scene.popMatrix();

            //Left big triangle
            this.scene.pushMatrix();
            this.scene.translate(Math.sqrt(2) - 2, -Math.sqrt(2), 0)
            this.scene.rotate(this.convert_radians(90), 0, 0, 1)
            this.orangeMaterial.apply();
            if (this.displayBigTriangle) this.bigTriangle.display();
            this.scene.popMatrix();

            // ---- END Primitive drawing section
    }
}

