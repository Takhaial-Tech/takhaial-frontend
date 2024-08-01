import { React } from 'react';
import { useSwiper } from 'swiper/react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

export default function SlideNextButton(props)
{
  const swiper = useSwiper();

  return (
    <div >
      
      <Carousel showDots={false} arrows={true} responsive={{ superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 8 }, desktop: { breakpoint: { max: 3000, min: 1024 }, items: 7 }, tablet: { breakpoint: { max: 1024, min: 464 }, items: 7 }, mobile: { breakpoint: { max: 464, min: 0 }, items: 5 } }} className="relative after:content after:h-[1px] after:bg-[red] after:absolute after:left-[0] after:right-[0] after:bottom-[50px]">
        {props.history.map((a, k) => (
          <div
            key={k}
            onClick={() => swiper.slideTo(k)}
            className={'inline-block cursor-pointer leading-tight w-[50px] pt-[130px] pr-[15px] align-bottom text-center font-bold relative before:content before:m-[auto] before:absolute before:left-0 before:right-0 before:bottom-[102px] before:rounded-full transition-all duration-500 after:content after:h-[40px] after:w-[1px] after:m-[auto] after:bg-[red] after:absolute after:left-0 after:right-0 after:bottom-[52px] ' +
              (Boolean(props.activeStep === k) ?
                ' before:h-[15px] before:w-[15px] before:bg-[red] text-[red]' :
                'text-white before:h-[5px] before:w-[5px] before:bg-[#fff]') +
              ' z-10'
            }
          >
            <label>{a.year}</label>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
