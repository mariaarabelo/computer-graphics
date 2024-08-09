import {CGFobject} from '../../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';
import { MySphere } from './MySphere.js';
import { toRadians } from '../utils.js';
/**
 * MyBentTube
 * @constructor
 * @param scene - Reference to MyScene object
 * @param angle - Angle between the horn's ends. Must in the interval [0, 90]
 */

export class MyBentTube extends CGFobject {
	constructor(scene, angle) {
		super(scene);
        this.angle = toRadians(angle);
        this.hornStart = new MyCylinder(scene, 10, 3);
        this.hornMiddle = new MyCylinder(scene, 10, 3);
        this.hornEnd = new MySphere(scene, 10, 5, false);
	}

    display() {
        const cylinder_height = 0.64;
        const cylinder_radius = 0.06;

        // Start of the horn
        this.scene.pushMatrix();
        this.scene.scale(cylinder_radius, cylinder_radius, cylinder_height);
        this.hornStart.display();
        this.scene.popMatrix();

        // Middle of the horn
        this.scene.pushMatrix();
        this.scene.translate(cylinder_radius - cylinder_radius*Math.cos(this.angle), 0, cylinder_height - Math.sin(this.angle)*cylinder_radius);
        this.scene.rotate(-this.angle, 0, 1, 0);
        this.scene.scale(cylinder_radius, cylinder_radius, cylinder_height);
        this.hornMiddle.display();
        this.scene.popMatrix();

        // End of the horn
        this.scene.pushMatrix();
        this.scene.translate(cylinder_radius - cylinder_radius*Math.cos(this.angle) - cylinder_height*Math.sin(this.angle), 0, cylinder_height + cylinder_height*Math.cos(this.angle) - Math.sin(this.angle)*cylinder_radius);
        this.scene.scale(cylinder_radius, cylinder_radius, cylinder_radius);
        this.hornEnd.display();
        this.scene.popMatrix();
    }
}
