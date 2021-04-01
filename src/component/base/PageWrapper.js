import React from 'react';

const PageWrapper = (props) => {
    return (
        <div style={{height: '100%', display:'flex', flex: 1, flexDirection: 'column'}}>
            {
                props.children
            }
        </div>
    );
}

export default PageWrapper;