import React, { useState } from "react";

const ImagesContext = React.createContext({
    images: {},
    updateImages: () => { },
    deleteImages: () => { },
    deleteAllImages: () => { },
})

export const ImagesContextProvider = (props) =>
{

    const [images, setImages] = useState({})

    const updateImages = (name, images) =>
    {
        setImages((prev) =>
        {
            return {
                ...prev,
                [name]: images
            }
        })
    }

    const deleteImages = (name) =>
    {
        delete images[name];
    }
    const deleteAllImages = () =>
    {
        setImages({});
    }

    const contextValue = {
        images: images,
        updateImages: updateImages,
        deleteImages: deleteImages,
        deleteAllImages: deleteAllImages,
    }

    return (
        <ImagesContext.Provider value={contextValue}>
            {props.children}
        </ImagesContext.Provider>
    )
}

export default ImagesContext;