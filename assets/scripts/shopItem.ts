// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export enum ShopItems {
  Bomb,
  Strength,
  Luck,
  HighStone,
  HighDiamond,
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopItem extends cc.Component {
  @property({
    type: cc.Label,
  })
  nameLabel: cc.Label = null;

  @property({
    type: cc.Label,
  })
  priceLabel: cc.Label = null;

  @property({
    type: cc.Sprite,
  })
  iconSprite: cc.Sprite = null;

  public price = -1;

  public description = "";

  public type: ShopItems;

  init = (type: ShopItems, price: number) => {
    if (type === ShopItems.Bomb) {
      this.nameLabel.string = "炸弹";
      this.description =
        "炸药。当你抓到较重而不值钱的物品时，可以按上方向键使用炸药将它炸毁，以便节省时间";
    } else if (type === ShopItems.Strength) {
      this.nameLabel.string = "生力水";
      this.description =
        "生力水。在下一关你的力气将会增加，即抓东西的速度会变快";
    } else if (type === ShopItems.Luck) {
      this.nameLabel.string = "幸运草";
      this.description = "幸运草。在下一关从宝箱中抓到好东西的几率会增加";
    } else if (type === ShopItems.HighStone) {
      this.nameLabel.string = "石头收藏书";
      this.description = "石头收藏书。在下一关石头会变得更值钱";
    } else if (type === ShopItems.HighDiamond) {
      this.nameLabel.string = "优质钻石";
      this.description = "优质钻石。在下一关钻石会变得更值钱";
    }

    this.type = type;
    this.price = price;
    this.priceLabel.string = price.toString();
  };
}
