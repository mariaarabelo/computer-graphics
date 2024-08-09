import {CGFobject} from '../../lib/CGF.js';
import { getRandomNumber } from '../utils.js';
import { MyRock } from './MyRock.js';
/**
 * MyRockTower
 * Builds a pyramid of rocks to be used as a base to a bee hive
 * @constructor
 * @param {CGFscene} scene Reference to MyScene object
 * @param {Number} last_stack_len Number of rocks on the side of the bottom stack in the rock pyramid
 * @param {Number} x x coordinate of the position of the topleft corner of rock tower
 * @param {Number} z z coordinate of the position of the topleft corner of rock tower
 */

export class MyRockTower extends CGFobject {
	constructor(scene, last_stack_len, x, z) {
		super(scene);
        this.n_rocks = 0;
		this.x = x;
		this.z = z;
        this.rocks = []
        this.rocks_coords = []
        this.rocks_scales = []

        // Radius of the rock in the y axis after scaling
        const sphere_radius = 1;

        this.n_rocks = last_stack_len * last_stack_len + (last_stack_len - 1) * (last_stack_len - 1) - 1;
        
        // Represents two different pyramids of rocks, one with an even number of rocks per stack and one with an odd number of rocks per stack
        for (let line = 0; line < last_stack_len; line++) {
            for (let col = 0; col < last_stack_len; col++) {
                if (last_stack_len % 2 == 1 && Math.floor(last_stack_len/2) == line && Math.floor(last_stack_len/2) == col) {
                    this.topX = this.x + 2.2*col + sphere_radius;
                    this.topY = 0.5 + 1.25*Math.min(line, col, last_stack_len - 1 - line, last_stack_len - 1 - col);
                    this.topZ = this.z + 2.2*line + sphere_radius;
                    continue;
                }
                this.rocks.push(new MyRock(this.scene, 15, 5, 0.8, 1.2))
                this.rocks_coords.push(2.2*col + sphere_radius, 0.5 + 1.25*Math.min(line, col, last_stack_len - 1 - line, last_stack_len - 1 - col), 2.2*line + sphere_radius);
                this.rocks_scales.push(getRandomNumber(0.85, 1.15), getRandomNumber(0.4, 0.6), getRandomNumber(0.85, 1.15));
            }
        }
        
        for (let line = 0; line < last_stack_len - 1; line++) {
            for (let col = 0; col < last_stack_len - 1; col++) {
                if (last_stack_len % 2 == 0 && Math.floor((last_stack_len - 1)/2) == line && Math.floor((last_stack_len-1)/2) == col) {
                    this.topX = this.x + 2.2*col + 2*sphere_radius;
                    this.topY = 1 + 1.25*Math.min(line, col, last_stack_len - 2 - line, last_stack_len - 2 - col);
                    this.topZ = this.z + 2.2*line + 2*sphere_radius;
                    continue;
                }
                this.rocks.push(new MyRock(this.scene, 15, 5, 0.8, 1.2))
                this.rocks_coords.push(2.2*col + 2*sphere_radius, 1 + 1.25*Math.min(line, col, last_stack_len - 2 - line, last_stack_len - 2 - col), 2.2*line + 2*sphere_radius);
                this.rocks_scales.push(getRandomNumber(0.85, 1.15), getRandomNumber(0.4, 0.60), getRandomNumber(0.85, 1.15));
            }
        }
	}

    display() {
        this.scene.rock_material.apply();
        for (let rock = 0; rock < this.n_rocks; rock++) {
            this.scene.pushMatrix();
            this.scene.translate(this.x+this.rocks_coords[3*rock], this.rocks_coords[3*rock+1],this.z+ this.rocks_coords[3*rock+2]);
            this.scene.scale(this.rocks_scales[3*rock], this.rocks_scales[3*rock+1], this.rocks_scales[3*rock+2])
            this.rocks[rock].display();
            this.scene.popMatrix();
        }
    }
}
