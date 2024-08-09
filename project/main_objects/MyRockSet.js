import {CGFobject} from '../../lib/CGF.js';
import { getRandomNumber, shuffleN } from '../utils.js';
import { MyRock } from './MyRock.js';
/**
 * MyRockSet
 * Defines an area where a set of rocks will be created
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {Number} n_rocks Number of rocks in the rock set
 * @param {Number} x x coordinate of the position of the topleft corner of rock set area
 * @param {Number} z z coordinate of the position of the topleft corner of rock set area
 * @param {Number} side_len length of the square that serves as the area to the rock set
 */

export class MyRockSet extends CGFobject {
    /**
     * The area of side "side_len" is divided into a grid of squares that can hold the number of rocks given as argument
     * A rock will be created in each of the squares in the grid as to avoid collisions between rocks. In each square
     * each rock is given a controlled translation in the x and z axis, to increase randomization. Some squares of the grid
     * might be left empty.  
     */
	constructor(scene, n_rocks, x, z, side_len) {
		super(scene);
		this.x = x;
		this.z = z;
        this.side_len = side_len
        this.rocks = []
        this.rocks_per_line = Math.ceil(Math.sqrt(n_rocks));
        this.rock_space_len = side_len / this.rocks_per_line;
        this.max_rock_offset = 1.2;

        // Determines the number of squares of the grid
        const n_squares = Math.pow(this.rocks_per_line, 2);

        // Determines the squares in which a rock will be created
        this.squares_idx = shuffleN(this.getArrayToN(n_squares), n_rocks);

        this.rock_scales = []
        this.rock_x_rots = []
        this.rock_y_rots = []
        this.rock_z_rots = []
        this.rock_x_translates = []
        this.rock_z_translates = []
        for (let _ = 0; _ < n_rocks; _++) {
            this.rocks.push(new MyRock(this.scene, 15, 5, 0.8, this.max_rock_offset));
            this.rock_scales.push([getRandomNumber(0.8, 1.5), getRandomNumber(0.45, 0.75), getRandomNumber(0.8, 1.5)]);
            this.rock_x_rots.push(getRandomNumber(-Math.PI / 15, Math.PI / 15));
            this.rock_y_rots.push(getRandomNumber(0, 2*Math.PI));
            this.rock_z_rots.push(getRandomNumber(-Math.PI / 15, Math.PI / 15));

            const safe_x_translate = Math.max(0, (this.rock_space_len - 1.5 * this.max_rock_offset * 2) / 2)
            const safe_z_translate = Math.max(0, (this.rock_space_len - 1.5 * this.max_rock_offset * 2) / 2)
            this.rock_x_translates.push(getRandomNumber(-safe_x_translate, safe_x_translate));
            this.rock_z_translates.push(getRandomNumber(-safe_z_translate, safe_z_translate));
        }
	}

    /**
     * @param {Number} N 
     * @returns An array with elements from 1 to N - 1
     */
    getArrayToN(N) {
        const res = []

        for (let i = 0; i < N; i++)
            res.push(i);

        return res;
    }

    display() {
        let rock_idx = 0;
        this.squares_idx.forEach((square_idx) => {
            const x_offset = this.x + this.rock_space_len / 2 + this.rock_space_len * (square_idx % this.rocks_per_line);
            const z_offset = this.z + this.rock_space_len / 2 + this.rock_space_len * Math.floor(square_idx / this.rocks_per_line);
            this.scene.rock_material.apply();
            this.scene.pushMatrix();
            this.scene.translate(x_offset + this.rock_x_translates[rock_idx], 1.0 - (this.rock_scales[rock_idx][1])/2, z_offset + this.rock_z_translates[rock_idx]);
            this.scene.rotate(this.rock_x_rots[rock_idx], 1, 0, 0);
            this.scene.rotate(this.rock_y_rots[rock_idx], 0, 1, 0);
            this.scene.rotate(this.rock_z_rots[rock_idx], 0, 0, 1);
            this.scene.scale(this.rock_scales[rock_idx][0], this.rock_scales[rock_idx][1], this.rock_scales[rock_idx][2]);
            this.rocks[rock_idx].display();
            this.scene.popMatrix();
            
            rock_idx++;
        })
    }
}
