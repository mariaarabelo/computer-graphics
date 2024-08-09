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
        this.topTriangleSmall = new MyTriangleSmall(this.scene, [0, 0, 0, 0.5, 0.25, 0.25, 0, 0, 0, 0.5, 0.25, 0.25]);
        this.bottomTriangleSmall = new MyTriangleSmall(this.scene, [0.25, 0.75, 0.75, 0.75, 0.5, 0.5, 0.25, 0.75, 0.75, 0.75, 0.5, 0.5]);
        this.parallelogram = new MyParallelogram(this.scene);
        this.bigTriangleBlue = new MyTriangleBig(this.scene, [1, 0, 1, 0, 0, 0, 0, 0, 0.5, 0.5, 0.5, 0.5]);
        this.bigTriangleOrange = new MyTriangleBig(this.scene, [1, 1, 1, 1, 1, 0, 1, 0, 0.5, 0.5, 0.5, 0.5]);

        this.displayDiamond = true;
        this.displayTriangle = true;
        this.displayTriangleSmall = true;
        this.displayParallelogram = true;
        this.displayBigTriangle = true;
        this.scaleFactor = 1;

        this.whiteMaterial= new CGFappearance(scene);
        this.whiteMaterial.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.whiteMaterial.setDiffuse(0, 0, 0, 1.0);
        this.whiteMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
        this.whiteMaterial.setShininess(10.0);
	}

    convert_radians(ang) {
        return Math.PI / 180 * ang;
    }

    enableNormalViz() {
        this.diamond.enableNormalViz();
        this.triangle.enableNormalViz();
        this.triangleSmall.enableNormalViz();
        this.bigTriangleBlue.enableNormalViz();
        this.bigTriangleOrange.enableNormalViz();
        this.parallelogram.enableNormalViz();
    }

    disableNormalViz() {
        this.diamond.disableNormalViz();
        this.triangle.disableNormalViz();
        this.triangleSmall.disableNormalViz();
        this.bigTriangleBlue.enableNormalViz();
        this.bigTriangleOrange.enableNormalViz();
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

            this.whiteMaterial.setTexture(this.scene.tangramTexture);

            //Diamond transformations
            this.scene.pushMatrix();
            this.scene.multMatrix(tra);
            this.scene.multMatrix(rotZ);
            this.whiteMaterial.apply();
            if (this.displayDiamond) this.diamond.display();
            this.scene.popMatrix();

            // Parallelogram transformations
            this.scene.pushMatrix();
            this.scene.translate(0, Math.sqrt(2), 0);
            this.scene.rotate(this.convert_radians(-45), 0, 0, 1);
            this.scene.scale(1, -1, 1)
            this.whiteMaterial.apply();
            if (this.displayParallelogram) this.parallelogram.display();
            this.scene.popMatrix();

            // Down small triangle transformations
            this.scene.pushMatrix();
            this.scene.translate(Math.sqrt(2)/2, 3*Math.sqrt(2)/2, 0);
            this.scene.rotate(this.convert_radians(45), 0, 0, 1);
            this.whiteMaterial.apply();
            if (this.displayTriangleSmall) this.bottomTriangleSmall.display();
            this.scene.popMatrix();

            // Top small triangle
            this.scene.pushMatrix();
            this.scene.translate(3*Math.sqrt(2)/2, 5*Math.sqrt(2)/2, 0);
            this.scene.rotate(this.convert_radians(135), 0, 0, 1);
            this.whiteMaterial.apply();
            if (this.displayTriangleSmall) this.topTriangleSmall.display();
            this.scene.popMatrix();

            //Medium triangle transformations
            this.scene.pushMatrix();
            this.scene.translate(Math.sqrt(2), Math.sqrt(2), 0);
            this.scene.rotate(this.convert_radians(-45), 0, 0, 1);
            this.whiteMaterial.apply();
            if (this.displayTriangle) this.triangle.display();
            this.scene.popMatrix();

            //Right big triangle
            this.scene.pushMatrix();
            this.scene.translate(Math.sqrt(2) - 2, -Math.sqrt(2), 0)
            this.scene.rotate(this.convert_radians(-90), 0, 0, 1)
            this.whiteMaterial.apply();
            if (this.displayBigTriangle) this.bigTriangleBlue.display();
            this.scene.popMatrix();

            //Left big triangle
            this.scene.pushMatrix();
            this.scene.translate(Math.sqrt(2) - 2, -Math.sqrt(2), 0)
            this.scene.rotate(this.convert_radians(90), 0, 0, 1);
            this.whiteMaterial.apply();
            if (this.displayBigTriangle) this.bigTriangleOrange.display();
            this.scene.popMatrix();

            // ---- END Primitive drawing section
    }
}

