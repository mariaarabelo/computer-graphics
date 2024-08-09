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
				1, 0, 0,
				0, 1, 0
				];

		this.indices = [
				0, 1, 2
			];
			
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}
