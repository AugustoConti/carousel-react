import React, { useReducer, useEffect, useRef } from 'react';
import Alert from '@reach/alert';
import VisuallyHidden from '@reach/visually-hidden';
import { FaPlay, FaPause, FaBackward, FaForward } from 'react-icons/fa';
import slides from './slides';
import useProgress from './useProgress';
import './App.css';

const SLIDE_DURATION = 2000;

const Carousel = props => <section className="Carousel" {...props} />;

const Slides = props => <ul {...props} />;

const Slide = ({ isCurrent, takeFocus, image, id, title, children }) => {
  const ref = useRef();

  useEffect(() => {
    if (isCurrent && takeFocus) {
      ref.current.focus();
    }
  }, [isCurrent, takeFocus]);

  return (
    <li
      ref={ref}
      aria-hidden={!isCurrent}
      tabIndex="-1"
      aria-labelledby={id}
      className="Slide"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="SlideContent">
        <h2 id={id}>{title}</h2>
        {children}
      </div>
    </li>
  );
};

const SlideNav = props => <ul className="SlideNav" {...props} />;

const SlideNavItem = ({ isCurrent, ...props }) => (
  <li className="SlideNavItem">
    <button {...props} aria-current={isCurrent}>
      <span />
    </button>
  </li>
);

const Controls = props => <div className="Controls" {...props} />;

const IconButton = props => <button className="IconButton" {...props} />;

const ProgressBar = ({ animate, time }) => {
  const progress = useProgress(animate, time);

  return (
    <div className="ProgressBar">
      <div style={{ width: `${progress * 100}%` }} />
    </div>
  );
};

const SpacerGif = ({ width }) => (
  <div style={{ display: 'inline-block', width }} />
);

const App = () => {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'PROGRESS':
        case 'NEXT':
          return {
            ...state,
            takeFocus: false,
            isPlaying: action.type === 'PROGRESS',
            currentIndex: (state.currentIndex + 1) % slides.length
          };
        case 'PREV':
          return {
            ...state,
            takeFocus: false,
            isPlaying: false,
            currentIndex:
              (state.currentIndex - 1 + slides.length) % slides.length
          };
        case 'PLAY':
          return {
            ...state,
            takeFocus: false,
            isPlaying: true
          };
        case 'PAUSE':
          return {
            ...state,
            takeFocus: false,
            isPlaying: false
          };
        case 'GOTO':
          return {
            ...state,
            takeFocus: true,
            isPlaying: false,
            currentIndex: action.index
          };
        default:
          return state;
      }
    },
    {
      currentIndex: 0,
      isPlaying: false,
      takeFocus: false
    }
  );

  useEffect(() => {
    if (state.isPlaying) {
      const timeout = setTimeout(() => {
        dispatch({ type: 'PROGRESS' });
      }, SLIDE_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [state.currentIndex, state.isPlaying]);

  return (
    <Carousel aria-label="Images from Space">
      <Slides>
        {slides.map((image, index) => (
          <Slide
            key={index}
            id={`image-${index}`}
            image={image.img}
            title={image.title}
            isCurrent={index === state.currentIndex}
            takeFocus={state.takeFocus}
            children={image.content}
          />
        ))}
      </Slides>

      <SlideNav>
        {slides.map((slide, index) => (
          <SlideNavItem
            key={index}
            isCurrent={index === state.currentIndex}
            aria-label={`Slide ${index + 1}`}
            onClick={() => {
              dispatch({ type: 'GOTO', index });
            }}
          />
        ))}
      </SlideNav>

      <Controls>
        {state.isPlaying ? (
          <IconButton
            aria-label="Pause"
            onClick={() => {
              dispatch({ type: 'PAUSE' });
            }}
            children={<FaPause />}
          />
        ) : (
          <IconButton
            aria-label="Play"
            onClick={() => {
              dispatch({ type: 'PLAY' });
            }}
            children={<FaPlay />}
          />
        )}
        <SpacerGif width="10px" />
        <IconButton
          aria-label="Previous Slide"
          onClick={() => {
            dispatch({ type: 'PREV' });
          }}
          children={<FaBackward />}
        />
        <IconButton
          aria-label="Next Slide"
          onClick={() => {
            dispatch({ type: 'NEXT' });
          }}
          children={<FaForward />}
        />
      </Controls>

      <ProgressBar
        key={state.currentIndex + state.isPlaying}
        time={SLIDE_DURATION}
        animate={state.isPlaying}
      />

      <VisuallyHidden>
        <Alert>
          Item {state.currentIndex + 1} of {slides.length}
        </Alert>
      </VisuallyHidden>
    </Carousel>
  );
};

export default App;
