import React from 'react';

/**
 * Component for showing file element of todo item
 * @param {Object} props component props object
 * @param {string} props.url url to file
 * @param {string} props.name name of file
 * @return {JSX.Element}
 * @example
 * const url = "url string"
 * const name = "file"
 * return (
 * <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
 */
const File = ({url, name}) => {

    return (
        <div className="file">
            <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
        </div>
    );
};


export default File;