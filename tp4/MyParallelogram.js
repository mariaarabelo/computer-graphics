import {CGFobject} from '../lib/CGF.js';
/**
 * MyParallelogram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyParallelogram extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			0, 0, 0,
            2, 0, 0,
            1, 1, 0,
            3, 1, 0,

			0, 0, 0, // front
            2, 0, 0,
            1, 1, 0,
            3, 1, 0
		];

		this.indices = [
			0, 1, 2,
            1, 3, 2,
            6, 5, 4,   // Make the parallelogram double-sided (clockwise) reference of vertices
            6, 7, 5     // Make the parallelogram double-sided (clockwise) reference of vertices
		];

		this.normals = [
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,
			0, 0, -1,

			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		this.texCoords = [
			1, 1,
			0.5, 1,
			0.75, 0.75,
			0.25, 0.75,
			
			1, 1,
			0.5, 1,
			0.75, 0.75,
			0.25, 0.75
		]

		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

