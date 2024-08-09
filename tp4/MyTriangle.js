import { CGFobject } from '../lib/CGF.js';

/**
 * MyTriangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
export class MyTriangle extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			-1, -1, 0,
			-1, -1, 0,
			-1, 1, 0,
			-1, 1, 0,
			1, -1, 0,
			1, -1, 0
		];

		this.indices = [
			0, 4, 2,
			3, 5, 1
		];
		
		this.normals = [];
		for (let i = 0; i < 3; i++) {
			this.normals.push(0, 0, 1);
			this.normals.push(0, 0, -1);
		}

		this.texCoords = [
			0, 1,
			0.5, 1,
			0, 0.5,
			
			0, 1,
			0.5, 1,
			0, 0.5
		];
			
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}
