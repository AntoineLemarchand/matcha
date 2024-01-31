const getImageURL = (image) => {
  // if image buffer is a relative path render from static backend
  if (image.startsWith('/')) {
    return `${process.env.REACT_APP_API_URL}${image}`;
  } else {
    return image.toString("base64");
  }
}

const ImagePreview = ({ image, style, className, id }) => {
  return (
    image && image !== "null" &&
      <img
        src={getImageURL(image)}
        alt="Preview"
        style={style}
        className={className}
        id={id}
      />
  );
};

export default ImagePreview;
