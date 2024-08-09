import {CGFobject} from '../../lib/CGF.js';
/**
 * MyGrassTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param height - Height of the leaf
 * @param stacks - Number of vertex stacks of the leaf
 * @param base - Length of the base of the leaf
 */
export class MyGrassTriangle extends CGFobject {
	constructor(scene, height, stacks, base) {
		super(scene);
		this.height = height;
		this.base = base;
		this.stacks = stacks;
		this.initBuffers();
	}
	
	initBuffers() {
		// Values for "coordinate" variation
		const delta_stack = this.height / this.stacks;
		const delta_x = this.base / (2*this.stacks);
		
		let tex_delta_s;
		if (this.stacks > 1) 
			tex_delta_s = 1.0 / (2 * this.stacks - 1);
		else 
			tex_delta_s = 0.5;
		
		const tex_delta_t = 1.0 / this.stacks;

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];
		
		let x = 0;
		let xf = this.base;
		let y = 0;
		let tex_s = 0;
		let tex_sf = 1;
		let tex_t = 1;
		for (let stack = 0; stack < this.stacks; stack += 1, x+=delta_x, xf-=delta_x, y+=delta_stack, 
				tex_s+=tex_delta_s, tex_sf-=tex_delta_s, tex_t-=tex_delta_t) {

			this.vertices.push(x, y, 0);
			this.normals.push(0, 0, 1);
			this.texCoords.push(tex_s, tex_t);

			this.vertices.push(xf, y, 0);
			this.normals.push(0, 0, 1);
			this.texCoords.push(tex_sf, tex_t);
			
			// Variables to define the vertices that form the triangles
			const bottom_left = stack*2;
			const bottom_right = stack*2+1;
			
			// Stacks with 2 triangles
			if (stack < this.stacks - 1) {

				// Variables to define the vertices that form the triangles
				const top_left = bottom_left+2;
				const top_right = bottom_right+2;

				// front indices
				this.indices.push(bottom_left, bottom_right, top_right);
				this.indices.push(bottom_left, top_right, top_left);

				// back indices
				this.indices.push(bottom_right, bottom_left, top_left);
				this.indices.push(bottom_right, top_left, top_right);				

			} else {
				// In the top, we only have one triangle
				const x1 = x + delta_x; 
				const y1 = y + delta_stack;

				this.vertices.push(x1, y1, 0);

				this.normals.push(0, 0, 1);
				this.texCoords.push(tex_s+tex_delta_s, tex_t-tex_delta_t);
	
				const top = bottom_left+2;

				// front indices
				this.indices.push(bottom_left, bottom_right, top);

				// back indices
				this.indices.push(bottom_right, bottom_left, top);

			}
		}
	
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

