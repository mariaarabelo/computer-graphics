import {CGFobject, CGFscene} from  '../../lib/CGF.js';
import { MyUnitCubeQuad } from '../basic_solids/MyUnitCubeQuad.js';
import { MyPollen } from './MyPollen.js';

/**
 * MyHive
 * Creates a modern bee hive with two entrances and a metal sheet where the bee keeps the collected pollen  
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 */

export class MyHive extends CGFobject {
	constructor(scene) {
		super(scene);
        this.cover = new MyUnitCubeQuad(this.scene, this.scene.cross_wood_texture, this.scene.cross_wood_texture, this.scene.cross_wood_texture,
            this.scene.cross_wood_texture, this.scene.cross_wood_texture, this.scene.cross_wood_texture
        );

        this.lowerBox = new MyUnitCubeQuad(this.scene, this.scene.bee_hive_sheet, this.scene.light_wood_texture, this.scene.light_wood_texture,
            this.scene.light_wood_texture, this.scene.light_wood_texture, this.scene.light_wood_texture
        );

        this.regularBox = new MyUnitCubeQuad(this.scene, this.scene.light_wood_texture, this.scene.light_wood_texture, this.scene.light_wood_texture, this.scene.light_wood_texture,
            this.scene.light_wood_texture, this.scene.light_wood_texture
        );

        this.access_normals = this.getAccessNormals();
        
        const face_points = this.getOneFacesPoints();

        this.front_face_d = this.calculatePlaceD(this.access_normals[0], face_points[0])
        this.back_face_d = this.calculatePlaceD(this.access_normals[1], face_points[1])

        this.pollens = [];
        this.pollen_scale = 0.02;
	}

	display() {
        // Hive Lid
        this.scene.pushMatrix();
        this.scene.translate(0.0, 1.1, 0.0);
        this.scene.scale(1.2, 0.2, 1.2);
        this.cover.display();
        this.scene.popMatrix();
        
        // Back ledge
        this.scene.pushMatrix();
        this.scene.translate(0.0, 0.2, -0.55);
        this.scene.scale(1.0, 0.05, 0.1);
        this.regularBox.display();
        this.scene.popMatrix();

        // Front ledge
        this.scene.pushMatrix();
        this.scene.translate(0.0, 0.2, 0.55);
        this.scene.scale(1.0, 0.05, 0.1);
        this.regularBox.display();
        this.scene.popMatrix();

        // Upper box
        this.scene.pushMatrix();
        this.scene.translate(0.0, 0.65, 0.0);
        this.scene.scale(1.0, 0.7, 1.0);
        this.regularBox.display();
        this.scene.popMatrix();

        // Right side Box
        this.scene.pushMatrix();
        this.scene.translate(0.45, 0.25, 0);
        this.scene.scale(0.1, 0.1, 1.0);
        this.regularBox.display();
        this.scene.popMatrix();

        // Left side Box
        this.scene.pushMatrix();
        this.scene.translate(-0.45, 0.25, 0);
        this.scene.scale(0.1, 0.1, 1.0);
        this.regularBox.display();
        this.scene.popMatrix();

        // Lower Box
        this.scene.pushMatrix();
        this.scene.translate(0.0, 0.1, 0.0);
        this.scene.scale(1.0, 0.2, 1.0);
        this.lowerBox.display();
        this.scene.popMatrix();

        // Pollens
        let z = 0.4, x = -0.35;
        for (let i = 0; i < this.pollens.length; i++) {
            this.scene.pushMatrix();
            this.scene.translate(x, 0.2 + this.pollen_scale, z)
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.scene.scale(this.pollen_scale, this.pollen_scale, this.pollen_scale);
            this.pollens[i].display();
            this.scene.popMatrix();

            x += this.pollen_scale + 0.05

            if (x >= 0.35) {
                x = -0.35
                z -= this.pollen_scale + 0.15
            }

            if (z <= -0.4)
                break;
        }
    }

    /**
     * This function only works if the bee hive has a uniform scaling and only considers rotations around the y axis
     * @returns The points in which the bee can stop to drop the pollen. It always returns two points, one for each entrance of the bee hive
     */
    getBeeAccessPoints() {
        const normals = this.getAccessNormals();

        return [
            [
                this.scene.hive_scale * Math.sin(this.scene.hive_rot) * 0.5 + this.scene.hive_translate[0] + 0.25 * normals[0][0],
                this.scene.hive_scale * 0.25 + this.scene.hive_translate[1],
                this.scene.hive_scale * Math.cos(this.scene.hive_rot) * 0.5 + this.scene.hive_translate[2] + 0.25 * normals[0][2]
            ], 
            [
                this.scene.hive_scale * Math.sin(this.scene.hive_rot + Math.PI) * 0.5 + this.scene.hive_translate[0] + 0.25 * normals[1][0],
                this.scene.hive_scale * 0.25 + this.scene.hive_translate[1],
                this.scene.hive_scale * Math.cos(this.scene.hive_rot + Math.PI) * 0.5 + this.scene.hive_translate[2] + 0.25 * normals[1][2]
            ]
        ];
    }

    /**
     * @returns The normals of the faces that have the entrances to the bee hive. The normals point outwards
     */
    getAccessNormals() {
        return [
            [Math.sin(this.scene.hive_rot), 0, Math.cos(this.scene.hive_rot)], 
            [Math.sin(this.scene.hive_rot + Math.PI), 0, Math.cos(this.scene.hive_rot + Math.PI)]
        ]
    }

    /**
     * @returns Returns a point of each face that represents an entrance of the bee hive
     */
    getOneFacesPoints() {
        return [
            [
                this.scene.hive_scale * Math.sin(this.scene.hive_rot) * 0.5 + this.scene.hive_translate[0],
                this.scene.hive_translate[1],
                this.scene.hive_scale * Math.cos(this.scene.hive_rot) * 0.5 + this.scene.hive_translate[2]
            ],
            [
                this.scene.hive_scale * Math.sin(this.scene.hive_rot + Math.PI) * 0.5 + this.scene.hive_translate[0],
                this.scene.hive_translate[1],
                this.scene.hive_scale * Math.cos(this.scene.hive_rot + Math.PI) * 0.5 + this.scene.hive_translate[2]
            ]
        ]
    }

    /**
     * @param {Array} normal Normal of the plane
     * @param {Array} point A point of the plane
     * @returns Computes the constant "d" of the plane formula (ax + by + cz + d)
     */
    calculatePlaceD(normal, point) {
        return -(normal[0]*point[0] + normal[1]*point[1] + normal[2]*point[2]);
    }

    /**
     * Tests if a point is in front or behind of the front entrance plane, taking its normal into account
     * @param {Array} point Point to be tested
     * @returns True if it is in front of the plane, false otherwise
     */
    inFrontOfFront(point) {
        const normal = this.access_normals[0];
        return normal[0]*point[0] + normal[1]*point[1] + normal[2]*point[2] + this.front_face_d > 0.5;
    }

    /**
     * Tests if a point is in front or behind of the back entrance plane, taking its normal into account
     * @param {Array} point Point to be tested
     * @returns True if it is in front of the plane, false otherwise
     */
    inFrontOfBack(point) {
        const normal = this.access_normals[1];
        return normal[0]*point[0] + normal[1]*point[1] + normal[2]*point[2] + this.back_face_d > 0.5;
    }

    /**
     * Adds a pollen reference to the bee hive
     * @param {MyPollen} pollen Pollen reference to be added
     */
    addPollen(pollen) {
        this.pollens.push(pollen);
    }
}

