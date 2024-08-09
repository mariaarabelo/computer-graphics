import { CGFobject } from '../lib/CGF.js';

/**
 * MyTriangleSmall
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
export class MyTriangleSmall extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			-1, 0, 0,
			-1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			0, 1, 0,
			0, 1, 0
		];

		this.indices = [
			0, 2, 4,
			5, 3, 1
		];

		this.normals = [];
		for (let i = 0; i < 3; i++) {
			this.normals.push(0, 0, 1);
			this.normals.push(0, 0, -1);
		}
			
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}
