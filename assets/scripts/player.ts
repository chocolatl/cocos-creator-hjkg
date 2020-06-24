// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "./game";
import global from "./global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
  @property({
    type: Game,
  })
  game: Game = null;

  @property({
    type: cc.Node,
  })
  scoreFX: cc.Node = null;

  @property({
    type: cc.Node,
  })
  strengthFX: cc.Node = null;

  private onScoreAnimationEnd = (score: number) => {
    global.score += score;
    this.scoreFX.active = false;
  };

  gainScore = (score: number) => {
    return new Promise<void>((resolve) => {
      this.scoreFX.active = true;
      const scoreAnimation = this.scoreFX.getComponent(cc.Animation);
      const scoreFXLabel = this.scoreFX.getComponent(cc.Label);
      scoreFXLabel.string = score.toString();
      scoreAnimation.play("score");
      scoreAnimation.once("finished", () => {
        this.onScoreAnimationEnd(score);
        resolve();
      });
    });
  };

  gainHighStrength = () => {
    this.strengthFX.active = true;
    const animation = this.strengthFX.getComponent(cc.Animation);
    animation.play("strength");
    animation.once("finished", () => {
      this.strengthFX.active = false;
    });
    global.buff.highStrength = true;
  };

  useBomb = () => {
    return this.game.useBomb();
  };

  gainBomb = () => {
    return this.game.gainBomb();
  };

  start() {}

  // update (dt) {}
}
