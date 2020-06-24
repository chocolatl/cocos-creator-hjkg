// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ItemType, ItemProps } from "./item";

// 物品所在位置，坐标系原点为左下方
interface Position {
  x: number;
  y: number;
}

// 物品是否会移动，指定direction后物品将会移动
interface Movement {
  // 初始移动方向
  moveDirection?: "left" | "right";
}

type ItemConfig = ItemProps & Position & Movement;

interface LevelConfig {
  targetScore: number;
  levelItems: ItemConfig[];
}

const gold = (
  x: number,
  y: number,
  volume: "s" | "m" | "l" | "xl"
): ItemConfig => {
  const o = { type: ItemType.Gold, x, y };
  const v =
    volume === "s"
      ? {
          volume: 20,
          price: 50,
          weight: 120,
        }
      : volume === "m"
      ? {
          volume: 40,
          price: 100,
          weight: 220,
        }
      : volume === "l"
      ? {
          volume: 80,
          price: 250,
          weight: 320,
        }
      : {
          volume: 100,
          price: 500,
          weight: 420,
        };
  return { ...o, ...v };
};

const stone = (x: number, y: number, volume: "s" | "m" | "l"): ItemConfig => {
  const o = { type: ItemType.Stone, x, y };
  const v =
    volume === "s"
      ? {
          volume: 20,
          price: 20,
          weight: 300,
        }
      : volume === "m"
      ? {
          volume: 40,
          price: 50,
          weight: 375,
        }
      : {
          volume: 60,
          price: 70,
          weight: 435,
        };
  return { ...o, ...v };
};

const diamond = (x: number, y: number, price: number): ItemConfig => ({
  type: ItemType.Diamond,
  volume: 20,
  price: price,
  weight: 20,
  x,
  y,
});

const secret = (x: number, y: number): ItemConfig => ({
  type: ItemType.Secret,
  x,
  y,
});

const pig = (
  x: number,
  y: number,
  moveDirection: Movement["moveDirection"]
): ItemConfig => ({
  type: ItemType.Pig,
  volume: 30,
  price: 2,
  weight: 20,
  x,
  y,
  moveDirection,
});

const diamondPig = (
  x: number,
  y: number,
  price: number,
  moveDirection: Movement["moveDirection"]
): ItemConfig => ({
  type: ItemType.DiamondPig,
  volume: 30,
  price,
  weight: 20,
  x,
  y,
  moveDirection,
});

const bone = (x: number, y: number): ItemConfig => ({
  type: ItemType.Bone,
  volume: 40,
  price: 30,
  weight: 20,
  x,
  y,
});

const explosive = (x: number, y: number): ItemConfig => ({
  type: ItemType.Explosive,
  x,
  y,
});

export const levelsConfig: LevelConfig[] = [
  {
    targetScore: 650,
    levelItems: [
      gold(210, 530, "s"),
      stone(140, 440, "m"),
      gold(140, 320, "xl"),
      gold(245, 140, "m"),
      gold(340, 410, "s"),
      stone(355, 80, "l"),
      gold(450, 210, "m"),
      gold(625, 390, "m"),
      secret(695, 75),
      stone(760, 270, "l"),
      gold(810, 405, "s"),
      gold(810, 350, "s"),
      gold(860, 470, "s"),
      stone(880, 520, "l"),
      gold(1020, 260, "xl"),
    ],
  },
  {
    targetScore: 1195,
    levelItems: [
      gold(70, 170, "xl"),
      gold(80, 225, "m"),
      stone(165, 400, "l"),
      gold(215, 220, "s"),
      stone(315, 270, "l"),
      secret(350, 125),
      gold(365, 320, "s"),
      stone(445, 215, "m"),
      gold(510, 410, "s"),
      stone(600, 225, "l"),
      gold(645, 350, "s"),
      gold(715, 95, "xl"),
      diamond(770, 260, 600),
      stone(785, 335, "m"),
      stone(840, 70, "l"),
      gold(830, 520, "s"),
      stone(900, 470, "m"),
      gold(920, 355, "s"),
      gold(940, 115, "m"),
    ],
  },
  {
    targetScore: 2010,
    levelItems: [
      secret(120, 495),
      gold(145, 340, "m"),
      gold(190, 535, "s"),
      gold(190, 475, "s"),
      stone(200, 230, "l"),
      gold(255, 530, "s"),
      stone(540, 400, "m"),
      gold(710, 90, "m"),
      gold(725, 380, "s"),
      stone(745, 265, "l"),
      stone(790, 330, "m"),
      stone(790, 195, "m"),
      diamond(820, 260, 600),
      stone(885, 320, "l"),
      stone(900, 230, "l"),
      gold(970, 370, "m"),
    ],
  },
  {
    targetScore: 3095,
    levelItems: [
      gold(65, 420, "s"),
      gold(70, 220, "m"),
      stone(150, 220, "l"),
      pig(225, 410, "right"),
      gold(230, 135, "l"),
      gold(310, 215, "s"),
      stone(330, 70, "l"),
      pig(340, 510, "right"),
      gold(360, 230, "s"),
      secret(455, 170),
      stone(535, 215, "m"),
      gold(630, 175, "l"),
      gold(675, 260, "m"),
      gold(725, 290, "s"),
      secret(820, 240),
      pig(840, 470, "left"),
      stone(925, 230, "l"),
      gold(970, 295, "m"),
    ],
  },
  {
    targetScore: 4450,
    levelItems: [
      gold(15, 130, "xl"),
      gold(130, 310, "m"),
      diamond(130, 135, 600),
      gold(190, 525, "s"),
      stone(225, 455, "l"),
      gold(230, 180, "s"),
      gold(270, 500, "s"),
      pig(300, 215, "left"),
      stone(340, 245, "l"),
      gold(355, 85, "l"),
      gold(395, 330, "m"),
      pig(430, 220, "right"),
      stone(600, 280, "m"),
      gold(620, 130, "l"),
      gold(660, 280, "s"),
      pig(675, 380, "left"),
      secret(745, 115),
      stone(810, 375, "l"),
      diamond(850, 95, 600),
      gold(870, 430, "m"),
      diamond(940, 170, 600),
      gold(1070, 175, "l"),
    ],
  },
  {
    targetScore: 6075,
    levelItems: [
      gold(50, 160, "m"),
      stone(110, 450, "l"),
      gold(160, 80, "m"),
      stone(185, 250, "m"),
      gold(240, 215, "s"),
      diamondPig(355, 165, 702, "right"),
      gold(375, 105, "s"),
      stone(405, 445, "m"),
      gold(475, 70, "xl"),
      diamondPig(505, 385, 702, "left"),
      diamondPig(580, 385, 702, "right"),
      stone(585, 250, "l"),
      gold(655, 230, "s"),
      gold(720, 50, "m"),
      stone(758, 455, "m"),
      gold(815, 200, "s"),
      gold(835, 100, "s"),
      diamondPig(840, 320, 702, "left"),
      gold(855, 230, "s"),
      secret(860, 160),
      gold(940, 170, "s"),
      stone(1010, 250, "l"),
    ],
  },
  {
    targetScore: 7970,
    levelItems: [
      gold(25, 310, "s"),
      pig(40, 485, "right"),
      gold(45, 90, "xl"),
      bone(125, 430),
      pig(125, 245, "right"),
      bone(125, 155),
      secret(230, 380),
      explosive(310, 330),
      pig(310, 110, "left"),
      gold(350, 190, "l"),
      bone(410, 315),
      gold(490, 30, "xl"),
      gold(560, 250, "s"),
      gold(650, 175, "xl"),
      pig(700, 455, "left"),
      explosive(700, 330),
      bone(805, 410),
      pig(910, 255, "left"),
      gold(955, 400, "l"),
      pig(1010, 500, "left"),
    ],
  },
  {
    targetScore: 10135,
    levelItems: [
      secret(40, 180),
      diamond(180, 255, 700),
      explosive(260, 165),
      diamondPig(310, 450, 702, "right"),
      explosive(380, 300),
      diamond(420, 50, 700),
      diamond(460, 490, 700),
      explosive(530, 440),
      diamond(560, 510, 700),
      diamond(520, 50, 700),
      diamond(600, 50, 700),
      diamond(630, 385, 700),
      diamondPig(635, 205, 702, "left"),
      explosive(660, 310),
      diamondPig(740, 335, 702, "left"),
      explosive(775, 140),
      diamond(800, 220, 700),
      secret(1000, 190),
    ],
  },
  {
    targetScore: 12570,
    levelItems: [
      explosive(20, 200),
      secret(40, 365),
      explosive(75, 160),
      diamond(125, 270, 700),
      diamond(130, 605, 700),
      diamond(210, 45, 700),
      gold(225, 150, "xl"),
      diamondPig(290, 290, 702, "right"),
      explosive(315, 20),
      secret(395, 90),
      gold(485, 470, "s"),
      diamondPig(485, 425, 702, "right"),
      bone(545, 170),
      diamondPig(570, 330, 702, "left"),
      explosive(610, 20),
      diamondPig(700, 230, 702, "left"),
      explosive(730, 420),
      gold(770, 130, "xl"),
      diamond(825, 260, 700),
      explosive(900, 50),
      bone(930, 125),
      diamond(940, 370, 700),
      secret(990, 230),
      diamond(1005, 120, 700),
      explosive(1040, 510),
      diamond(1040, 400, 700),
      explosive(1040, 255),
    ],
  },
  {
    targetScore: 15275,
    levelItems: [
      gold(70, 345, "l"),
      gold(90, 420, "s"),
      gold(130, 160, "xl"),
      gold(70, 345, "l"),
      gold(180, 255, "m"),
      gold(225, 340, "s"),
      gold(70, 345, "l"),
      gold(240, 235, "s"),
      stone(245, 450, "l"),
      stone(245, 180, "l"),
      gold(270, 35, "l"),
      gold(320, 120, "m"),
      gold(435, 215, "m"),
      gold(470, 90, "xl"),
      stone(510, 370, "l"),
      gold(590, 240, "l"),
      gold(615, 330, "s"),
      stone(625, 160, "l"),
      gold(690, 120, "m"),
      gold(730, 340, "s"),
      stone(760, 470, "l"),
      gold(790, 230, "xl"),
      gold(825, 445, "s"),
      gold(900, 380, "l"),
      gold(975, 180, "m"),
      gold(1010, 50, "xl"),
      gold(1030, 250, "xl"),
    ],
  },
];
