import React from 'react';

const Navbar = (props) => {

    let inp = <input 
    onInput={props.importData}
    id="fileInput"
    className="NavOption"
    type="file"/>

    return (
        <div className="Navbar">
            <span className="BrandName">GymTracker</span>

            <span 
            onClick={props.exportData}
            className="NavOption">
                Export</span>

            <span className="HiddenFileForm NavOption">
                <span 
                onClick={() => {
                    document.getElementById("fileInput").click();
                }}
                 className="">Import</span>
                {inp}
            </span>

            <span 
            onClick={props.clearData}
            className="NavOption">
                Delete all data</span>
            
                
            
        </div>
    );
}



export default Navbar;