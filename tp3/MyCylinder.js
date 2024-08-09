import {CGFobject} from '../lib/CGF.js';
/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices
 * @param stacks
 */
export class MyCylinder extends CGFobject {
	constructor(scene, slices, stacks) {
		super(scene);
		this.slices = slices;
		this.stacks = stacks;
		this.initBuffers();
	}

	normalizeVector(x, y, z) {
		magnitude = Math.sqrt(x*x + y*y + z*z);
		
		return [x/magnitude, y/magnitude, z/magnitude];
	}
	
	initBuffers() {
		const step = 2*Math.PI / this.slices;

		this.vertices = []
		this.normals = []

		let stack_height = 0;
		while (stack_height < 1) {
			for (let i = 0; i < this.slices; i++) {
				this.vertices.push(Math.cos(step * i), Math.sin(step * i), stack_height);
				this.vertices.push(Math.cos(step * i), Math.sin(step * i), stack_height+1/this.stacks);

				this.normals.push(Math.cos(step*i), Math.sin(step*i), 0);
				this.normals.push(Math.cos(step*i), Math.sin(step*i), 0);
			}
			stack_height += 1/this.stacks;
		}

		const nVertices = this.vertices.length; // each vertex has 3 coordinates

		this.indices = []
		let j = 0; // essa foi difícil :')
		for (let s = 0; s < this.stacks; s++) {
			for (let i = 0; i < this.slices; i++){
				this.indices.push(j, j+2, j+ 3);
				this.indices.push(j, j+3, j + 1);
				j+=2;
			}
		}

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

