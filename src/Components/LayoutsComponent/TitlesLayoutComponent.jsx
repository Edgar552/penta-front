import React from 'react';

function TitlesLayoutComponent(props) {
    return (
        <div className="card-header card-header-primary text-center">
            <h5 className="card-title">
                {props.name}
            </h5>
        </div>
    );
}

export  {TitlesLayoutComponent};