// https://res.cloudinary.com/{cloud_name}/image/upload/v1627999179/{public_id}.jpg
      //so from the above format , lets extract the resource type

// Helper function to determine the resource type
const determineResourceType = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'ico'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'avi', 'mov', 'mkv', 'flv', 'wmv', 'mpeg', 'webm'].includes(extension)) {
      return 'video';
    } else {
      return 'raw'; // for other file types like documents, PDFs, etc.
    }
  };

  export { determineResourceType};