"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PanoTag = PanoTag;
var React = _interopRequireWildcard(require("react"));
var _hooks = require("../../../hooks");
var _VreoUnit = require("../../../../typings/VreoUnit");
var _dnalogel = require("@realsee/dnalogel");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function PanoTag() {
  var timeoutRef = React.useRef();
  var controller = (0, _hooks.useController)();
  var five = (0, _hooks.useFiveInstance)();
  var panoTagPlugin = React.useRef((0, _dnalogel.PanoTagPlugin)(five, {
    config: {
      globalConfig: {
        visibleConfig: {
          keep: 'visible'
        },
        unfoldedConfig: {
          autoUnfold: {
            strategy: 'MinimumDistance'
          },
          unfoldDistance: {
            max: 100
          }
        }
      }
    }
  }));
  React.useEffect(function () {
    var _controller$configs;
    if (((_controller$configs = controller.configs) === null || _controller$configs === void 0 ? void 0 : _controller$configs.keyframeMap.PanoTag) === false) {
      return;
    }
    var callback = function callback(keyframe) {
      if (!panoTagPlugin.current) return;
      var start = keyframe.start,
        end = keyframe.end,
        data = keyframe.data;
      var panoTagData = data;
      var id = Date.now().toString();
      var pointType = _dnalogel.PointType.PointTag;
      var dimensionType = _dnalogel.DimensionType.Two;
      var position = [panoTagData.vertex.x, panoTagData.vertex.y, panoTagData.vertex.z];
      var tag = function () {
        if (panoTagData.imgUrl) {
          return {
            id: id,
            pointType: pointType,
            position: position,
            dimensionType: dimensionType,
            contentType: _dnalogel.ContentType.ImageText,
            data: {
              text: panoTagData.text,
              mediaData: [{
                type: 'Image',
                url: panoTagData.imgUrl
              }]
            }
          };
        } else {
          return {
            id: id,
            pointType: pointType,
            position: position,
            dimensionType: dimensionType,
            contentType: _dnalogel.ContentType.Text,
            data: {
              text: panoTagData.text
            }
          };
        }
      }();

      // show
      panoTagPlugin.current.load({
        tagList: [tag]
      });
      timeoutRef.current = setTimeout(function () {
        var _tag$hooks;
        // clear
        var tag = panoTagPlugin.current.getTagById(id);
        if (!tag) return;
        if (tag.state) {
          tag.state.unfolded = false;
          panoTagPlugin.current.updateRenderAllTags();
        }
        (_tag$hooks = tag.hooks) === null || _tag$hooks === void 0 ? void 0 : _tag$hooks.on('folded', function () {
          setTimeout(function () {
            if (tag.state) {
              tag.state.visible = false;
              panoTagPlugin.current.destroyTagById(id);
            }
          }, 1500);
        });
      }, end - start);
    };
    controller.on(_VreoUnit.VreoKeyframeEnum.PanoTag, callback);
    return function () {
      controller.off(_VreoUnit.VreoKeyframeEnum.PanoTag, callback);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [controller]);
  return null;
}