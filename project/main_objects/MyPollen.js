import { CGFobject } from '../../lib/CGF.js';
import { MySphere } from '../basic_solids/MySphere.js';

/**
 * MyPollen
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPollen extends CGFobject {
	constructor(scene) {
		super(scene);
        this.sphere = new MySphere(this.scene, 5, 5, false, 1.7);
	}

	display() {
        this.scene.pushMatrix();
        this.scene.pollen_material.apply();
        this.sphere.display();
        this.scene.popMatrix();
    }
}

