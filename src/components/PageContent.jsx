import React from 'react';

// Styles
import '../styles/PageContent.css';

function PageContent(props) {
    return (           
        <main className='pageContent'>
            {props.children}
        </main>
    );
}

export { PageContent };