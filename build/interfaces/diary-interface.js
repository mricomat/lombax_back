"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStatus = exports.DiaryAction = exports.DiaryType = void 0;
var DiaryType;
(function (DiaryType) {
    DiaryType["Review"] = "REVIEW";
    DiaryType["GameFeel"] = "GAME_FEEl";
    //
    //
})(DiaryType = exports.DiaryType || (exports.DiaryType = {}));
var DiaryAction;
(function (DiaryAction) {
    DiaryAction["Add"] = "ADD";
    DiaryAction["Edit"] = "EDIT";
    DiaryAction["Remove"] = "REMOVE";
})(DiaryAction = exports.DiaryAction || (exports.DiaryAction = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus["WantPlay"] = "WANT_TO_PLAY";
    GameStatus["Playing"] = "PLAYING";
    GameStatus["Beaten"] = "BEATEN";
    GameStatus["Completed"] = "COMPLETED";
    GameStatus["Abandoned"] = "ABANDONED";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));
//# sourceMappingURL=diary-interface.js.map