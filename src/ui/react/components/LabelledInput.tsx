import React, { useState, useEffect } from "react";

interface LabelledInputProps {
  label: string;
  description: string;
  value: any;
  type: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function LabelledInput({
    label,
    description,
    value,
    type,
    onChange,
}:LabelledInputProps) {


  return (
    <div className="workout-days-container">
        <div className="label-description-workout-days">
            <label htmlFor="workout-days-input" className="label-workout-days">
                {label}
            </label>
            <div className="workout-days-description">
                {description}
            </div>
        </div>
        <div>
            <input
            id="workout-days-input"
            type={type}
            value={value}
            onChange={onChange}
            className="input-workout-days"
            />
        </div>
    </div>
  );
}

export default LabelledInput;
