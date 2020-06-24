// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Item, { ItemType } from "./item";
import Player from "./player";
import global from "./global";
import Move from "./move";
import Game from "./game";
import { randomInt } from "./utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Catcher extends cc.Component {
  @property({
    type: Game,
  })
  game: Game = null;

  @property({
    type: Player,
  })
  player: Player = null;

  @property({
    type: cc.Node,
  })
  anchor: cc.Node = null;

  @property({
    type: cc.Prefab,
  })
  bombPrefab: cc.Prefab = null;

  static readonly maxAngle = 75;

  static readonly rotationSpeed = 100;

  static readonly maxLength = 800;

  static readonly castSpeed = 480;

  private normalLenght: number;

  private castState: "none" | "down" | "up" | "sell" | "pause" = "none";

  private rotationDirection: "left" | "right" = "left";

  onLoad() {
    this.node.angle = 0;
    this.normalLenght = this.node.height;
    this.registerInputHandler();
  }

  private registerInputHandler = () => {
    this.game.node.on("down", () => {
      if (this.castState === "none") {
        this.castState = "down";
      }
    });
    this.game.node.on("up", () => {
      if (this.castState === "up") {
        this.bombCaughtItem();
      }
    });
  };

  /**
   * 炸毁抓取的物品
   */
  private bombCaughtItem = () => {
    if (!this.caught) return;

    if (this.player.useBomb()) {
      const bomb = cc.instantiate(this.bombPrefab);
      bomb.parent = this.player.node;

      const { x, y } = this.caught.node
        .convertToWorldSpaceAR(cc.v2(0, 0))
        .sub(this.player.node.convertToWorldSpaceAR(cc.v2(0, 0)));

      const lastCastState = this.castState;

      this.castState = "pause";

      cc.tween(bomb)
        .to(0.15, {
          x: x,
          y: y,
        })
        .call(() => {
          this.castState = lastCastState;
          bomb.parent = null;
          this.removeCaught();
        })
        .start();
    }
  };

  private caught: Item;

  public onCollide(node: cc.Node) {
    if (this.caught) return;
    if (this.castState !== "down") return;

    const item: Item = node.getComponent("item");
    const move: Move = node.getComponent("move");

    // 如果是会移动的物品，比如🐖，则停止移动
    move.isMoving && move.stopMove();

    // 碰到炸药桶
    if (item.item.type === ItemType.Explosive) {
      // 将炸药桶变成碎片
      item.init({
        type: ItemType.Debris,
        price: 1,
        weight: 20,
        volume: 20,
      });

      // 引爆炸药桶所在区域
      this.game.explodeArea(node.position);
    }

    node.x = 0;
    node.y = -node.height * 0.25; // 让物品离钩子的位置稍微偏下
    node.parent = this.anchor;

    this.caught = item;
    this.castState = "up";
  }

  private removeCaught = () => {
    this.caught = undefined;
    this.anchor.removeAllChildren();
  };

  private handleSell = async () => {
    const item = this.caught.item;

    if (item.type === ItemType.Secret) {
      const secretItem = this.caught.secretItem;
      if (secretItem.type === "price") {
        await this.player.gainScore(secretItem.value);
      } else if (secretItem.type === "buff") {
        this.player.gainHighStrength();
      } else if (secretItem.type === "bomb") {
        this.player.gainBomb();
      }
    } else {
      if (item.type === ItemType.Explosive) {
        throw new Error(); // never 不可能抓上火药桶
      }
      const isStone = item.type === ItemType.Stone;
      const isDiamond =
        item.type === ItemType.Diamond || item.type === ItemType.DiamondPig;

      // 根据buff情况计算物品实际价格
      const realPrice =
        isStone && global.buff.highStone
          ? item.price * 2
          : isDiamond && global.buff.highDiamond
          ? Math.floor(item.price * 1.4)
          : item.price;

      await this.player.gainScore(realPrice);
    }
    this.removeCaught();
    this.castState = "none";
    this.setRomdonDirection();
  };

  /**
   * 随机设置一个钩子的角度与方向
   */
  private setRomdonDirection = () => {
    if (
      this.rotationDirection === "left" &&
      this.node.angle < Catcher.maxAngle - 40
    ) {
      this.rotationDirection = "right";
    } else if (
      this.rotationDirection === "right" &&
      this.node.angle > -Catcher.maxAngle + 40
    ) {
      this.rotationDirection = "left";
    }

    if (this.rotationDirection === "left") {
      this.node.angle -= randomInt(20, 40);
    } else {
      this.node.angle += randomInt(20, 40);
    }
  };

  private calculateRotationAngle = (dt: number) => {
    // 正左边角度是-90度，正右边是90度
    // 当角度越接近±90度时旋转的越慢
    return (
      Catcher.rotationSpeed *
      dt *
      (1.25 - Math.abs(this.node.angle / Catcher.maxAngle))
    );
  };

  update(dt: number) {
    if (this.castState === "none") {
      if (this.rotationDirection === "left") {
        if (this.node.angle <= -Catcher.maxAngle) {
          this.rotationDirection = "right";
        }
        this.node.angle -= this.calculateRotationAngle(dt);
      } else {
        if (this.node.angle >= Catcher.maxAngle) {
          this.rotationDirection = "left";
        }
        this.node.angle += this.calculateRotationAngle(dt);
      }
    } else if (this.castState === "down") {
      this.node.height += dt * Catcher.castSpeed;
      if (this.node.height - this.normalLenght > Catcher.maxLength) {
        this.node.height = this.normalLenght + Catcher.maxLength;
        this.castState = "up";
      }
    } else if (this.castState === "up") {
      if (this.caught) {
        const item = this.caught.item;

        // 获取物品重量
        const weight =
          item.type === ItemType.Explosive
            ? 20
            : item.type === ItemType.Secret
            ? this.caught.secretItem.weight
            : item.weight;

        // 根据是否有力量buff计算抓取速度
        // highStrength和strength不叠加
        const speed = global.buff.highStrength
          ? Catcher.castSpeed * 2
          : global.buff.strength
          ? Catcher.castSpeed * 1.1
          : Catcher.castSpeed;

        // 拉回物品
        this.node.height -= dt * (speed - weight);
      } else {
        // 如果没抓到东西快速拉回
        this.node.height -= dt * Catcher.castSpeed * 1.6;
      }
      if (this.node.height < this.normalLenght) {
        this.node.height = this.normalLenght;
        if (this.caught) {
          this.castState = "sell";
          this.handleSell();
        } else {
          this.castState = "none";
        }
      }
    }
  }
}
