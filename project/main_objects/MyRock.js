import {CGFobject, CGFscene} from '../../lib/CGF.js';
import { getRandomNumber } from '../utils.js';
/**
 * MyRock
 * Creates a rock. A rock is a variation of a normal sphere where each vertex can suffer a small translation in the direction
 * of the normal in the vertex, as to create pointy areas
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {Number} slices - Number of slices of the sphere of the rock. Represents the number of meridians
 * @param {Number} stacks - Number of stacks of the sphere of the rock. Represents the number of parallels
 */
export class MyRock extends CGFobject {
	constructor(scene, slices, stacks, min_offset, max_offset) {
		super(scene);
		this.slices = slices;
		this.stacks = stacks;
		this.min_offset = min_offset;
		this.max_offset = max_offset
		this.initBuffers();
	}
	
	initBuffers() {
		// Constants for "coordinate" variation
		const delta_stack = Math.PI / (this.stacks * 2);
		const delta_slice = 2*Math.PI / this.slices;
		const tex_delta_s = 1.0 / this.slices;
		const tex_delta_t = 1.0 / (this.stacks * 2);

		this.vertices = []
		this.normals = []
		this.texCoords = []
		this.indices = []
		
		let stack_tex = 1.0 - tex_delta_t;
		for (let stack = 1; stack <= this.stacks * 2 - 1; stack += 1, stack_tex -= tex_delta_t) {
			let slice_tex = 0;

			// This constant is needed so that the repeated vertices on the first slice have the same variation
			const first_and_last_offset = getRandomNumber(this.min_offset, this.max_offset);
			for (let slice = 0; slice <= this.slices; slice += 1, slice_tex += tex_delta_s) {
				const azimuthal_ang = slice * delta_slice;
				const polar_ang = Math.PI - stack * delta_stack;
				let offset = getRandomNumber(this.min_offset, this.max_offset);
				const x = Math.sin(azimuthal_ang)*Math.sin(polar_ang);
				const y = Math.cos(polar_ang);
				const z = Math.cos(azimuthal_ang)*Math.sin(polar_ang);
				
				if (slice == 0 || slice == this.slices)
					offset = first_and_last_offset;

				this.vertices.push(x * offset, y * offset, z * offset);
				this.normals.push(x, y, z);
				this.texCoords.push(slice_tex, stack_tex);
				
				// Variables to define the vertices that form a rectangle (formed by two triangles as shown in the project's guide)
				const bottom_left = slice + (stack-1)*(this.slices+1);
				const bottom_right = slice + 1 + (stack-1)*(this.slices+1);
				const top_left = slice + (this.slices+1) + (stack-1)*(this.slices+1);
				const top_right = slice + 1 + (this.slices+1) + (stack-1)*(this.slices+1);

				if (slice < this.slices && stack < this.stacks * 2 - 1) {
					this.indices.push(bottom_left, bottom_right, top_left);
					this.indices.push(bottom_right, top_right, top_left);
				}
			}
		}

		const n_vertices = this.vertices.length / 3;
		const last_stack_start = n_vertices - this.slices - 1;
		const offset = getRandomNumber(this.min_offset, this.max_offset);
		for (let i = 0; i < this.slices + 1; i++) {
			this.vertices.push(0, -1 * offset, 0);
			this.vertices.push(0, 1 * offset, 0);
			this.normals.push(0, -1, 0);
			this.normals.push(0, 1, 0);
			this.texCoords.push(i * tex_delta_s, 1)
			this.texCoords.push(i * tex_delta_s, 0);

			if (i < this.slices) {
				this.indices.push(i, n_vertices + i*2, i+1);
				this.indices.push(last_stack_start + i, last_stack_start + i+1, n_vertices + i*2 + 1);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}
