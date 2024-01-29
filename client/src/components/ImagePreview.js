const getImageURL = (imageBuffer) => {
  // if image buffer is a relative path render from static backend
  if (imageBuffer.startsWith('/')) {
    return `${process.env.REACT_APP_API_URL}${imageBuffer}`;
  } else {
    return imageBuffer.toString("base64");
  }
}

const ImagePreview = ({ imageBuffer, style, className, id }) => {
  return (
    imageBuffer && 
      <img
        src={getImageURL(imageBuffer)}
        alt="Preview"
        style={style}
        className={className}
        id={id}
        onLoad={() => console.log('Image loaded successfully')}
        onError={(e) => console.error('Error loading image', e)}
      />
  );
};

export default getImageURL;
