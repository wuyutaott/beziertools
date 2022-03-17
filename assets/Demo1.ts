import Bezier from "./Bezier";

const {ccclass, executeInEditMode, property} = cc._decorator;

@ccclass
@executeInEditMode
export default class Demo1 extends cc.Component {
    @property(Bezier)
    bezier: Bezier = null;

    @property(cc.Node)
    node1: cc.Node = null;
    
    protected onLoad(): void {
        
    }

    onBtnFire() {        
        this.bezier.startMove(this.node1, 1, this.onBezierAnimFinish, this);
    }

    onBezierAnimFinish() {
        console.log('动画完毕');
    }
}
