import {CGFobject} from '../lib/CGF.js';
/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			0.5, 0.5, 0.5,      // 0 - front top right
            -0.5, 0.5, 0.5,     // 1 - front top left
            -0.5, 0.5, -0.5,    // 2 - back top left
            0.5, 0.5, -0.5,     // 3 - back top right
            0.5, -0.5, 0.5,     // 4 - front bottom right
            -0.5, -0.5, 0.5,    // 5 - front bottom left
            -0.5, -0.5, -0.5,   // 6 - back bottom left
            0.5, -0.5, -0.5     // 7 - back bottom right
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			// bottom
            4, 5, 7,
            6, 7, 5,

            // top
            1, 0, 3,
            1, 3, 2,

            // left
            6, 5, 1,
            6, 1, 2,

            // right
            4, 7, 3,
            4, 3, 0,
            
            // front
            5, 4, 0,
            5, 0, 1,
            
            // back
            7, 6, 2,
            7, 2, 3
		];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

