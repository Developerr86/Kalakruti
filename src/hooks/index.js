// Custom hooks for the Artist Marketplace

import { useState, useEffect } from 'react';
import { 
  getFromLocalStorage, 
  saveToLocalStorage, 
  CART_STORAGE_KEY,
  addToCart as addToCartUtil,
  removeFromCart as removeFromCartUtil,
  updateCartItemQuantity as updateCartItemQuantityUtil,
  calculateCartTotal,
  calculateCartItemCount
} from '../utils/helpers';

// Cart management hook
export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = getFromLocalStorage(CART_STORAGE_KEY, []);
    setCartItems(savedCart);
    setIsLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveToLocalStorage(CART_STORAGE_KEY, cartItems);
    }
  }, [cartItems, isLoading]);

  const addToCart = (artwork, quantity = 1) => {
    setCartItems(currentCart => addToCartUtil(currentCart, artwork, quantity));
  };

  const removeFromCart = (artworkId) => {
    setCartItems(currentCart => removeFromCartUtil(currentCart, artworkId));
  };

  const updateQuantity = (artworkId, newQuantity) => {
    setCartItems(currentCart => updateCartItemQuantityUtil(currentCart, artworkId, newQuantity));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (artworkId) => {
    return cartItems.some(item => item.id === artworkId);
  };

  const getItemQuantity = (artworkId) => {
    const item = cartItems.find(item => item.id === artworkId);
    return item ? item.quantity : 0;
  };

  const cartTotal = calculateCartTotal(cartItems);
  const itemCount = calculateCartItemCount(cartItems);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    cartTotal,
    itemCount,
    isLoading
  };
};

// Local storage hook for generic data persistence
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    return getFromLocalStorage(key, initialValue);
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      saveToLocalStorage(key, value);
    } catch (error) {
      console.error(`Error setting localStorage key \"${key}\":`, error);
    }
  };

  return [storedValue, setValue];
};

// Window size hook for responsive design
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
    isMobile: false,
    isTablet: false,
    isDesktop: false
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({
        width,
        height,
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
        isDesktop: width > 1024
      });
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Scroll position hook
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollPosition = () => {
      const scrollY = window.pageYOffset;
      setScrollDirection(scrollY > lastScrollY ? 'down' : 'up');
      setScrollPosition(scrollY);
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', updateScrollPosition, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollPosition);
  }, []);

  return { scrollPosition, scrollDirection };
};

// Intersection observer hook for scroll animations
export const useIntersectionObserver = (options = {}) => {
  const [ref, setRef] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options
      }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, hasIntersected, options]);

  return [setRef, isIntersecting, hasIntersected];
};

// Debounced value hook for search
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Toggle hook for modals, dropdowns, etc.
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue(prev => !prev);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);

  return [value, { toggle, setTrue, setFalse, setValue }];
};

// Image loading hook
export const useImageLoader = (src) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setIsLoaded(false);

    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };

    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { isLoaded, hasError, isLoading };
};

// Form management hook
export const useForm = (initialValues, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouchedFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const setTouched = (name) => {
    setTouchedFields(prev => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const rules = validationRules[field];
      const value = values[field];
      
      for (const rule of rules) {
        const error = rule(value, values);
        if (error) {
          newErrors[field] = error;
          break;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (onSubmit) => {
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouchedFields(allTouched);
    
    if (validate()) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouchedFields({});
    setIsSubmitting(false);
  };

  const isValid = Object.keys(errors).length === 0;
  const hasErrors = Object.keys(errors).length > 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setTouched,
    validate,
    handleSubmit,
    reset,
    isValid,
    hasErrors
  };
};

// Enhanced smooth scroll hook with custom easing
export const useSmoothScroll = () => {
  const scrollToElement = (elementId, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const targetPosition = element.offsetTop - offset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = Math.min(Math.abs(distance) / 2, 1000); // Dynamic duration
      let start = null;

      const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      const animation = (currentTime) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };
      
      requestAnimationFrame(animation);
    }
  };

  return { scrollToElement };
};

// Advanced scroll animation hook with multiple effects
export const useScrollAnimation = (threshold = 0.1, triggerOnce = true) => {
  const [ref, setRef] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        
        if (isIntersecting && (!triggerOnce || !hasTriggered)) {
          setIsVisible(true);
          setHasTriggered(true);
        } else if (!triggerOnce) {
          setIsVisible(isIntersecting);
        }

        // Enhanced scroll progress calculation with velocity
        if (isIntersecting) {
          const rect = entry.boundingClientRect;
          const windowHeight = window.innerHeight;
          const elementTop = rect.top;
          const elementHeight = rect.height;
          
          // Progress from 0 to 1 as element moves through viewport
          const progress = Math.max(0, Math.min(1, 
            (windowHeight - elementTop) / (windowHeight + elementHeight)
          ));
          setScrollProgress(progress);

          // Calculate scroll velocity for dynamic effects
          const currentScrollY = window.pageYOffset;
          const newVelocity = Math.abs(currentScrollY - lastScrollY);
          setVelocity(Math.min(newVelocity, 20)); // Cap velocity
          setLastScrollY(currentScrollY);
        }
      },
      { 
        threshold: Array.from({length: 100}, (_, i) => i / 100),
        rootMargin: '-5% 0px -5% 0px'
      }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold, triggerOnce, hasTriggered, lastScrollY]);

  return [setRef, isVisible, scrollProgress, velocity];
};

// Scroll-driven text animation hook
export const useTextReveal = (staggerDelay = 0.1) => {
  const [ref, setRef] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [words, setWords] = useState([]);

  useEffect(() => {
    if (!ref) return;

    // Split text into words for animation
    const text = ref.textContent;
    const wordArray = text.split(' ');
    setWords(wordArray);
    
    // Clear original text and create animated spans
    ref.innerHTML = wordArray.map((word, index) => 
      `<span class="animated-word" style="display: inline-block; opacity: 0; transform: translateY(20px); transition: all 0.6s ease ${index * staggerDelay}s;">${word}&nbsp;</span>`
    ).join('');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate words in
          const spans = ref.querySelectorAll('.animated-word');
          spans.forEach((span, index) => {
            setTimeout(() => {
              span.style.opacity = '1';
              span.style.transform = 'translateY(0)';
            }, index * (staggerDelay * 1000));
          });
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, staggerDelay]);

  return [setRef, isVisible];
};

// Advanced image reveal animation
export const useImageReveal = (direction = 'up', duration = 0.8) => {
  const [ref, setRef] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          ref.classList.add('reveal-active');
        }
      },
      { threshold: 0.2 }
    );

    // Add reveal styles
    ref.style.overflow = 'hidden';
    ref.style.position = 'relative';
    
    const img = ref.querySelector('img');
    if (img) {
      img.style.transform = getInitialTransform(direction);
      img.style.transition = `transform ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    }

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, direction, duration]);

  const getInitialTransform = (dir) => {
    switch(dir) {
      case 'up': return 'translateY(100%)';
      case 'down': return 'translateY(-100%)';
      case 'left': return 'translateX(100%)';
      case 'right': return 'translateX(-100%)';
      case 'scale': return 'scale(1.3)';
      default: return 'translateY(100%)';
    }
  };

  return [setRef, isVisible];
};

// Magnetic cursor effect hook
export const useMagneticEffect = (strength = 0.3) => {
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const handleMouseMove = (e) => {
      const rect = ref.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      
      ref.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    const handleMouseLeave = () => {
      ref.style.transform = 'translate(0px, 0px)';
    };

    ref.addEventListener('mousemove', handleMouseMove);
    ref.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      ref.removeEventListener('mousemove', handleMouseMove);
      ref.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, strength]);

  return [setRef];
};

// Parallax scrolling hook
export const useParallax = (speed = 0.5, direction = 'vertical') => {
  const [offset, setOffset] = useState(0);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref) return;
      
      const scrolled = window.pageYOffset;
      const elementTop = ref.offsetTop;
      const elementHeight = ref.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate if element is in viewport
      const elementBottom = elementTop + elementHeight;
      const isInViewport = scrolled + windowHeight > elementTop && scrolled < elementBottom;
      
      if (isInViewport) {
        const elementCenter = elementTop + elementHeight / 2;
        const viewportCenter = scrolled + windowHeight / 2;
        const distance = viewportCenter - elementCenter;
        
        if (direction === 'vertical') {
          setOffset(distance * speed);
        } else if (direction === 'horizontal') {
          setOffset(distance * speed);
        } else if (direction === 'rotate') {
          setOffset((distance * speed) / 10); // Smaller values for rotation
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, speed, direction]);

  return [setRef, offset];
};

// Parallax hover effect hook
export const useParallaxHover = (intensity = 1, depth = 1) => {
  const [ref, setRef] = useState(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const handleMouseMove = (e) => {
      const rect = ref.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from center
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);
      
      // Apply intensity and depth
      const moveX = deltaX * intensity * 20;
      const moveY = deltaY * intensity * 20;
      const rotateY = deltaX * depth * 15;
      const rotateX = -deltaY * depth * 15;
      
      setTransform({ x: moveX, y: moveY, rotateX, rotateY });
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setTransform({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
    };

    ref.addEventListener('mousemove', handleMouseMove);
    ref.addEventListener('mouseenter', handleMouseEnter);
    ref.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      ref.removeEventListener('mousemove', handleMouseMove);
      ref.removeEventListener('mouseenter', handleMouseEnter);
      ref.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, intensity, depth]);

  const getHoverStyle = () => ({
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
    transition: isHovering ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  });

  return [setRef, getHoverStyle, isHovering, transform];
};

// Multi-layer parallax hover for complex elements
export const useMultiLayerHover = (layers = []) => {
  const [ref, setRef] = useState(null);
  const [layerTransforms, setLayerTransforms] = useState([]);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const handleMouseMove = (e) => {
      const rect = ref.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);
      
      const transforms = layers.map(layer => {
        const { intensity = 1, depth = 1, invert = false } = layer;
        const multiplier = invert ? -1 : 1;
        
        return {
          x: deltaX * intensity * 15 * multiplier,
          y: deltaY * intensity * 15 * multiplier,
          rotateX: -deltaY * depth * 10 * multiplier,
          rotateY: deltaX * depth * 10 * multiplier,
          scale: 1 + Math.abs(deltaX + deltaY) * intensity * 0.02
        };
      });
      
      setLayerTransforms(transforms);
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setLayerTransforms(layers.map(() => ({
        x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1
      })));
    };

    ref.addEventListener('mousemove', handleMouseMove);
    ref.addEventListener('mouseenter', handleMouseEnter);
    ref.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      ref.removeEventListener('mousemove', handleMouseMove);
      ref.removeEventListener('mouseenter', handleMouseEnter);
      ref.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, layers]);

  const getLayerStyle = (index) => {
    const transform = layerTransforms[index] || { x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1 };
    return {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
      transition: isHovering ? 'none' : 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    };
  };

  return [setRef, getLayerStyle, isHovering, layerTransforms];
};

// Enhanced floating animation hook
export const useFloatingAnimation = (intensity = 1, speed = 1) => {
  const [ref, setRef] = useState(null);
  const [animationId, setAnimationId] = useState(null);

  useEffect(() => {
    if (!ref) return;

    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) * 0.001 * speed;
      const floatY = Math.sin(elapsed) * intensity * 10;
      const floatX = Math.cos(elapsed * 0.5) * intensity * 5;
      const rotate = Math.sin(elapsed * 0.3) * intensity * 2;
      
      ref.style.transform = `translate(${floatX}px, ${floatY}px) rotate(${rotate}deg)`;
      
      const id = requestAnimationFrame(animate);
      setAnimationId(id);
    };
    
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [ref, intensity, speed]);

  return [setRef];
};

// Morphing background effect hook
export const useMorphingBackground = () => {
  const [ref, setRef] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!ref) return;

    const handleMouseMove = (e) => {
      const rect = ref.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
      
      ref.style.background = `radial-gradient(circle at ${x}% ${y}%, 
        rgba(139, 69, 19, 0.1) 0%, 
        rgba(218, 165, 32, 0.05) 40%, 
        transparent 70%)`;
    };

    const handleMouseLeave = () => {
      ref.style.background = '';
    };

    ref.addEventListener('mousemove', handleMouseMove);
    ref.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      ref.removeEventListener('mousemove', handleMouseMove);
      ref.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref]);

  return [setRef, mousePosition];
};

// Multi-layer parallax hook for complex effects
export const useMultiLayerParallax = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getParallaxStyle = (speed = 0.5, direction = 'translateY') => {
    const offset = scrollY * speed;
    
    switch (direction) {
      case 'translateY':
        return { transform: `translateY(${offset}px)` };
      case 'translateX':
        return { transform: `translateX(${offset}px)` };
      case 'scale':
        const scaleValue = 1 + (offset / 1000);
        return { transform: `scale(${Math.max(0.5, Math.min(2, scaleValue))})` };
      case 'rotate':
        return { transform: `rotate(${offset / 10}deg)` };
      case 'opacity':
        const opacityValue = 1 - Math.abs(offset) / 500;
        return { opacity: Math.max(0, Math.min(1, opacityValue)) };
      default:
        return { transform: `translateY(${offset}px)` };
    }
  };

  return { scrollY, getParallaxStyle };
};

// Async data fetching hook
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction(...args);
      setData(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error);
      setStatus('error');
      throw error;
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'pending',
    isError: status === 'error',
    isSuccess: status === 'success',
    isIdle: status === 'idle'
  };
};