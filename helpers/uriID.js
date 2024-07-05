// https://res.cloudinary.com/{cloud_name}/image/upload/v1627999179/{public_id}.jpg
      //so from the above format , lets extract the coudinary public id
      const extractPublicIdFromUrl = (url) => {
        const parts = url.split('/');
        const publicIdWithExtension = parts[parts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        //console.log(publicId)
        return publicId;
      };

      export {extractPublicIdFromUrl};