import {CGFobject} from '../lib/CGF.js';
/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
            // Face da frente
            0.5, 0.5, 0.5,      // 0 - front top right
            -0.5, 0.5, 0.5,     // 1 - front top left
            0.5, -0.5, 0.5,     // 2 - front bottom right
            -0.5, -0.5, 0.5,    // 3 - front bottom left
            
            // Face de trás
            -0.5, 0.5, -0.5,    // 4 - back top left
            0.5, 0.5, -0.5,     // 5 - back top right
            -0.5, -0.5, -0.5,   // 6 - back bottom left
            0.5, -0.5, -0.5,    // 7 - back bottom right

            // Face de esquerda
            -0.5, 0.5, 0.5,     // 8 - front top left
            -0.5, 0.5, -0.5,    // 9 - back top left
            -0.5, -0.5, 0.5,    // 10 - front bottom left
            -0.5, -0.5, -0.5,   // 11 - back bottom left
            
            // Face da direita
            0.5, -0.5, 0.5,     // 12 - front bottom right
            0.5, -0.5, -0.5,    // 13 - back bottom right
            0.5, 0.5, -0.5,     // 14 - back top right
            0.5, 0.5, 0.5,      // 15 - front top right
            // Face de cima
            -0.5, 0.5, 0.5,     // 16 - front top left
            0.5, 0.5, 0.5,      // 17 - front top right
            0.5, 0.5, -0.5,     // 18 - back top right
            -0.5, 0.5, -0.5,    // 19 - back top left
            
            // Face de baixo
            -0.5, -0.5, -0.5,   // 20 - back bottom left
            0.5, -0.5, -0.5,    // 21 - back bottom right
            0.5, -0.5, 0.5,     // 22 - front bottom right
            -0.5, -0.5, 0.5,    // 23 - front bottom left
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			// front
            1, 3, 0,
            0, 3, 2,

            // back
            4, 5, 6, //clockwise
            5, 7, 6,

            // left
            11, 8, 9,
            8, 11, 10,

            // right
            12, 13, 14,
            12, 14, 15,
            
            // top
            16, 17, 18,
            16, 18, 19,
            
            // bottom
            20, 21, 22,
            20, 22, 23
		];
        
        this.normals = [
            // front
            0, 0, 1,     
            0, 0, 1,    
            0, 0, 1,    
            0, 0, 1,    
            
            // back
            0, 0, -1,   
            0, 0, -1, 
            0, 0, -1,   
            0, 0, -1,   
            
            // left
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            
            // right
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            
            // top
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            
            // bottom
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0
        ]

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

