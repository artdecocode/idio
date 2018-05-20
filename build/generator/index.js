"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generate;

var _rqt = _interopRequireDefault(require("rqt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getAll = pages => {
  const allPages = Object.keys(pages).reduce((acc, key) => {
    const aliases = pages[key];
    return [...acc, key, ...aliases];
  }, []);
  return allPages;
};

const getMain = pages => {
  const keys = Object.keys(pages);
  return keys;
};

async function generate(url, pages = {}) {
  const allPages = getMain(pages);
  const promises = allPages.map(async page => {
    const res = await (0, _rqt.default)(`${url}${page}`);
    return {
      [page]: res
    };
  });
  const v = await Promise.all(promises);
  const mv = v.reduce((acc, current) => {
    return { ...acc,
      ...current
    };
  }, {});
  return mv;
}
//# sourceMappingURL=index.js.map