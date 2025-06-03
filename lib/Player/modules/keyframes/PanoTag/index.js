"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PanoTag = PanoTag;
var React = _interopRequireWildcard(require("react"));
var _hooks = require("../../../hooks");
var _VreoUnit = require("../../../../typings/VreoUnit");
var _dnalogel = require("@realsee/dnalogel");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
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
          autoUnfold: false,
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
      var pointType = 'PointTag';
      var dimensionType = '2D';
      var position = [panoTagData.vertex.x, panoTagData.vertex.y, panoTagData.vertex.z];
      var tag = function () {
        if (panoTagData.imgUrl) {
          return {
            id: id,
            pointType: pointType,
            position: position,
            dimensionType: dimensionType,
            contentType: 'ImageText',
            stickType: '2DPoint',
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
            contentType: 'Text',
            stickType: '2DPoint',
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
      var tagInstance = panoTagPlugin.current.getTagById(id);
      if (tagInstance) {
        tagInstance.state.unfolded = true;
        panoTagPlugin.current.updateRenderAllTags();
      }
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