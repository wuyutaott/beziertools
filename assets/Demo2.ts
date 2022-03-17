import Bezier from "./Bezier";

const {ccclass, executeInEditMode, property} = cc._decorator;

@ccclass
@executeInEditMode
export default class Demo2 extends cc.Component {
    @property(Bezier)
    bezier: Bezier = null;

    @property(cc.Node)
    node1: cc.Node = null;

    position1: cc.Vec3 = null;
    
    protected onLoad(): void {
        this.position1 = this.node1.position;
    }

    onBtnFire() {  
        let pos = this.bezier.getBezierPoints(this.node1);        
        this.node1.setPosition(pos[0]);
        cc.tween(this.node1)
            .bezierTo(1, pos[1], pos[2], pos[3])
            .call(() => {
                this.onBezierAnimFinish();
            })
            .start();
    }

    onBezierAnimFinish() {
        console.log('动画完毕');
        this.node1.setPosition(this.position1);
    }
}
