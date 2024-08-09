import {CGFinterface, dat} from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);
        
        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();

        //Checkbox element in GUI
        this.gui.add(this.scene, 'displayAxis').name('Display Axis');
        //this.gui.add(this.scene, 'displayNormals').name("Display normals");

        //Slider elements in GUI
        this.gui.add(this.scene, 'gardenWidth', 2, 10).step(1).name('Garden Width').onChange(() => this.scene.updateGardens());
        this.gui.add(this.scene, 'gardenLength', 2, 10).step(1).name('Garden Length').onChange(() => this.scene.updateGardens());
        this.gui.add(this.scene, 'speedFactor', 0.1, 3).name('Bee Speed Factor');
        this.gui.add(this.scene, 'scaleFactor', 0.1, 3).name('Bee Scale Factor');
        this.gui.add(this.scene, 'followBee').name('Follow Bee');

        this.initKeys();

        return true;
    }

    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function(){};
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    }

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    }

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}