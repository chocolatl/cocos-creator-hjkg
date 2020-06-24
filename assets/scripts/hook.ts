// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class PichuaiziCatcher extends cc.Component {
  @property({
    type: cc.Node,
  })
  catcher: cc.Node = null;

  onCollisionEnter(other: cc.Component) {
    this.catcher.getComponent("catcher").onCollide(other.node);
  }
}
