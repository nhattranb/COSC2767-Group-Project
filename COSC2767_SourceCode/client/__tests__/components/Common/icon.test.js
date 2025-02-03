import React from 'react';
import { render, screen } from '@testing-library/react';

import {describe, expect, it} from "@jest/globals";
import {
    AddressIcon,
    BagIcon,
    BarsIcon,
    CheckIcon,
    CloseIcon,
    FacebookIcon,
    GoogleIcon, RefreshIcon
} from "../../../app/components/Common/Icon"; // Update with your file's relative path

describe('Icon Components', () => {
    // BagIcon
    it('renders Google icon correctly', () => {
        const { asFragment } = render(<GoogleIcon />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('contains the correct SVG attributes', () => {
        const { container } = render(<GoogleIcon />);
        const svgElement = container.querySelector('svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('class', 'google-icon');
        expect(svgElement).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
        expect(svgElement).toHaveAttribute('viewBox', '0 0 533.5 544.3');
    });

    it('contains the correct path elements', () => {
        const { container } = render(<GoogleIcon />);
        const paths = container.querySelectorAll('path');
        expect(paths.length).toBe(4);
        expect(paths[0]).toHaveAttribute('fill', '#4285f4');
        expect(paths[1]).toHaveAttribute('fill', '#34a853');
        expect(paths[2]).toHaveAttribute('fill', '#fbbc04');
        expect(paths[3]).toHaveAttribute('fill', '#ea4335');
    });

    it('renders Address icon correctly', () => {
        const { container } = render(<AddressIcon />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders Bag icon correctly', () => {
        const { container } = render(<BagIcon />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders Bars icon correctly', () => {
        const { container } = render(<BarsIcon />);
        const spanElement = container.querySelector('span');
        expect(spanElement).toBeInTheDocument();
        expect(spanElement).toHaveClass('bars-icon fa fa-bars');
        expect(spanElement).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders Check icon correctly', () => {
        const { container } = render(<CheckIcon />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders Close icon correctly', () => {
        const { container } = render(<CloseIcon />);
        const spanElement = container.querySelector('span');
        expect(spanElement).toBeInTheDocument();
        expect(spanElement).toHaveClass('close-icon');
        expect(spanElement).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders Facebook icon correctly', () => {
        const { container } = render(<FacebookIcon />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });


    it('renders Address icon correctly', () => {
        const { asFragment } = render(<AddressIcon />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders Bag icon correctly', () => {
        const { asFragment } = render(<BagIcon />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders Bars icon correctly', () => {
        const { asFragment } = render(<BarsIcon />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders Check icon correctly', () => {
        const { asFragment } = render(<CheckIcon />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders Close icon correctly', () => {
        const { asFragment } = render(<CloseIcon />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders Facebook icon correctly', () => {
        const { asFragment } = render(<FacebookIcon />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders Refresh icon correctly', () => {
        const { asFragment } = render(<RefreshIcon />);
        expect(asFragment()).toMatchSnapshot();
    });
});
