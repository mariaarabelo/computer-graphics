import {CGFappearance, CGFobject} from '../../../lib/CGF.js';
import { MyCylinder } from '../../basic_solids/MyCylinder.js';
import { MySphere } from '../../basic_solids/MySphere.js';
import { MyTriangle } from "../../basic_solids/MyTriangle.js";
import { toRadians } from '../../utils.js';

/**
 * MyLeaf
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {CGFappearance} stemColor - Color of the stem
 * @param {CGFappearance} leafColor - Color of the leaves
 */
export class MyLeaf extends CGFobject {
	constructor(scene, stemColor, leafColor) {
		super(scene);

		// Initialize all the parts of the Leaf
        this.leftTriangle = new MyTriangle(this.scene);
        this.cylinder = new MyCylinder(this.scene, 20, 1);
        this.sphere = new MySphere(this.scene, 10, 6);
        this.rightTriangle = new MyTriangle(this.scene);
        
        this.stemColor = stemColor;
        this.leafColor = leafColor;        
	}

    display() {
        // leftTriangle transformations
        this.scene.pushMatrix();      
        this.scene.scale(0.1, 0.1, 1);
        this.scene.translate(0, 0, -3);
        this.scene.scale(1, 1, 0.5); 
        this.scene.translate(-1, 0, Math.sqrt(2));
        this.scene.scale(3, 1, 1);          
        this.scene.rotate(toRadians(45), 0, 1, 0);         
        this.scene.rotate(toRadians(90), 1, 0, 0);
        this.leafColor.apply();
        this.leftTriangle.display();
        this.scene.popMatrix();

        // sphere transformations
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -3);
        this.scene.scale(0.1, 0.1, 0.1);
        this.stemColor.apply();
        this.sphere.display();
        this.scene.popMatrix();

        // cylinder transformations
        this.scene.pushMatrix();
        this.scene.scale(0.1, 0.1, 1);
        this.scene.translate(0, 0, -3);
        this.scene.scale(1, 1, 3);
        this.stemColor.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        // rightTriangle transformations
        this.scene.pushMatrix();
        this.scene.scale(0.1, 0.1, 1);
        this.scene.translate(0, 0, -3);
        this.scene.scale(1, 1, 0.5); 
        this.scene.translate(1, 0, Math.sqrt(2));
        this.scene.scale(3, 1, 1);
        this.scene.rotate(toRadians(-135), 0, 1, 0);         
        this.scene.rotate(toRadians(90), 1, 0, 0);
        this.leafColor.apply();
        this.rightTriangle.display();
        this.scene.popMatrix();
    }
}

