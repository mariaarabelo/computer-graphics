import {CGFobject} from '../../lib/CGF.js';
import { MyGrassTriangle } from '../basic_solids/MyGrassTriangle.js';
import { getRandomNumber } from '../utils.js';

/**
 * MyGrassLeaf
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {number} height - Height in y of the leaf
 * @param {number} base - Base of the leaf
 * @param {number} stacks - Number of stacks of the leaf.
 */
export class MyGrassLeaf extends CGFobject {
	constructor(scene, height, stacks, base) {
		super(scene);
        this.base = base;

        this.initMaterials();
                        
        // random integer - 0 or 1
        let materialIndex = Math.round(Math.random());
        this.materialIndex = materialIndex;

        // Grass Triangle has a special geometry
		this.triangle = new MyGrassTriangle(this.scene, height, stacks, base);
        
        this.t0 = getRandomNumber(0, 1);
	}

    initMaterials() {
        this.grassMaterials = [
            this.scene.greenMaterial,
            this.scene.darkGreenMaterial
        ]
    }


	display() {
        
        this.scene.grassShader.setUniformsValues({
            t0: this.t0,
        });

        this.scene.pushMatrix();

        this.grassMaterials[this.materialIndex].apply();
        this.scene.grass_texture.bind(0);
        this.triangle.display();

        this.scene.popMatrix();
    }

}

