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


import { render, fireEvent } from '@testing-library/react';
import {expect, jest, test} from "@jest/globals";
import {Table} from "reactstrap";

describe('Table Component Snapshot', () => {
    const mockClickAction = jest.fn();
    const data = [{ _id: '1', name: 'John Doe' }];
    const columns = [{ dataField: '_id', text: 'ID' }, { dataField: 'name', text: 'Name' }];

    it('matches the snapshot', () => {
        const tree = render(
            <Table
                data={data}
                columns={columns}
                striped
                hover
                condensed
                csv
                search
                clickAction={mockClickAction}
                isRowEvents
            />
        )

        expect(tree).toMatchSnapshot();
    });
});
