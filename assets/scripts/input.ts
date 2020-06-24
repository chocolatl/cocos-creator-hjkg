// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass } = cc._decorator;

@ccclass
export default class Inuut extends cc.Component {
  private lastTouch = 0;

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.handleKeyDown);
    if (cc.sys.isMobile) {
      const canvas = cc.director.getScene().getChildByName("Canvas");
      canvas.on(cc.Node.EventType.TOUCH_START, this.handleTouch);
    }
  }

  onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.handleKeyDown);
  }

  private handleTouch = () => {
    const now = Date.now();
    if (now - this.lastTouch < 500) {
      this.lastTouch = 0;
      this.node.emit("up");
    } else {
      this.lastTouch = now;
      this.node.emit("down");
    }
  };

  private handleKeyDown = (event) => {
    if (event.keyCode === cc.macro.KEY.down) {
      this.node.emit("down");
    }
    if (event.keyCode === cc.macro.KEY.up) {
      this.node.emit("up");
    }
  };
}
