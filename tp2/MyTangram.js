import {CGFobject} from '../lib/CGF.js';
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
	}

    convert_radians(ang) {
        return Math.PI / 180 * ang;
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
            if (this.displayDiamond) this.diamond.display();
            this.scene.popMatrix();

            // Parallelogram transformations
            this.scene.pushMatrix();
            this.scene.translate(0, Math.sqrt(2), 0);
            this.scene.rotate(this.convert_radians(-45), 0, 0, 1);
            this.scene.scale(1, -1, 1)
            if (this.displayParallelogram) this.parallelogram.display();
            this.scene.popMatrix();

            // Down small triangle transformations
            this.scene.pushMatrix();
            this.scene.translate(Math.sqrt(2)/2, 3*Math.sqrt(2)/2, 0);
            this.scene.rotate(this.convert_radians(45), 0, 0, 1);
            if (this.displayTriangleSmall) this.triangleSmall.display();
            this.scene.popMatrix();

            // Top small triangle
            this.scene.pushMatrix();
            this.scene.translate(3*Math.sqrt(2)/2, 5*Math.sqrt(2)/2, 0);
            this.scene.rotate(this.convert_radians(135), 0, 0, 1);
            if (this.displayTriangleSmall) this.triangleSmall.display();
            this.scene.popMatrix();

            //Medium triangle transformations
            this.scene.pushMatrix();
            this.scene.translate(Math.sqrt(2), Math.sqrt(2), 0);
            this.scene.rotate(this.convert_radians(-45), 0, 0, 1);
            if (this.displayTriangle) this.triangle.display();
            this.scene.popMatrix();

            //Big triangle transformations
            this.scene.pushMatrix();
            this.scene.translate(Math.sqrt(2) - 2, -Math.sqrt(2), 0)
            this.scene.rotate(this.convert_radians(-90), 0, 0, 1)
            if (this.displayBigTriangle) this.bigTriangle.display();
            this.scene.popMatrix();

            //Left big triangle
            this.scene.pushMatrix();
            this.scene.translate(Math.sqrt(2) - 2, -Math.sqrt(2), 0)
            this.scene.rotate(this.convert_radians(90), 0, 0, 1)
            if (this.displayBigTriangle) this.bigTriangle.display();
            this.scene.popMatrix();

            // ---- END Primitive drawing section
    }
}

