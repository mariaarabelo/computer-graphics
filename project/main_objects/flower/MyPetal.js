import {CGFappearance, CGFobject} from '../../../lib/CGF.js';
import { MyTriangle } from "../../basic_solids/MyTriangle.js";
import { toRadians } from '../../utils.js';

/**
 * MyPetal
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPetal extends CGFobject {
	constructor(scene, curvature, texture) {
		super(scene);
        this.curvature = toRadians(curvature);
        this.texture = texture;
        
		// Initialize all the parts of the Petal
        this.extTriangle = new MyTriangle(this.scene);
        this.intTriangle = new MyTriangle(this.scene);

	}


	display() {
        // extTriangle transformations
        this.scene.pushMatrix();
        this.scene.rotate(toRadians(180)+this.curvature, 1, 0, 0);            
        this.scene.rotate(toRadians(45), 0, 0, 1);
        this.scene.petalMaterial.setTexture(this.texture);
        this.scene.petalMaterial.apply();
        this.extTriangle.display();
        this.scene.popMatrix();

        // intTriangle transformations
        this.scene.pushMatrix();
        this.scene.rotate(toRadians(45), 0, 0, 1);
        this.scene.petalMaterial.setTexture(this.texture);
        this.scene.petalMaterial.apply();
        this.intTriangle.display();
        this.scene.popMatrix();
    }
}

