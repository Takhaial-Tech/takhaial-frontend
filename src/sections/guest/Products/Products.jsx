import React, { useState } from 'react'
import ProductsUi from './ProductsUi'

const Products = () =>
{
    const [product, setProduct] = useState(false);

    const products = [
        {
            video: 'sec2.mp4', icon: 'education.svg', title: 'VR',
            description: 'Virtual Reality Digital E-Showrooms. Virtual Reality Custom Vehicle Configurators. Augmented Reality True-To-Life Projections. Augmented Reality Custom Vehicle Configurators.'

        },
        {
            video: 'sec2.mp4', icon: 'healthcare.svg', title: 'AR',

            description: 'Virtual Reality Digital E-Showrooms. Virtual Reality Custom Vehicle Configurators. Augmented Reality True-To-Life Projections. Augmented Reality Custom Vehicle Configurators.'
        },
    ]

    return (
        <ProductsUi
            title="Our Products"
            products={products}
            product={product}
            setProduct={setProduct}
        />
    )
}

export default Products