import React from 'react';
import PropTypes from 'prop-types';
import { getInitials, getAvatarStyle } from '../../utils/avatarUtils.js';

/**
 * Avatar Component - Displays user avatar with initials and gender-based colors
 */
const Avatar = ({
    name,
    gender = 'other',
    size = 'md',
    className = '',
    onClick
}) => {
    const initials = getInitials(name);
    const style = getAvatarStyle(gender);

    const sizeClasses = {
        xs: 'avatar-xs',
        sm: 'avatar-sm',
        md: 'avatar-md',
        lg: 'avatar-lg',
        xl: 'avatar-xl'
    };

    return (
        <div
            className={`avatar ${sizeClasses[size] || sizeClasses.md} ${className}`}
            style={style}
            onClick={onClick}
            title={name}
        >
            {initials}
        </div>
    );
};

Avatar.propTypes = {
    name: PropTypes.string.isRequired,
    gender: PropTypes.oneOf(['male', 'female', 'other']),
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    className: PropTypes.string,
    onClick: PropTypes.func
};

export default Avatar;
