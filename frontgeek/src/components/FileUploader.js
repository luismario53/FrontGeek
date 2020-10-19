import React from 'react';
import { Button } from 'react-bootstrap';

const FileUploader = props => {
    const hiddenFileInput = React.useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        props.handleFile(fileUploaded);
    };
    return (
        <>
            <Button variant="info" onClick={handleClick}>Subir foto</Button>
            <input type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: 'none' }}
            />
        </>
    );
};
export default FileUploader;