const React = require('react');
const { ReactSortable } = require('react-sortablejs');

const SortableWrapper = (props) => {
  const { options, tag, onChange, children, className } = props;

  const list = React.useMemo(() => {
    return React.Children.map(children, (c) => ({ id: c.key, node: c })) || [];
  }, [children]);

  const setList = (newList) => {
    const newKeys = newList.map((x) => x.id);
    const oldKeys = list.map((x) => x.id);
    if (newKeys.join(',') !== oldKeys.join(',')) {
      onChange(newKeys);
    }
  };

  // ReactSortable expects 'list' and 'setList'.
  // We pass 'list' containing objects with 'id' and the component 'node'.
  // We map the children back from the list in render.
  return React.createElement(
    ReactSortable,
    Object.assign({}, options, {
      list: list,
      setList: setList,
      tag: tag,
      className: className,
    }),
    list.map((item) => item.node),
  );
};

module.exports = SortableWrapper;
module.exports.default = SortableWrapper;