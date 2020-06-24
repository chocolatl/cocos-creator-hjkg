// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import global from "./global";
import { levelsConfig } from "./config";
import Item, { ItemType, SecretItem } from "./item";
import { randomInt } from "./utils";
import Catcher from "./catcher";
import Move from "./move";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
  @property({
    type: cc.Label,
  })
  countdownLabel: cc.Label = null;

  @property({
    type: cc.Label,
  })
  scoreLabel: cc.Label = null;

  @property({
    type: cc.Label,
  })
  levelLabel: cc.Label = null;

  @property({
    type: cc.Label,
  })
  targetScoreLabel: cc.Label = null;

  @property({
    type: cc.Node,
  })
  bombDisplay: cc.Node = null;

  @property({
    type: cc.Prefab,
  })
  bombPrefab: cc.Prefab = null;

  @property({
    type: cc.Prefab,
  })
  itemPrefab: cc.Prefab = null;

  @property({
    type: cc.Node,
  })
  ground: cc.Node = null;

  @property({
    type: cc.Node,
  })
  explosionFX: cc.Node = null;

  private remaining = 60;

  renderScore = () => {
    this.scoreLabel.string = `金钱：${global.score}`;
  };

  renderLevel = () => {
    this.levelLabel.string = `第 ${global.level} 关`;
  };

  renderTargetScore = () => {
    this.targetScoreLabel.string = `目标钱数：${
      levelsConfig[global.level - 1].targetScore
    }`;
  };

  renderBombNumber = () => {
    this.bombDisplay.removeAllChildren();
    for (let i = 0; i < global.bombNumber; i++) {
      const node = cc.instantiate(this.bombPrefab);
      this.bombDisplay.addChild(node);
    }
  };

  renderCountdown = () => {
    this.countdownLabel.string = `时间：${this.remaining}`;
  };

  /**
   * 随机生成宝箱的属性
   */
  randomSecret = (): SecretItem => {
    const randomWeight = randomInt(
      ~~(Catcher.castSpeed / 4),
      ~~(Catcher.castSpeed / 1.2)
    );

    const randomNumber = Math.random();
    if (randomNumber < 0.2) {
      return {
        type: "bomb",
        weight: randomWeight,
      };
    }

    if (global.buff.luck) {
      return randomNumber < 0.5
        ? {
            type: "buff",
            weight: randomWeight,
          }
        : {
            type: "price",
            weight: randomWeight,
            value: randomInt(400, 800),
          };
    } else {
      return randomNumber < 0.4
        ? {
            type: "buff",
            weight: randomWeight,
          }
        : {
            type: "price",
            weight: randomWeight,
            value: randomInt(50, 800),
          };
    }
  };

  /**
   * 部署该关卡的物品
   */
  generateItems = () => {
    for (const i of levelsConfig[global.level - 1].levelItems) {
      const node = cc.instantiate(this.itemPrefab);
      const item: Item = node.getComponent("item");
      const move: Move = node.getComponent("move");

      item.init(i);

      // 宝箱
      if (i.type === ItemType.Secret) {
        item.initSecret(this.randomSecret());
      }

      // 会移动的物品
      if (i.moveDirection) {
        move.startMove(i.moveDirection);
      }

      item.node.x = i.x;
      item.node.y = i.y;
      item.node.parent = this.ground;
    }
  };

  /**
   * 引爆一块区域，使该区域内的物品消失
   * 如果该区域中有火药桶，会被连锁引爆
   * @param position 需要引爆的位置，坐标系为Ground节点的坐标系
   */
  explodeArea = (position: cc.Vec3) => {
    const wpos = this.ground.convertToWorldSpaceAR(position);
    this.playExplosionAnim(wpos);

    // 获取爆炸点附近的节点
    const inScopeNode = this.ground.children.filter(
      (e) => cc.Vec3.distance(position, e.position) < 220
    );

    // 获取爆炸点附近的火药桶位置
    const otherExplosive = inScopeNode
      .filter((e) => e.getComponent(Item).item.type === ItemType.Explosive)
      .map((e) => e.position.clone());

    // 移除节点，包括其它火药桶
    inScopeNode.forEach((e) => (e.parent = null));

    // 引爆其它火药桶所在区域
    this.scheduleOnce(() => {
      otherExplosive.forEach((e) => this.explodeArea(e));
    }, 0.1);
  };

  playExplosionAnim = (wpos: cc.Vec3) => {
    const node = cc.instantiate(this.explosionFX);
    node.setPosition(wpos);
    cc.director.getScene().addChild(node);
    node.active = true;
    const animation = node.getComponent(cc.Animation);
    animation.play("explosion");
    animation.once("finished", () => {
      node.parent = null;
    });
  };

  onLoad() {
    const manager = cc.director.getCollisionManager();
    manager.enabled = true;
    if (CC_DEBUG) {
      manager.enabledDebugDraw = true;
      manager.enabledDrawBoundingBox = true;
    }

    global.on("changeScore", this.renderScore);

    this.generateItems();
    this.remaining = 60;
    this.renderScore();
    this.renderLevel();
    this.renderTargetScore();
    this.renderBombNumber();
    this.renderCountdown();
    this.startCountdown();
  }

  onDestroy() {
    global.off("changeScore", this.renderScore);
  }

  /**
   * 增加一个炸弹
   */
  gainBomb = () => {
    global.bombNumber++;
    this.renderBombNumber();
  };

  /**
   * 使用炸弹，使用成功返回true，没有炸弹返回false
   */
  useBomb = () => {
    if (global.bombNumber === 0) {
      return false;
    } else {
      global.bombNumber--;
      this.renderBombNumber();
      return true;
    }
  };

  /**
   * 倒计时结束
   */
  onTimeOut = () => {
    cc.director.loadScene("pass");
  };

  /**
   * 开始倒计时
   */
  startCountdown = () => {
    this.schedule(
      () => {
        --this.remaining;
        this.renderCountdown();
        if (this.remaining > 0) return;
        this.onTimeOut();
      },
      1,
      this.remaining - 1
    );
  };
}
