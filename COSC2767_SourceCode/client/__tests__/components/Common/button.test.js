import React from 'react';
import { render } from '@testing-library/react';
import Button from '../../../app/components/Common/Button';

describe('Button component', () => {
    it('renders correctly with default props', () => {
        const { asFragment } = render(<Button>Default Button</Button>);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with primary variant', () => {
        const { asFragment } = render(<Button variant="primary">Primary Button</Button>);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with danger variant', () => {
        const { asFragment } = render(<Button variant="danger">Danger Button</Button>);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with custom className', () => {
        const { asFragment } = render(<Button className="custom-class">Custom Class Button</Button>);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with borderless and round props', () => {
        const { asFragment } = render(<Button borderless round={10}>Borderless Round Button</Button>);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with icon and text', () => {
        const { asFragment } = render(<Button icon={<span>Icon</span>} text="Button with Icon" />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with tooltip', () => {
        const { asFragment } = render(<Button tooltip tooltipContent="Tooltip Content">Button with Tooltip</Button>);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with popover', () => {
        const { asFragment } = render(<Button popover popoverContent="Popover Content" popoverTitle="Popover Title">Button with Popover</Button>);
        expect(asFragment()).toMatchSnapshot();
    });
});
