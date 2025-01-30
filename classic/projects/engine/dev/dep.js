/**
 * Created by BoYang on 2015-03-05.
 */
var boFloor = boFloor || {};

(function (namespace) {
  namespace.protoInit = function protoInit(proto, vars, pre, post) {
    var varsLength = vars.length,
      i = 0;

    for ( ; i < varsLength; i++) {
      (function(field, pre, post) {
        if (!pre) {
          pre = function(x) { return x };
        }

        if (!post) {
          post = function() {};
        }

        Object.defineProperty(proto, field, {
          get: function() {
            return this.properties[field];
          },
          set: function(x) {
            this.properties[field] = pre(x);
            post();
            this.notify('update');
          }
        });
      })(vars[i], pre[i], post[i]);
    }
  };

  namespace.rectIntersect = function(rectA, rectB) {
    return !(rectA[0][0] > rectB[1][0] || rectA[0][1] > rectB[1][1] || rectA[1][0] < rectB[0][0] || rectA[1][1] < rectB[0][1]);
  }
})(boFloor);