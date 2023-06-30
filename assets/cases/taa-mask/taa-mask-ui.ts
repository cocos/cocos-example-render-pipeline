import { _decorator, Camera, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('taa_mask_ui')
export class taa_mask_ui extends Component {
    @property(Label)
    label: Label | undefined;

    @property(Camera)
    taaMaskCamera: Camera | undefined;

    start() {

    }

    update(deltaTime: number) {
        
    }

    onClick () {
        this.taaMaskCamera.node.active = !this.taaMaskCamera.node.active;
        this.label.string = 'TAA Mask ' + (this.taaMaskCamera.node.active ? 'Enabled' : 'Disabled')
    }
}


