import {CGFappearance, CGFobject} from '../../../lib/CGF.js';
import { MySphere } from '../../basic_solids/MySphere.js';

/**
 * MyReceptacle
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 */
export class MyReceptacle extends CGFobject {
	constructor(scene) {
		super(scene);
        this.sphere = new MySphere(this.scene, 8, 6);

        this.initMaterials();
	}

    initMaterials() {
        this.yellowMaterial = new CGFappearance(this.scene);
        this.yellowMaterial.setAmbient(1.0, 1.0, 0, 1.0); // param 4: alpha, opacidade, transparencia
        this.yellowMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
        this.yellowMaterial.setShininess(10.0);
        this.yellowMaterial.setTexture(this.scene.receptacle_texture);
    }

	display() {
        this.scene.pushMatrix();
        this.yellowMaterial.apply();
        this.sphere.display();
        this.scene.popMatrix();
    }
}

