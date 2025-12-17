import React, { Children } from 'react'

const Section = ({ children }) => {
    return (
        <section className='max-w-7xl mx-auto p-32'>
            {children}
        </section>
    )
}

export default Section
