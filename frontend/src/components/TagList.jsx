const TagList = ({ items }) =>
  Array.isArray(items) && items.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {items.map((tag, i) => (
        <span
          key={i}
          className="bg-gray-700 text-xs px-3 py-1 rounded-full text-white"
        >
          {tag}
        </span>
      ))}
    </div>
  ) : (
    <p className="text-sm text-gray-400">No items available</p>
  );

export default TagList;
