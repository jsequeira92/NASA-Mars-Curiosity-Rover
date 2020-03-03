import React, { Suspense } from 'react';
import { Loader } from '../Common';

//functional component to display grid of cards containing images and information based on that
const ImageDisplay = ({ images }) => {
    const Card = React.lazy(() => {
        return new Promise(resolve => setTimeout(resolve, 1000)).then(
            () => import('../Common/Card')
        )
    });  //lazy loading the card to render the images
    return images.map(image => (
        <Suspense fallback={<Loader />}>
            <Card
                title={image.camera.full_name}
                subTitle={image.rover.total_photos}
                image={image.img_src}
            />
        </Suspense>
    ));
}

export default ImageDisplay;
