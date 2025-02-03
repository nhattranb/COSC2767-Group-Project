import React from 'react';
import { render } from '@testing-library/react';
import CarouselSlider from '../../../app/components/Common/CarouselSlider';

describe('CarouselSlider component', () => {
    it('renders correctly with default props', () => {
        const { asFragment } = render(
            <CarouselSlider responsive={{}}>
                <div>Slide 1</div>
                <div>Slide 2</div>
            </CarouselSlider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with swipeable and draggable props', () => {
        const { asFragment } = render(
            <CarouselSlider swipeable draggable responsive={{}}>
                <div>Slide 1</div>
                <div>Slide 2</div>
            </CarouselSlider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with showDots and infinite props', () => {
        const { asFragment } = render(
            <CarouselSlider showDots infinite responsive={{}}>
                <div>Slide 1</div>
                <div>Slide 2</div>
            </CarouselSlider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with autoPlay and keyBoardControl props', () => {
        const { asFragment } = render(
            <CarouselSlider autoPlay keyBoardControl responsive={{}}>
                <div>Slide 1</div>
                <div>Slide 2</div>
            </CarouselSlider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with custom autoPlaySpeed and ssr props', () => {
        const { asFragment } = render(
            <CarouselSlider autoPlaySpeed={3000} ssr responsive={{}}>
                <div>Slide 1</div>
                <div>Slide 2</div>
            </CarouselSlider>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
