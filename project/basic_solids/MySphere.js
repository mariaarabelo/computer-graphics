import {CGFobject} from '../../lib/CGF.js';
import { normalizeVec3 } from '../utils.js';
/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - Number of slices of the sphere. Represents the number of meridians
 * @param stacks - Number of stacks of half of the sphere. Its double represents the number of parallels
 * @param inverted - True if the sphere is to be seen from the inside, false otherwise
 * @param topYScale - The scale that is to be provided to the north hemisphere, giving the appearance of an egg
 */
export class MySphere extends CGFobject {
	constructor(scene, slices, stacks, inverted, topYScale = 1.0) {
		super(scene);
		this.slices = slices;
		this.stacks = stacks;
		this.inverted = inverted ? -1 : 1;
		this.topYScale = topYScale;
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
			for (let slice = 0; slice <= this.slices; slice += 1, slice_tex += tex_delta_s) {
				const azimuthal_ang = slice * delta_slice;
				const polar_ang = Math.PI - stack * delta_stack;
				const x = Math.sin(azimuthal_ang)*Math.sin(polar_ang);
				const y = Math.cos(polar_ang);
				const z = Math.cos(azimuthal_ang)*Math.sin(polar_ang);
				

				if (stack >= this.stacks) {
					// Scale the north hemisphere
					this.vertices.push(x, y * this.topYScale, z);
					this.normals.push(...normalizeVec3([this.inverted * x, this.inverted * y * this.topYScale, this.inverted * z]));
				} else {
					this.vertices.push(x, y, z);
					this.normals.push(this.inverted * x, this.inverted * y, this.inverted * z);
				}
				
				this.texCoords.push(slice_tex, stack_tex);
				
				// Variables to define the vertices that form a rectangle (formed by two triangles as shown in the project's guide)
				const bottom_left = slice + (stack-1)*(this.slices+1);
				const bottom_right = slice + 1 + (stack-1)*(this.slices+1);
				const top_left = slice + (this.slices+1) + (stack-1)*(this.slices+1);
				const top_right = slice + 1 + (this.slices+1) + (stack-1)*(this.slices+1);

				if (slice < this.slices && stack < this.stacks * 2 - 1) {
					if (this.inverted == 1) {
						this.indices.push(bottom_left, bottom_right, top_left);
						this.indices.push(bottom_right, top_right, top_left);
					}
					else {
						this.indices.push(bottom_left, top_left, bottom_right);
						this.indices.push(bottom_right, top_left, top_right);
					}
				}
			}
		}

		const n_vertices = this.vertices.length / 3;
		const last_stack_start = n_vertices - this.slices - 1;
		for (let i = 0; i < this.slices + 1; i++) {
			this.vertices.push(0, -1, 0);
			this.vertices.push(0, 1 * this.topYScale, 0);
			this.normals.push(0, this.inverted * -1, 0);
			this.normals.push(0, this.inverted * 1, 0);
			this.texCoords.push(i * tex_delta_s, 1)
			this.texCoords.push(i * tex_delta_s, 0);

			if (i < this.slices) {
				if (this.inverted == 1) {
					this.indices.push(i, n_vertices + i*2, i+1);
					this.indices.push(last_stack_start + i, last_stack_start + i+1, n_vertices + i*2 + 1);
				}
				else {
					this.indices.push(i, i+1, n_vertices + i*2);
					this.indices.push(last_stack_start + i, n_vertices + i*2 + 1, last_stack_start + i+1);
				}
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

