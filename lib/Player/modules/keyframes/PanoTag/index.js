import * as React from 'react';
import { useController, useFiveInstance } from "../../../hooks.js";
import { VreoKeyframeEnum } from "../../../../typings/VreoUnit.js";
import { PanoTagPlugin } from '@realsee/dnalogel';
export function PanoTag() {
  var timeoutRef = React.useRef();
  var controller = useController();
  var five = useFiveInstance();
  var panoTagPlugin = React.useRef(PanoTagPlugin(five, {
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
    controller.on(VreoKeyframeEnum.PanoTag, callback);
    return function () {
      controller.off(VreoKeyframeEnum.PanoTag, callback);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [controller]);
  return null;
}