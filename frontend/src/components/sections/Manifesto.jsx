import React, { useEffect, useRef } from 'react';

export default function Manifesto() {
  const textRef = useRef(null);
  const initialHtmlRef = useRef(null);

  useEffect(() => {
    const manifestoText = textRef.current;
    if (!manifestoText) return;

    // Cache pristine HTML for idempotency across StrictMode remounts
    if (!initialHtmlRef.current) {
      initialHtmlRef.current = manifestoText.innerHTML;
    } else {
      manifestoText.innerHTML = initialHtmlRef.current;
    }

    let wordIndex = 0;
    const wordDelayMs = 40;

    function processNode(node, isHighlight = false) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const parts = text.split(/(\s+)/);
        const frag = document.createDocumentFragment();

        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            const span = document.createElement('span');
            span.className = 'stagger-word' + (isHighlight ? ' stagger-highlight' : '');
            span.style.setProperty('--delay', `${wordIndex * wordDelayMs}ms`);
            span.textContent = part;
            frag.appendChild(span);
            wordIndex++;
          }
        });
        return frag;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const isBold = node.tagName.toLowerCase() === 'b' || isHighlight;
        const elem = document.createElement(node.tagName.toLowerCase());

        Array.from(node.attributes).forEach(attr => elem.setAttribute(attr.name, attr.value));

        Array.from(node.childNodes).forEach(child => {
          elem.appendChild(processNode(child, isBold));
        });
        return elem;
      }
      return node.cloneNode(true);
    }

    const childNodes = Array.from(manifestoText.childNodes);
    const newFragment = document.createDocumentFragment();
    childNodes.forEach(child => {
      newFragment.appendChild(processNode(child));
    });

    manifestoText.innerHTML = '';
    manifestoText.appendChild(newFragment);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          manifestoText.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(manifestoText);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="manifesto">
      <div className="manifesto-content-wrap">
        <div className="eyebrow reveal" style={{ marginBottom: '24px' }}>Studio Manifesto</div>
        <div className="manifesto-text" id="manifestoText" ref={textRef}>
          We believe that technology and growth should be built with <b>architectural discipline</b>, not temporary hacks. We help forward-thinking organizations build <b>scalable digital platforms</b>, deploy <b>high-performance marketing systems</b>, and cultivate the <b>next generation of technology leaders</b> — with zero compromise on craft.
        </div>
      </div>
    </section>
  );
}
