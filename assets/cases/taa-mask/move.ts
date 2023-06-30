import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('move')
export class move extends Component {
    @property
    duration = 1

    @property
    distance = 10

    start () {
        let pos = this.node.position;
        tween(this.node)
            .to(this.duration/2, { position: new Vec3(pos.x + this.distance, pos.y, pos.z)})
            .to(this.duration/2, { position: new Vec3(pos.x - this.distance, pos.y, pos.z)})
            .union()
            .repeatForever()
            .start()
    }
}


