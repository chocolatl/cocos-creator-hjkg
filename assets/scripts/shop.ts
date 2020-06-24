// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ShopItem, { ShopItems } from "./shopItem";
import global from "./global";
import { randomInt } from "./utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property({
    type: cc.Prefab,
  })
  ShopItemPrefab: cc.Prefab = null;

  @property({
    type: cc.Label,
  })
  descriptionLabel: cc.Label = null;

  @property({
    type: cc.Node,
  })
  bombAnchor: cc.Node = null;

  @property({
    type: cc.Node,
  })
  strengthAnchor: cc.Node = null;

  @property({
    type: cc.Node,
  })
  luckAnchor: cc.Node = null;

  @property({
    type: cc.Node,
  })
  highStoneAnchor: cc.Node = null;

  @property({
    type: cc.Node,
  })
  highDiamondAnchor: cc.Node = null;

  /**
   * 设置对应槽位商品
   */
  setShopItem(type: ShopItems, anchor: cc.Node, price: number) {
    const node = cc.instantiate(this.ShopItemPrefab);
    const item = node.getComponent(ShopItem);
    item.init(type, price);
    node.parent = anchor;

    node.on(cc.Node.EventType.MOUSE_ENTER, () => {
      node.opacity = 220;
      this.descriptionLabel.string = item.description;
    });

    node.on(cc.Node.EventType.MOUSE_LEAVE, () => {
      node.opacity = 255;
      this.descriptionLabel.string = "";
    });

    node.on(cc.Node.EventType.TOUCH_START, () => {
      if (this.buyShopItem(item)) {
        node.parent = null;
      } else {
        this.descriptionLabel.string = "买不起";
      }
    });
  }

  /**
   * 购买商品，购买成功返回true，余额不足返回false
   * @param item
   */
  buyShopItem = (item: ShopItem) => {
    // 余额不足
    if (global.score < item.price) return false;

    // 扣除相应金额
    global.score -= item.price;

    // 根据购买的商品添加炸弹或BUFF
    if (item.type === ShopItems.Bomb) {
      global.bombNumber++;
    } else if (item.type === ShopItems.Strength) {
      global.buff.strength = true;
    } else if (item.type === ShopItems.Luck) {
      global.buff.luck = true;
    } else if (item.type === ShopItems.HighStone) {
      global.buff.highStone = true;
    } else if (item.type === ShopItems.HighDiamond) {
      global.buff.highDiamond = true;
    } else {
      throw new Error("Unknown type");
    }

    return true;
  };

  /**
   * 随机生成商品，每个商品都有一定概率出现，并且具有一定范围内的随机价格
   */
  randomShopItem = () => {
    if (randomInt(0, 100) > 50) {
      this.setShopItem(ShopItems.Bomb, this.bombAnchor, randomInt(1, 400));
    }

    if (randomInt(0, 100) > 50) {
      this.setShopItem(
        ShopItems.Strength,
        this.strengthAnchor,
        randomInt(50, 400)
      );
    }

    if (randomInt(0, 100) > 50) {
      this.setShopItem(ShopItems.Luck, this.luckAnchor, randomInt(1, 100));
    }

    if (randomInt(0, 100) > 50) {
      this.setShopItem(
        ShopItems.HighStone,
        this.highStoneAnchor,
        randomInt(1, 50)
      );
    }

    if (randomInt(0, 100) > 50) {
      this.setShopItem(
        ShopItems.HighDiamond,
        this.highDiamondAnchor,
        randomInt(50, 700)
      );
    }
  };

  onLoad() {
    this.randomShopItem();
  }

  next() {
    cc.director.loadScene("main");
  }
}
