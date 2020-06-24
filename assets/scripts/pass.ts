// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import global from "./global";
import { levelsConfig } from "./config";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Pass extends cc.Component {
  @property(cc.Label)
  messageLabel: cc.Label = null;

  @property(cc.Node)
  continueButton: cc.Node = null;

  @property(cc.Label)
  continueLabel: cc.Label = null;

  onLoad() {
    const targetScore = levelsConfig[global.level - 1].targetScore;
    if (global.level === levelsConfig.length) {
      this.messageLabel.string = "恭喜你通过所有关卡";
      this.continueLabel.string = "重新开始";
      global.reset();
      this.continueButton.once("click", () => {
        cc.director.loadScene("main");
      });
    } else if (global.score < targetScore) {
      this.messageLabel.string = "你没有达到目标分数";
      this.continueLabel.string = "重新开始";
      global.reset();
      this.continueButton.once("click", () => {
        cc.director.loadScene("main");
      });
    } else {
      this.messageLabel.string = "恭喜你成功通关";
      this.continueLabel.string = "继续";
      global.nextLevel();
      this.continueButton.once("click", () => {
        cc.director.loadScene("shop");
      });
    }
  }
}
