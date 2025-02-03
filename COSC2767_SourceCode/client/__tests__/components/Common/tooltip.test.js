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


import Tooltip from "../../../app/components/Common/Tooltip";
import {render} from "@testing-library/react";

describe('Tooltip Component Snapshot', () => {
    it('matches the snapshot', () => {
        const tree = render(
            <div>
                <div id="tooltip-target">Hover over me</div>
                <Tooltip target="tooltip-target" placement="bottom">
                    Tooltip Content
                </Tooltip>
            </div>
        )
        expect(tree).toMatchSnapshot();
    });
});
