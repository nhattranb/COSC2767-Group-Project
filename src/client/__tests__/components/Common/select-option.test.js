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


import SelectOption from "../../../app/components/Common/SelectOption";
import {expect, jest, test} from "@jest/globals";
import {render} from "@testing-library/react";

test('renders SelectOption correctly', () => {
    const { asFragment } = render(
        <SelectOption
            disabled={false}
            error={null}
            label="Select an option"
            multi={false}
            options={[{ value: 'option1', label: 'Option 1' }]}
            defaultValue={null}
            value={null}
            handleSelectChange={jest.fn()}
        />
    );
    expect(asFragment()).toMatchSnapshot();
});
