
import React from 'react';
import { MEDICAL_DISCLAIMER } from '../constants';

const Disclaimer: React.FC = () => {
    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
            <p className="text-sm text-yellow-800">{MEDICAL_DISCLAIMER}</p>
        </div>
    );
};

export default Disclaimer;
