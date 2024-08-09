import {CGFappearance, CGFobject} from '../../../lib/CGF.js';
import { MyLeaf } from './MyLeaf.js';
import { MyCylinder } from '../../basic_solids/MyCylinder.js';
import { toRadians } from '../../utils.js';

/**
 * MyStem
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {number} nCylinders - Number of cylinders in the stem
 * @param {number} cylinderRadius - Radius of the cylinders
 * @param {CGFappearance} stemColor - Color of the stem
 * @param {CGFappearance} leafColor - Color of the leaves
 */

export class MyStem extends CGFobject {
	constructor(scene, nCylinders, cylinderRadius,
         stemColor, leafColor) {
		super(scene);
        this.cylinderRadius = cylinderRadius;
        this.stemColor = stemColor;
        
        // Initialize the cylinders
        this.cylinders = [];
        for (let i = 0; i < nCylinders; i++){
            this.cylinders.push(new MyCylinder(this.scene, 5, 1));
        }

        // Generate random heights for each cylinder
        this.heights = [];
        for (let i = 0; i < nCylinders; i++){
            // between 1 and 4
            let height=Math.random() * (3.0) + 1.0;
            this.heights.push(height);
        }

        // Generate random curvatures for each cylinder
        this.cylinderCurvatures = [];
        let cylinderCurvature = 0;
        this.cylinderCurvatures.push(cylinderCurvature);

        for (let i=1; i<nCylinders; i++){
            // between -5 and 0
            let cylinderCurvature = this.cylinderCurvatures[i-1] + toRadians(-Math.random()*5);
            this.cylinderCurvatures.push(cylinderCurvature);
        }

        // Calculate the positions of each cylinder to be translated
        this.y_pos = [];
        this.x_pos = [];

        this.y_pos.push(this.heights[0]); 
        this.x_pos.push(0);

        for (let i = 1; i < nCylinders; i++){
            let y = this.y_pos[i-1] + this.heights[i]*(Math.cos(this.cylinderCurvatures[i]));
            this.y_pos.push(y);
            
            // curvature is a negative value (sin is negative) so we multiply by -1
            let x = this.x_pos[i-1] + this.heights[i]*(-Math.sin(this.cylinderCurvatures[i]));
            this.x_pos.push(x);
        }

        // Calculate the total height and width of the stem
        this.total_height = this.y_pos[nCylinders-1] ;
        this.total_width = this.x_pos[nCylinders-1];
        
        // Initialize the leaves
        this.leaves = [];
        this.rotations = [];
        this.leavesCurvatures = [];
        for (let i = 0; i < nCylinders-1; i++){
            // Random rotation between 0 and 360 degrees
            let rotation = toRadians(Math.random()*360);
            this.rotations.push(rotation);

            // Random leaf curvature between 30 and 60 degrees
            let leafCurvature = toRadians(Math.random() * (30) + 30);
            this.leavesCurvatures.push(leafCurvature);

            this.leaves.push(new MyLeaf(this.scene, stemColor, leafColor));
        }
	}

	display() {
        // Display the cylinders
        for (let i=0; i<this.cylinders.length; i++){
            this.scene.pushMatrix();
            
            this.scene.translate(this.x_pos[i], this.y_pos[i], 0);
            this.scene.rotate(this.cylinderCurvatures[i], 0, 0, 1);
            this.scene.translate(this.cylinderRadius, 0, 0);
            this.scene.scale(this.cylinderRadius, this.heights[i], this.cylinderRadius);
            this.scene.rotate(toRadians(90), 1, 0, 0);

            this.stemColor.apply();
            this.cylinders[i].display();

            this.scene.popMatrix();
        }

        // Display the leaves
        for (let i=0; i<this.cylinders.length-1; i++){
            this.scene.pushMatrix();
            this.scene.translate(this.x_pos[i]+this.cylinderRadius, this.y_pos[i], 0);
            this.scene.rotate(this.rotations[i], 0, 1, 0);
            this.scene.rotate(this.leavesCurvatures[i], 1, 0, 0);

            this.leaves[i].display();
            this.scene.popMatrix();
        }
    }
}

