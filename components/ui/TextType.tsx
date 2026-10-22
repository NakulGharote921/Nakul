"use client";

import { useEffect, useRef, useState, useMemo, useCallback, type ReactNode } from "react";

type TextTypeTag =
  | "div"
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "strong"
  | "em"
  | "b"
  | "i"
  | "small"
  | "label";

type TextTypeProps = {
  text: string | string[];
  as?: TextTypeTag;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string;
  cursorClassName?: string;
  cursorBlinkDuration?: number;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  startOnInteraction?: boolean;
  reverseMode?: boolean;
};

const TextType = ({
  text,
  as: Component = "div",
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = "",
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  cursorClassName = "",
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  startOnInteraction = false,
  reverseMode = false,
  ...props
}: TextTypeProps): ReactNode => {
  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const initialText = useMemo(() => {
    const first = textArray[0] ?? "";
    return reverseMode ? first.split("").reverse().join("") : first;
  }, [reverseMode, textArray]);

  // Start with the first phrase rendered so the heading is painted before
  // hydration. The typing loop still runs after the initial pause.
  const [displayedText, setDisplayedText] = useState(initialText);
  const [currentCharIndex, setCurrentCharIndex] = useState(initialText.length);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const [hasInteracted, setHasInteracted] = useState(!startOnInteraction);
  const containerRef = useRef<HTMLElement | null>(null);
  const setContainerRef = useCallback((node: HTMLElement | null) => {
    containerRef.current = node;
  }, []);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return 'inherit';
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!startOnInteraction || hasInteracted) return;

    const start = (): void => setHasInteracted(true);
    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "pointermove",
      "keydown",
      "scroll",
      "touchstart",
      "wheel",
    ];

    for (const event of events) {
      window.addEventListener(event, start, { once: true, passive: true });
    }

    return () => {
      for (const event of events) {
        window.removeEventListener(event, start);
      }
    };
  }, [hasInteracted, startOnInteraction]);

  useEffect(() => {
    if (!isVisible || !hasInteracted) return;

    let timeout: NodeJS.Timeout;

    const currentText = textArray[currentTextIndex];
    const processedText = reverseMode ? (currentText?.split("").reverse().join("") ?? "") : (currentText ?? "");

    const executeTypingAnimation = () => {
      if (isDeleting) {
        if (displayedText === '') {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !loop) {
            return;
          }

          const sentence = textArray[currentTextIndex];
          if (onSentenceComplete && sentence) {
            onSentenceComplete(sentence, currentTextIndex);
          }

          setCurrentTextIndex(prev => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
          timeout = setTimeout(() => {}, pauseDuration);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (currentCharIndex < processedText.length) {
          timeout = setTimeout(
            () => {
              setDisplayedText(prev => prev + processedText[currentCharIndex]);
              setCurrentCharIndex(prev => prev + 1);
            },
            variableSpeed ? getRandomSpeed() : typingSpeed
          );
        } else if (textArray.length >= 1) {
          if (!loop && currentTextIndex === textArray.length - 1) return;
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
      timeout = setTimeout(executeTypingAnimation, initialDelay);
    } else {
      executeTypingAnimation();
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
    initialDelay,
    isVisible,
    hasInteracted,
    reverseMode,
    variableSpeed,
    onSentenceComplete
  ]);

  const shouldHideCursor =
    hideCursorWhileTyping &&
    ((textArray[currentTextIndex]?.length ?? 0) > 0 &&
      (currentCharIndex < (textArray[currentTextIndex]?.length ?? 0) || isDeleting));

  return (
    <Component
      ref={setContainerRef}
      className={`inline-block whitespace-pre-wrap tracking-tight ${className}`}
      {...props}
    >
      <span className="inline" style={{ color: getCurrentTextColor() || 'inherit' }}>
        {displayedText}
      </span>
      {showCursor && (
        <span
          aria-hidden="true"
          className={`type-cursor ml-1 inline-block ${shouldHideCursor ? 'hidden' : ''} ${cursorClassName}`}
          style={{ animationDuration: `${cursorBlinkDuration * 2}s` }}
        >
          {cursorCharacter}
        </span>
      )}
    </Component>
  );
};

export default TextType;
export { TextType };
