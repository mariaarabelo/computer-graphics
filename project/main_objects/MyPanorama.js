import {CGFobject} from '../../lib/CGF.js';
import { MySphere } from '../basic_solids/MySphere.js';
/**
 * MyPanorama
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPanorama extends CGFobject {
	constructor(scene, texture) {
		super(scene);
        this.texture = texture;
        this.sphere = new MySphere(scene, 20, 10, true);
        this.scene.panorama_material.setTexture(this.texture);
	}
	
    display() {
        const camera_pos = this.scene.camera.position;
        this.scene.panorama_material.apply();

        this.scene.pushMatrix();
        this.scene.translate(camera_pos[0], camera_pos[1], camera_pos[2]);
        this.scene.scale(200.0, 200.0, 200.0);
        this.sphere.display();
        this.scene.popMatrix();
    }
}

