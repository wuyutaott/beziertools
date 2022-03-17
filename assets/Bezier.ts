const {ccclass, executeInEditMode, property} = cc._decorator;

@ccclass
@executeInEditMode
export default class Bezier extends cc.Component {
    @property({ type: cc.Node, tooltip: '起始点追踪器' })
    p1Tracker: cc.Node = null;

    @property({ type: cc.Node, tooltip: '终止点追踪器' })
    p2Tracker: cc.Node = null;

    @property({ tooltip: '是否随机' })
    random = false;

    @property({ tooltip: '运行时显示Bezier曲线' })
    debug = false;

    p1: cc.Node = null;
    c1: cc.Node = null;
    c2: cc.Node = null;
    p2: cc.Node = null;

    g: cc.Graphics = null;
    
    protected onLoad(): void {
        this.g = this.getComponent(cc.Graphics);
        this.p1 = this.node.getChildByName('p1');
        this.c1 = this.node.getChildByName('c1');
        this.c2 = this.node.getChildByName('c2');
        this.p2 = this.node.getChildByName('p2');
        if (!this.debug && !CC_EDITOR) {
            this.node.active = false;
        }
        if (!CC_EDITOR) {
            this.p1.active = false;
            this.c1.active = false;
            this.c2.active = false;
            this.p2.active = false;
            this.draw();
        }
    }

    update() {
        if (!CC_EDITOR) return;
        this.draw();
    }

    draw() {
        if (!this.debug && !CC_EDITOR) return;      
        if (!this.p1 || !this.c1 || !this.c2 || !this.p2) {
            this.g.clear();
            return;
        }
        if (this.p1Tracker) {                        
            let nodePos = this.convertToNodeSpace(this.p1, this.p1Tracker);
            this.p1.setPosition(nodePos);
        }
        if (this.p2Tracker) {                        
            let nodePos = this.convertToNodeSpace(this.p2, this.p2Tracker);
            this.p2.setPosition(nodePos);
        }
        let p1 = this.p1.position;             
        let c1 = this.c1.position;
        let c2 = this.c2.position;
        let p2 = this.p2.position;
        this.g.clear();
        this.g.moveTo(p1.x, p1.y);
        this.g.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p2.x, p2.y);
        this.g.stroke();
    }

    startMove(node: cc.Node, time: number, callback: Function = null, obsv: any = null) {
        if (!node) return;        
        let points = this.getBezierPoints(node);
        node.setPosition(points[0]);
        cc.tween(node)
            .bezierTo(time, points[1], points[2], points[3])
            .call(() => {
                if (callback) 
                    callback.call(obsv, node);
            })
            .start();
    }

    getBezierPoints(node: cc.Node) {        
        let p1 = this.convertToNodeSpace(node, this.p1);
        let c1 = this.convertToNodeSpace(node, this.c1);
        let c2 = this.convertToNodeSpace(node, this.c2);
        let p2 = this.convertToNodeSpace(node, this.p2);
        if (this.random) {
            let mc1 = this.calcMirrorD(p1, p2, c1);
            c1 = this.getRandomP(c1, mc1);
            let mc2 = this.calcMirrorD(p1, p2, c2);
            c2 = this.getRandomP(c2, mc2);
        }
        return [cc.v2(p1.x, p1.y), cc.v2(c1.x, c1.y), cc.v2(c2.x, c2.y), cc.v2(p2.x, p2.y)];
    }

    /**
     * 计算p2在p1坐标系中的坐标     
     */
    convertToNodeSpace(p1: cc.Node, p2: cc.Node): cc.Vec3 {
        return p1.parent.convertToNodeSpaceAR(p2.parent.convertToWorldSpaceAR(p2.position));
    }

    /**
     * 已知AB构成一个向量，求C在向量AB上的镜像点D
     */
    calcMirrorD(A: cc.Vec3, B: cc.Vec3, C: cc.Vec3): cc.Vec3 {
        let AB = B.sub(A);
        let AC = C.sub(A);
        let NAB = AB.normalize();
        let NAC = AC.normalize();
        let cT = NAB.dot(NAC);       
        let tyLen = AC.len() * cT;
        let AE = AB.normalize().mul(tyLen);        
        let E = A.add(AE);        
        let CE = E.sub(C);        
        let CE2 = CE.mul(2);        
        let D = C.add(CE2);        
        return D;
    }

    /**
     * 从AB两个点构成的一条线段中，随机获取一个点
     */
    getRandomP(A: cc.Vec3, B: cc.Vec3) {
        let AB = B.sub(A);
        let RAC = AB.mul(Math.random());
        return A.add(RAC);
    }
}
