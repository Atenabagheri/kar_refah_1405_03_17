import { PiEye, PiPencilSimpleLine, PiX } from "react-icons/pi";
import ImageUploading, { type ImageListType } from "react-images-uploading";

type ImageType = {
  images: ImageListType;
  setImages: React.Dispatch<React.SetStateAction<ImageListType>>;
};
const GalleryUpload = ({ images, setImages }: ImageType) => {
  const maxNumber = 69;

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex?: Array<number>,
  ): void => {
    // data for submit
    console.log(imageList, typeof addUpdateIndex);
    setImages(imageList);
  };
  return (
    <ImageUploading
      multiple
      value={images}
      onChange={onChange}
      maxNumber={maxNumber}
      dataURLKey="data_url"
    >
      {({
        imageList,
        onImageUpload,
        onImageRemoveAll,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps,
      }) => (
        // write your building UI
        <div className="upload__image-wrapper">
          <button
            style={isDragging ? { color: "red" } : undefined}
            className="text-sm bg-dark/10 text-dark !p-2 rounded-md cursor-pointer shadow-md"
            onClick={onImageUpload}
            {...dragProps}
          >
            انتخاب گالری
          </button>
          &nbsp;
          {imageList.length > 0 && (
            <button
              onClick={onImageRemoveAll}
              className="text-sm bg-rose-200 text-rose-500 !p-2 rounded-md cursor-pointer shadow-md"
            >
              حذف همه
            </button>
          )}
          <div className="flex items-center gap-2 flex-wrap !mt-4">
            {imageList.map((image, index) => (
              <div
                key={index}
                className="image-item rounded-lg overflow-hidden relative shadow-md"
              >
                <img src={image["data_url"]} alt="" width="160" />
                <div className="absolute top-1 left-1 text-white text-lg flex items-center gap-1 bg-black/50 rounded-md">
                  <button
                    onClick={() => console.log({ image, index })}
                    className="cursor-pointer"
                  >
                    <PiEye />
                  </button>
                  <button
                    onClick={() => onImageUpdate(index)}
                    className="cursor-pointer"
                  >
                    <PiPencilSimpleLine />
                  </button>
                  <button
                    onClick={() => onImageRemove(index)}
                    className="cursor-pointer"
                  >
                    <PiX />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ImageUploading>
  );
};

export default GalleryUpload;
