export default {
  types: {
    // Add serializers for other types if needed
  },
  marks: {
    customSpan: (props) => {
      const spanName = props.mark.spanName;
      return <span class={spanName}>{props.children}</span>;
    },
  },
};
