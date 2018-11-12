import React from "react";
import {Button, Glyphicon} from "react-bootstrap";
import "./LoadingButton.css";

export default ({
    isLoading,
    text,
    loadingText,
    className = "",
    disabled = false,
    ...props
}) =>
    <Button
        className={`LoadingButton $(className)`}
        disabled={disabled || isLoading}
        {...props}
    >
        {!isLoading ? text: loadingText}
        {isLoading && <Glyphicon glyph="refresh" className="spinning" />}
    </Button>;