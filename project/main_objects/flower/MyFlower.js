import {CGFappearance, CGFobject} from '../../../lib/CGF.js';
import { MyPetal } from "./MyPetal.js";
import { MyReceptacle } from "./MyReceptacle.js";
import { MyStem } from "./MyStem.js";
import { MyPollen } from "./../MyPollen.js";
import { toRadians } from '../../utils.js';

/**
 * MyFlower

 * @constructor
    * @param {CGFscene} scene - Reference to MyScene object
    * @param {number} nPetals - Number of petals in the flower
    * @param {number} extRadius - External radius of the flower
    * @param {number} receptacleRadius - Radius of the flower's receptacle
    * @param {number} cylinderRadius - Radius of the flower's stem
    * @param {number} nCylinders - Number of cylinders in the stem
    * @param {Array} stemColor - Color of the stem
    * @param {Array} leafColor - Color of the leaves
    * @param {Array} petalColor - Color of the petals
*/
export class MyFlower extends CGFobject {
	constructor(scene, nPetals, extRadius, receptacleRadius, 
        cylinderRadius, nCylinders, stemColor, leafColor, petalColor) {
		super(scene);

        // Initialize pollen with a random rotation
        this.pollen = new MyPollen(this.scene);
        this.pollenRotation = toRadians(Math.random() * 90);

		// Initialize all the parts of the Flower
        this.petals = [];
        this.baseCurvatures = [];
        for (let i = 0; i < nPetals; i++){
            let baseCurvature = Math.random() * 10+60;
            this.baseCurvatures.push(toRadians(baseCurvature));

            let extCurvature = Math.random() *30+30;
            this.petals.push(new MyPetal(this.scene, extCurvature, petalColor));
        }

        this.extRadius = extRadius;

        this.receptacleRadius = receptacleRadius;
        this.receptacle = new MyReceptacle(this.scene);

        this.stem = new MyStem(this.scene, nCylinders, cylinderRadius,
             stemColor, leafColor);
	}

    removePollen() {
        this.pollen = null;
    }

    display() {
        let high = Math.sqrt(2);
        let angle = 0;
        
        // Display each petal with a unique angle and curvature
        for (let i =0; i< this.petals.length; i++){
            this.scene.pushMatrix();
            this.scene.translate(this.stem.total_width, this.stem.total_height, 0);
            this.scene.rotate(toRadians(angle), 0, 1, 0);
            // curvature of intTriangle
            this.scene.rotate(this.baseCurvatures[i], 1, 0, 0);
            this.scene.scale(0.5, this.extRadius, 1); 
            this.scene.translate(0, high, 0); 
            this.petals[i].display();
            this.scene.popMatrix();    

            angle+=360/this.petals.length;
        }

        // Display stem
        this.scene.pushMatrix();
        this.stem.display();
        this.scene.popMatrix();

        // Display receptacle
        this.scene.pushMatrix();
        this.scene.translate(this.stem.total_width, this.stem.total_height, 0);
        this.scene.scale(this.receptacleRadius, this.receptacleRadius, this.receptacleRadius);
        this.receptacle.display();
        this.scene.popMatrix();

        // If pollen exists, display it
        if (this.pollen != null) {
            this.scene.pushMatrix();
            this.scene.translate(this.stem.total_width, this.receptacleRadius+this.stem.total_height, 0);
            this.scene.rotate(this.pollenRotation, 0, 0, 1);
            this.scene.scale(0.15, 0.15, 0.15);
            this.pollen.display();
            this.scene.popMatrix();
        }

    }
}

