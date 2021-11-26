/**
 * @fileOverview Find scroll parent
 */

export default (node) => {
  // 边界处理，如果node不是一个有效的HTML元素，就返回html文档流
  if (!(node instanceof HTMLElement)) {
    return document.documentElement;
  }

  const excludeStaticParent = node.style.position === 'absolute';
  const overflowRegex = /(scroll|auto)/;
  let parent = node;

  while (parent) {
    // 如果当前元素没有父节点，就返回node.ownerDocument或着document.documentElement
    if (!parent.parentNode) {
      return node.ownerDocument || document.documentElement;
    }

    /**
     * Window.getComputedStyle()方法返回一个对象，该对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有CSS属性的值。 
     * 私有的CSS属性值可以通过对象提供的API或通过简单地使用CSS属性名称进行索引来访问。
     * https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle
     */
    const style = window.getComputedStyle(parent);
    const position = style.position;
    const overflow = style.overflow;
    const overflowX = style['overflow-x'];
    const overflowY = style['overflow-y'];
    // 判断parant 元素的css属性是否有position且为static和absolute， 如果有就继续检查其父元素节点
    if (position === 'static' && excludeStaticParent) {
      parent = parent.parentNode;
      continue;
    }
    // 判断 parent元素的css属性的overflow是否有scroll或auto,如果有就返回这个父元素节点
    if (overflowRegex.test(overflow) && overflowRegex.test(overflowX) && overflowRegex.test(overflowY)) {
      return parent;
    }

    parent = parent.parentNode;
  }

  return node.ownerDocument || node.documentElement || document.documentElement;
};
