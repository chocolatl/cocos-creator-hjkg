// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass } = cc._decorator;

@ccclass
export default class Move extends cc.Component {
  // LIFE-CYCLE CALLBACKS:

  onLoad() {}

  isMoving = false;

  private tween: any;

  startMove(direction: "left" | "right") {
    this.isMoving = true;
    this.tween = cc
      .tween(this.node)
      .repeatForever(
        cc
          .tween()
          .by(5, {
            x: direction === "left" ? -500 : 500,
          })
          .delay(1.5)
          .by(5, {
            x: direction === "left" ? 500 : -500,
          })
          .delay(0.5 + Math.random() * 2)
      )
      .start();
  }

  stopMove() {
    this.isMoving = false;
    this.tween.stop();
  }

  start() {}

  // update (dt) {}
}
