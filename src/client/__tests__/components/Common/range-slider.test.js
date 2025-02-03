/*
 *   RMIT University Vietnam
 *   Course: COSC2767 Systems Deployment and Operations
 *   Semester: 2024C
 *   Assessment: Assignment 2
 *   Author: Le Dinh Ngoc Quynh
 *   ID: s3791159
 *   Created  date: 17 Dec 2024
 *   Last modified: 17 Dec 2024
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RangeSlider from '../../../app/components/Common/RangeSlider';
import {describe, expect, it} from "@jest/globals";

describe('RangeSlider component', () => {
    it('matches snapshot with default props', () => {
        const { asFragment } = render(<RangeSlider onChange={() => {}} defaultValue={[20, 50]} />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with slider type', () => {
        const { getByRole } = render(<RangeSlider type="slider" onChange={() => {}} defaultValue={30} />);
        expect(getByRole('slider')).toBeInTheDocument();
    });
});
