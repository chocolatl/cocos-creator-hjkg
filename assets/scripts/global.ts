import { EventEmitter2 } from "eventemitter2";

const defaultBuff = () => {
  return {
    luck: false,
    strength: false,
    highStrength: false,
    highDiamond: false,
    highStone: false,
  };
};

class Global extends EventEmitter2 {
  private _score = 0;

  public get score() {
    return this._score;
  }

  public set score(val) {
    this._score = val;
    this.emit("changeScore", val);
  }

  public level = 1;

  public bombNumber = 0;

  public buff = defaultBuff();

  public resetBuff = () => {
    this.buff = defaultBuff();
  };

  public reset = () => {
    this.level = 1;
    this.score = 0;
    this.bombNumber = 0;
    this.resetBuff();
  };

  public nextLevel = () => {
    this.level++;
    this.resetBuff();
  };
}

export default new Global();
