import {CGFobject} from '../../lib/CGF.js';
import { MyBentTube } from '../basic_solids/MyBentTube.js';
import { MyCone } from '../basic_solids/MyCone.js';
import { MySphere } from '../basic_solids/MySphere.js';
import { compareFloats, getDist, getVec2Mag, getXZVector, normalizeVec3, toRadians } from '../utils.js';

/**
 * MyBee
 * @constructor
 * @param {Number} x x coordinate of bee's start position
 * @param {Number} y y coordinate of bee's start position
 * @param {Number} z z coordinate of bee's start position
 * @param {Number} y_anim_scale Scale of the constant vertical bee animation
 * @param {Number} wing_freq Frequency of the bee's wings
 * @param sceneGardens Reference to the gardens that exist in the scene
 */

export class MyBee extends CGFobject {
	constructor(scene, x0=0, y0=0, z0=0, y_anim_scale=1, wing_freq=1, sceneGardens) {
		super(scene);
        this.head = new MySphere(scene, 10, 5, false);
        this.thorax = new MySphere(scene, 10, 5, false);
        this.abdomen = new MySphere(scene, 10, 5, false);
        this.eye = new MySphere(scene, 10, 5, false);
        this.sting = new MyCone(scene, 10, 5);
        this.horn = new MyBentTube(scene, 20);
        this.wing = new MySphere(scene, 10, 5);
        this.leg = new MyBentTube(scene, 70);

        this.x0 = x0;
        this.y0 = y0;
        this.z0 = z0;
        this.x = x0;
        this.y = y0;
        this.z = z0;

        // Y coordinate to be displayed, the this.y coordinate doesn't take the vertical animation into account
        this.yDisplay = y0;

        // Angle that the front of the bee makes with the negative x axis
        this.orientation = 0;
        this.vel = [0, 0, 0]

        // Upward velocity when fetching pollen or leaving the flower/floor
        this.upwardVel = 1.0;
        this.y_anim_scale = y_anim_scale;
        this.wing_freq = wing_freq;
        this.wing_amp = 20;
        this.wing_init_angle = 30;
        this.wing_angle = toRadians(30);
        this.t0 = Date.now();
        this.lastUpdate = Date.now();
        
        this.STATES = Object.freeze({
            NORMAL: Symbol("normal"),           // Regular state of the bee where it flies freely
            POLLEN: Symbol("pollen"),           // State where bee fetches for pollen in the flowers
            RETURN: Symbol("return"),           // State where bee lifts from a flower with pollen or from the floor
            HIVE_EASY: Symbol("hive_easy"),     // State where there is a clear path to one of the hive's entrance
            HIVE_HARD: Symbol("hive_hard")      // State where there isn't a clear path to one of the hive's entrance (to avoid collision with the hive)
        });

        this.bee_state = this.STATES.NORMAL;
        this.sceneGardens = sceneGardens;
        this.flowersRefs = this.getFlowersRefs();
        this.pollen = null;
        this.hive_access = this.scene.hive.getBeeAccessPoints();
        this.hive_normals = this.scene.hive.getAccessNormals();

        this.target_point = null;
        this.target_orientation = null;
        this.delta_angle = 0;
        this.delta_dists = [];
	}

    /**
     * @returns The references of all the flowers in the scene
     */
    getFlowersRefs() {
        const flowers = []

        this.sceneGardens.forEach(garden => {
            flowers.push(...garden.getFlowers());
        })

        return flowers;
    }

    /**
     * Turns the bee given an increment of an angle, maintaining its velocity
     * @param {Number} angInc Angle increment
     */
    turn(angInc) {
        // The bee leaves the automatic path to the hive when it turns
        if (this.bee_state == this.STATES.HIVE_EASY || this.bee_state == this.STATES.HIVE_HARD)
            this.bee_state = this.STATES.NORMAL;

        this.orientation = (this.orientation + angInc) % (2*Math.PI)
 
        const xzMag = Math.sqrt(Math.pow(this.vel[0], 2) + Math.pow(this.vel[2], 2));

        this.vel = [-xzMag * Math.cos(this.orientation), this.vel[1], xzMag * Math.sin(this.orientation)];
    }

    /**
     * Increments the velocity of the bee in the x0z plane, maintaining the bee's movement direction
     * @param {Number} velInc Velocity increment  
     */
    accelerate(velInc) {
        // The bee leaves the automatic path to the hive when it accelerates
        if (this.bee_state == this.STATES.HIVE_EASY || this.bee_state == this.STATES.HIVE_HARD)
            this.bee_state = this.STATES.NORMAL;

        const currVelMag = getVec2Mag([this.vel[0], this.vel[2]]);

        // Current magnitude of the velocity vector is always non-negative
        if (currVelMag + velInc < 0)
            velInc = -currVelMag;
            

        if (velInc != 0) {
            const newMag = currVelMag + velInc;
            
            if (currVelMag != 0) {
                this.vel = [this.vel[0] * newMag / currVelMag, this.vel[1], this.vel[2] * newMag / currVelMag];
            }
            else
                this.vel = [-newMag * Math.cos(this.orientation), this.vel[1], newMag * Math.sin(this.orientation)]
        }
    }

    /**
     * Resets all the bee's attributes such as its position, state, velocity and orientation
     */
    reset() {
        this.bee_state = this.STATES.NORMAL;
        this.x = this.x0;
        this.y = this.y0;
        this.z = this.z0;
        this.vel = [0, 0, 0];
        this.orientation = 0;
        this.pollen = null;
        this.t0 = Date.now();
        this.lastUpdate = Date.now();
    }

    /**
     * Initializes the vertical velocity of the bee to begin fetching for pollen
     */
    fetchPollen() {
        this.vel[1] = -this.upwardVel;
        this.bee_state = this.STATES.POLLEN
        this.y = this.yDisplay;
    }

    /**
     * Checks if the bee is on top of a flower in the scene
     * @returns True if the bee is on top of a flower, false otherwise
     */
    checkFlower() {
        for (let i = 0; i < this.flowersRefs.length; i++) {
            const currFlower = this.flowersRefs[i];
            const inside_x_area = compareFloats(this.x, currFlower.x, currFlower.receptacleRadius);
            const inside_y_area = compareFloats(this.y - 0.3, currFlower.y, 0.3 * this.scene.scaleFactor)
            const inside_z_area = compareFloats(this.z, currFlower.z, currFlower.receptacleRadius);
            
            if (inside_x_area && inside_y_area && inside_z_area)
                return currFlower;
        }

        return null;
    }

    /**
     * Initializes the vertical velocity of the bee to begin lifting from the flower or the floor.
     * Also picks up the pollen of a flower if the bee is on top of it and isn't carrying pollen already
     */
    returnUp() {
        const reachableFlower = this.checkFlower();
        
        if (reachableFlower != null && this.pollen == null) {
            this.pollen = reachableFlower.flowerRef.pollen;
            reachableFlower.flowerRef.removePollen();
        }
        
        this.vel[1] = this.upwardVel;
        this.bee_state = this.STATES.RETURN;
        this.y = this.yDisplay;
    }

    /**
     * Initializes the target position and orientation of the bee so that it travels to the nearest entrance of the
     * bee hive without colliding with it
     */
    goToHive() {
        if (this.bee_state == this.STATES.HIVE_EASY || this.bee_state == this.STATES.HIVE_HARD) return;

        this.vel[0] = 0;
        this.vel[1] = 0;
        this.vel[2] = 0;
        
        if (this.orientation < 0 )
            this.orientation += 2*Math.PI;

        if (this.scene.hive.inFrontOfFront([this.x, this.y, this.z])) {
            this.target_point = this.hive_access[0];
            this.target_orientation = this.getTargetOrientation(this.target_point);
            this.bee_state = this.STATES.HIVE_EASY;
        } else if (this.scene.hive.inFrontOfBack([this.x, this.y, this.z])) {
            this.target_point = this.hive_access[1];
            this.target_orientation = this.getTargetOrientation(this.target_point);
            this.bee_state = this.STATES.HIVE_EASY;
        } else {
            this.bee_state = this.STATES.HIVE_HARD;

            let normal;
            if (getDist([this.x, this.y, this.z], this.hive_access[0]) <= getDist([this.x, this.y, this.z], this.hive_access[1])) {
                normal = this.hive_normals[0];
            } else {
                normal = this.hive_normals[1];
            }

            this.target_point = [this.x+normal[0]*0.75*this.scene.hive_scale, this.y+normal[1]*0.75*this.scene.hive_scale, this.z+normal[2]*0.75*this.scene.hive_scale]
            this.target_orientation = this.getTargetOrientation(this.target_point);
        }

        if (this.target_orientation < this.orientation) {
            this.delta_angle = -0.05
        } else {
            this.delta_angle = 0.05
        }

        this.delta_dists = this.getDeltaDists(this.target_point);

        this.y = this.yDisplay;
    }

    /**
     * @param {Array} vec vector with two values 
     * @returns The angle that the vector makes with the negative x axis
     */
    getVec2BeeOrientation(vec) {
        if (vec[1] >= 0) {
            return Math.atan(vec[0]/vec[1]) + Math.PI/2;
        } else {
            return Math.atan(vec[0]/vec[1]) + 3*Math.PI/2;
        }
    }

    /**
     * @param {Array} target_point Vector with the position of the bee's target
     * @returns The orientation the bee has to have to reach the target position
     */
    getTargetOrientation(target_point) {
        const orientation_vector = getXZVector([this.x, this.z], [target_point[0], target_point[2]]);

        return this.getVec2BeeOrientation(orientation_vector);
    }

    /**
     * @param {Array} target_point Vector with the position of the bee's target
     * @returns The velocity of the bee to reach the target position
     */
    getDeltaDists(target_point) {
        const hive_vel = 3.0;

        const direction_vec = normalizeVec3([target_point[0] - this.x, target_point[1] - this.y, target_point[2] - this.z]);

        return [direction_vec[0] * hive_vel, direction_vec[1] * hive_vel, direction_vec[2] * hive_vel];
    }

    update(t) {
        const vertical_oscilation = this.y_anim_scale * Math.sin(2 * Math.PI * (t - this.t0) / 1000);
        
        this.x = this.x + this.vel[0] * (t - this.lastUpdate) / 1000
        this.y = this.bee_state != this.STATES.NORMAL ? this.y + this.vel[1] * (t - this.lastUpdate) / 1000 : this.y
        this.yDisplay = this.bee_state != this.STATES.NORMAL ? this.y : this.y + vertical_oscilation;
        this.z = this.z + this.vel[2] * (t - this.lastUpdate) / 1000

        this.wing_angle = toRadians(this.wing_amp * Math.sin(2 * Math.PI * this.wing_freq * (t - this.t0) / 1000) + this.wing_init_angle)
        
        if (this.bee_state == this.STATES.POLLEN) {
            const reachableFlower = this.checkFlower();

            if (reachableFlower != null) {
                this.vel[0] = 0
                this.vel[1] = 0
                this.vel[2] = 0

                this.bee_state = this.STATES.NORMAL
                this.t0 = Date.now()
            }
            
            if (this.y <= 0.5 * this.scene.scaleFactor) {
                this.vel[0] = 0
                this.vel[1] = 0
                this.vel[2] = 0
                this.bee_state = this.STATES.NORMAL
                this.t0 = Date.now()
            }
        }

        if (this.bee_state == this.STATES.RETURN) {
            if (this.y >= this.y0) {
                this.vel[1] = 0;
                this.y = this.y0;
                this.bee_state = this.STATES.NORMAL;
                this.t0 = Date.now()
            }
        }

        if (this.bee_state == this.STATES.HIVE_EASY || this.bee_state == this.STATES.HIVE_HARD) {
            if (!compareFloats(this.orientation, this.target_orientation, 5.0 * Math.PI / 180.0)) {

                this.orientation += this.delta_angle;
            } else if (!compareFloats(getDist([this.x, this.y, this.z], this.target_point), 0.0, this.scene.scaleFactor)) {
                this.x += this.delta_dists[0] * (t - this.lastUpdate) / 1000;
                this.y += this.delta_dists[1] * (t - this.lastUpdate) / 1000;
                this.z += this.delta_dists[2] * (t - this.lastUpdate) / 1000;
            } else {
                if (this.bee_state == this.STATES.HIVE_EASY) {
                    if (this.pollen != null)
                        this.scene.hive.addPollen(this.pollen)
                    this.pollen = null;
                    this.bee_state = this.STATES.NORMAL;
                } else {
                    this.bee_state = this.STATES.NORMAL
                    this.goToHive();
                }
            }
        }

        this.lastUpdate = t;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.x, this.yDisplay, this.z);
        this.scene.scale(this.scene.scaleFactor, this.scene.scaleFactor, this.scene.scaleFactor);
        this.scene.rotate(this.orientation, 0, 1, 0);
        this.drawModel();
        this.scene.popMatrix();
    }

    drawModel() {
        this.scene.bee_head_material.apply();
        
        // Display head
        this.scene.pushMatrix();
        this.scene.translate(-0.3, -0.03333, 0.0);
        this.scene.rotate(toRadians(-10), 0, 0, 1)
        this.scene.scale(0.13333333, 0.23333333, 0.166667);
        this.scene.rotate(Math.PI / 2, 0, 0, 1)
        this.head.display();
        this.scene.popMatrix();

        // Display thorax
        this.scene.bee_body_material.apply();
        this.scene.pushMatrix();
        this.scene.scale(0.216666667, 0.166666667, 0.183333333);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.thorax.display();
        this.scene.popMatrix();

        // Display abdomen
        this.scene.pushMatrix();
        this.scene.translate(0.45, -0.15, 0);
        this.scene.rotate(toRadians(-25), 0, 0, 1);
        this.scene.scale(0.366666667, 0.2, 0.233333333);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.abdomen.display();
        this.scene.popMatrix();
        
        this.scene.black_material.apply();

        // Display left eye
        this.scene.pushMatrix();
        this.scene.translate(-0.35, 0.0, 0.116666667);
        this.scene.rotate(toRadians(-10), 0, 0, 1);
        this.scene.scale(0.083333333, 0.133333333, 0.066666667)
        this.eye.display();
        this.scene.popMatrix();
        
        // Display right eye
        this.scene.pushMatrix();
        this.scene.translate(-0.35, 0.0, -0.116666667);
        this.scene.rotate(toRadians(-10), 0, 0, 1);
        this.scene.scale(0.083333333, 0.133333333, 0.066666667)
        this.eye.display();
        this.scene.popMatrix();

        // Display sting
        this.scene.pushMatrix();
        this.scene.translate(0.75, -0.293333333, 0);
        this.scene.rotate(toRadians(-115), 0, 0, 1);
        this.scene.scale(0.083333333, 0.116666667, 0.083333333);
        this.sting.display();
        this.scene.popMatrix();

        // Display left horn
        this.scene.pushMatrix();
        this.scene.translate(-0.333333333, 0.1, -0.033333333);
        this.scene.rotate(toRadians(-30), 0, 1, 0)
        this.scene.rotate(toRadians(30), 0, 0, 1)
        this.scene.rotate(toRadians(-90), 1, 0, 0);
        this.scene.scale(0.183333333, 0.183333333, 0.183333333);
        this.horn.display();
        this.scene.popMatrix();

        // Display right horn
        this.scene.pushMatrix();
        this.scene.translate(-0.333333333, 0.1, 0.033333333);
        this.scene.rotate(toRadians(30), 0, 1, 0)
        this.scene.rotate(toRadians(30), 0, 0, 1)
        this.scene.rotate(toRadians(-90), 1, 0, 0);
        this.scene.scale(0.183333333, 0.183333333, 0.183333333);
        this.horn.display();
        this.scene.popMatrix();

        // Display legs
        this.scene.pushMatrix();
        this.scene.translate(-0.066666667, 0, 0.133333333);
        this.scene.rotate(toRadians(-30), 0, 0, 1);
        this.scene.rotate(toRadians(180), 0, 1, 0);
        this.scene.rotate(toRadians(90), 1, 0, 0);
        this.scene.scale(0.333333, 0.333333, 0.333333)
        this.leg.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.066666667, 0, -0.133333333);
        this.scene.rotate(toRadians(-30), 0, 0, 1);
        this.scene.rotate(toRadians(180), 0, 1, 0);
        this.scene.rotate(toRadians(90), 1, 0, 0);
        this.scene.scale(0.333333, 0.333333, 0.333333)
        this.leg.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.066666667, 0, 0.133333333);
        this.scene.rotate(toRadians(-30), 0, 0, 1);
        this.scene.rotate(toRadians(180), 0, 1, 0);
        this.scene.rotate(toRadians(90), 1, 0, 0);
        this.scene.scale(0.333333, 0.333333, 0.333333)
        this.leg.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.066666667, 0, -0.133333333);
        this.scene.rotate(toRadians(-30), 0, 0, 1);
        this.scene.rotate(toRadians(180), 0, 1, 0);
        this.scene.rotate(toRadians(90), 1, 0, 0);
        this.scene.scale(0.333333, 0.333333, 0.333333)
        this.leg.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.2, 0, 0.083333333);
        this.scene.rotate(toRadians(-30), 0, 0, 1);
        this.scene.rotate(toRadians(180), 0, 1, 0);
        this.scene.rotate(toRadians(90), 1, 0, 0);
        this.scene.scale(0.333333, 0.333333, 0.333333)
        this.leg.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.2, 0, -0.083333333);
        this.scene.rotate(toRadians(-30), 0, 0, 1);
        this.scene.rotate(toRadians(180), 0, 1, 0);
        this.scene.rotate(toRadians(90), 1, 0, 0);
        this.scene.scale(0.333333, 0.333333, 0.333333)
        this.leg.display();
        this.scene.popMatrix();

        // Display pollen
        if (this.pollen != null) {
            this.scene.pushMatrix();
            this.scene.translate(-0.083333333, -0.266666667, 0.133333333);
            this.scene.rotate(toRadians(30), 0, 0, 1);
            this.scene.rotate(toRadians(180), 0, 1, 0);
            this.scene.scale(0.05, 0.05, 0.05);
            this.pollen.display();
            this.scene.popMatrix();
        }

        this.scene.wing_material.apply();
        
        // Display left wing
        this.scene.pushMatrix();
        this.scene.rotate(toRadians(20), 0, 1, 0);
        this.scene.translate(0, 0.1, 0.133333333)
        this.scene.rotate(-this.wing_angle, 1, 0, 0);
        this.scene.translate(0, 0, 0.066666667);
        this.scene.scale(0.083333333, 0.000333333, 0.233333333);
        this.wing.display();
        this.scene.popMatrix();
        
        // Display right wing
        this.scene.pushMatrix();
        this.scene.rotate(toRadians(-20), 0, 1, 0);
        this.scene.translate(0, 0.1, -0.133333333)
        this.scene.rotate(this.wing_angle, 1, 0, 0);
        this.scene.translate(0, 0, -0.066666667);
        this.scene.scale(0.083333333, 0.000333333, 0.233333333);
        this.wing.display();
        this.scene.popMatrix();
    }
}
