// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

export enum ItemType {
  Gold,
  Stone,
  //宝箱
  Secret,
  Diamond,
  Pig,
  DiamondPig,
  // 火药桶
  Explosive,
  // 火药桶残骸
  Debris,
  Bone,
}

interface CommonItem {
  type: Exclude<ItemType, ItemType.Secret | ItemType.Explosive>;
  price: number;
  volume: number;
  weight: number;
}

export type ItemProps =
  | CommonItem
  | {
      type: ItemType.Secret;
    }
  | {
      type: ItemType.Explosive;
    };

export type SecretItem =
  | {
      type: "price";
      value: number;
      weight: number;
    }
  | {
      type: "buff";
      weight: number;
    }
  | {
      type: "bomb";
      weight: number;
    };

@ccclass
export default class Item extends cc.Component {
  @property({ type: cc.Label })
  label: cc.Label = null;

  item: ItemProps;

  // 仅在为宝箱时存在
  secretItem: SecretItem = null;

  /**
   * 为宝箱时调用init之后需要再调用该函数进一步初始化
   */
  initSecret(secretItem: SecretItem) {
    this.secretItem = secretItem;
  }

  init(item: ItemProps) {
    const type = item.type;

    this.item = item;

    if (type === ItemType.Secret) {
      this.label.string = "宝箱";
      this.node.color = new cc.Color(255, 87, 34);
    } else if (type === ItemType.Gold) {
      this.label.string = "黄金";
      this.node.color = new cc.Color(255, 235, 59);
    } else if (type === ItemType.Pig) {
      this.label.string = "猪";
      this.node.color = new cc.Color(255, 155, 185);
    } else if (type === ItemType.Diamond) {
      this.label.string = "钻石";
      this.node.color = new cc.Color(86, 200, 250);
    } else if (type === ItemType.DiamondPig) {
      this.label.string = "钻石猪";
      this.node.color = new cc.Color(33, 150, 243);
    } else if (type === ItemType.Stone) {
      this.label.string = "石头";
      this.node.color = new cc.Color(100, 100, 100);
    } else if (type === ItemType.Bone) {
      this.label.string = "骨头";
      this.node.color = new cc.Color(222, 222, 222);
    } else if (type === ItemType.Explosive) {
      this.label.string = "火药桶";
      this.node.color = new cc.Color(255, 150, 0);
    } else if (type === ItemType.Debris) {
      this.label.string = "碎片";
      this.node.color = new cc.Color(255, 255, 255);
    } else {
      this.label.string = "这是啥";
    }

    if (item.type === ItemType.Secret) {
      this.node.width = 40;
      this.node.height = 40;
    } else if (item.type === ItemType.Explosive) {
      this.node.width = 55;
      this.node.height = 100;
    } else {
      this.node.width = item.volume;
      this.node.height = item.volume;
    }

    const collider = this.node.getComponent(cc.BoxCollider);
    collider.size.width = this.node.width;
    collider.size.height = this.node.height;
  }

  start() {}

  // update (dt) {}
}
