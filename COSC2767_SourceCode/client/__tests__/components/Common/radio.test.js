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
import { render } from '@testing-library/react';
import Radio from "../../../app/components/Common/Radio";
import {describe, expect, it, jest} from "@jest/globals";


describe ('Radio component', () => {
    it('Radio component matches snapshot', () => {
        const { asFragment } = render(<Radio handleChangeSubmit={() => {}} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
