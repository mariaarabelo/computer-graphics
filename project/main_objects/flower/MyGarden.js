import {CGFappearance, CGFobject, CGFtexture} from '../../../lib/CGF.js';
import { MyFlower } from "./MyFlower.js";

/**
 * MyGarden

* @constructor
    * @param {CGFscene} scene - Reference to MyScene object
    * @param {number} width - Number of flowers in the x direction
    * @param {number} length - Number of flowers in the z direction
 */
export class MyGarden extends CGFobject {
	constructor(scene, width, length) {
		super(scene);
        this.width = width;
        this.length = length;
        this.flowerScale = 0.5

        this.scene.greenMaterial.setTexture(this.scene.leaf_texture);
        this.scene.darkGreenMaterial.setTexture(this.scene.stem_texture);

		// Initialize the flowers in the Garden
        this.flowers = [];
        for (let i = 0; i < width; i++){
            for (let j = 0; j < length; j++){
                // Generate random properties for each flower
                let nPetals = Math.random() * 5 +5 ;
                let extRadius = Math.random() * 2 + 1.5;
                let receptacleRadius = Math.random() * 0.2 + 1;
                let stemRadius = Math.random() * 0.2 + 0.2;
                let nCylinders = Math.floor(Math.random() * 4) + 3;
                let textureIndex = Math.round(Math.random());

                // Create a new flower with the generated properties
                let flower = new MyFlower(scene, nPetals, extRadius, receptacleRadius, 
                    stemRadius, nCylinders, this.scene.darkGreenMaterial, this.scene.greenMaterial, this.scene.petal_textures[textureIndex]);

                this.flowers.push(flower);
            }
        }
	}

    /**
     * Generates an array of flower references with their positions and scaled properties.
     * @returns {Object[]} An array of objects containing references to flowers and their positions.
     */
    getFlowers() {
        const flowerRefs = [];

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.length; j++) {
                const index = i * this.length + j;
                flowerRefs.push({
                    "flowerRef": this.flowers[index],
                    "x": this.scene.garden_translate[0] -i*6 + this.flowers[index].stem.total_width * this.flowerScale,
                    "y": (this.flowers[index].stem.total_height + this.flowers[index].receptacleRadius) * this.flowerScale,
                    "z": this.scene.garden_translate[2] -j*6,
                    "receptacleRadius": this.flowers[index].receptacleRadius * this.flowerScale
                })
            }
        }

        return flowerRefs;
    }

    display() {
        for (let i = 0; i < this.width; i++){ // x
            for (let j = 0; j < this.length; j++){ // z
                this.scene.pushMatrix();
                this.scene.translate(-i*6, 0, -j*6);

                const index = i * this.length + j;
                this.scene.scale(this.flowerScale, this.flowerScale, this.flowerScale);
                this.flowers[index].display();
                this.scene.popMatrix();
            }
        }
    }

}

