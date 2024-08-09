import {CGFappearance, CGFobject, CGFtexture, CGFshader} from '../../lib/CGF.js';
import { MyGrassLeaf } from './MyGrassLeaf.js';

/**
 * MyGrass
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 */
export class MyGrass extends CGFobject {
	constructor(scene) {
		super(scene);
        this.width = 50;
        this.length = 50;

		// Initialize the leaves and their positions
        this.leaves = [];
        this.x_pos = [];
        this.z_pos = [];
        
        let z = 0;
        while (z < this.length){ // Iterate over the z-axis
            
            let x = 0;
            
            // -0.5 to avoid the grass to be on the edge of the terrain
            while (x < this.width-0.5){ // Iterate over the x-axis
                this.z_pos.push(z);
                this.x_pos.push(x);

                // random height between 0.8 and 1.2
                let height = Math.random()* 0.4 + 0.8;

                // random base between 0.2 and 0.4
                let base = Math.random() * 0.2 + 0.4;

                let stacks = 5;
                
                let leaf = new MyGrassLeaf(scene, height, stacks, base);
                this.leaves.push(leaf);

                // Update x position for next leaf
                x += base;
                x+=1;
            }
            // Update z position for next leaf
            z+=1;
        }
	}
    
    display() {
        // Activate the grass shader
        this.scene.setActiveShader(this.scene.grassShader);

        for (let i=0; i<this.leaves.length; i++){
            
            this.scene.pushMatrix();

            this.scene.translate(this.x_pos[i], 0, -this.z_pos[i]); 

            this.leaves[i].display();
            this.scene.popMatrix();

        }

        // Deactivate the grass shader
        this.scene.setActiveShader(this.scene.defaultShader);
    }

}

