import Bezier from "./Bezier";

const {ccclass, executeInEditMode, property} = cc._decorator;

@ccclass
@executeInEditMode
export default class Demo3 extends cc.Component {
    @property(Bezier)
    bezier: Bezier = null;

    @property(cc.Node)
    node1: cc.Node = null;

    position1: cc.Vec3 = null;
    isFire = false;
    delta = 0;
    
    protected onLoad(): void {
        this.position1 = this.node1.position;
    }

    onBtnFire() {  
        this.isFire = !this.isFire;
    }

    emit() {
        for (let i = 0; i < 10; i++) {
            let newNode = cc.instantiate(this.node1);
            newNode.parent = this.node;
            this.bezier.startMove(newNode, 1, this.onBezierAnimFinish, this);        
        }
    }

    update(dt) {
        if (this.isFire) {
            this.delta -= dt;
            if (this.delta <= 0) {
                this.delta = 0.03;
                this.emit();
            }
        }
    }

    onBezierAnimFinish(node: cc.Node) {
        node.removeFromParent();
    }
}
